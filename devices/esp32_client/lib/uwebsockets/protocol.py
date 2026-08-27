import ure as re
import ustruct as struct
import urandom as random
import uasyncio as asyncio

from ucollections import namedtuple


class DummyLogger:

    def debug(self, *args, **kwargs):
        pass


LOGGER = DummyLogger()


OP_CONT = const(0x0)
OP_TEXT = const(0x1)
OP_BYTES = const(0x2)
OP_CLOSE = const(0x8)
OP_PING = const(0x9)
OP_PONG = const(0xa)

CLOSE_OK = const(1000)
CLOSE_GOING_AWAY = const(1001)
CLOSE_PROTOCOL_ERROR = const(1002)
CLOSE_DATA_NOT_SUPPORTED = const(1003)
CLOSE_BAD_DATA = const(1007)
CLOSE_POLICY_VIOLATION = const(1008)
CLOSE_TOO_BIG = const(1009)
CLOSE_MISSING_EXTN = const(1010)
CLOSE_BAD_CONDITION = const(1011)


URL_RE = re.compile(
    r'(wss|ws)://([A-Za-z0-9-\.]+)'
    r'(?:\:([0-9]+))?(/.+)?'
)

URI = namedtuple(
    'URI',
    (
        'protocol',
        'hostname',
        'port',
        'path'
    )
)


class NoDataException(Exception):
    pass


class ConnectionClosed(Exception):
    pass


def urlparse(uri):

    match = URL_RE.match(uri)

    if match:

        protocol = match.group(1)
        host = match.group(2)
        port = match.group(3)
        path = match.group(4)

        if protocol == "wss":

            if port is None:
                port = 443

        elif protocol == "ws":

            if port is None:
                port = 80

        else:
            raise ValueError(
                "Invalid WebSocket protocol"
            )

        return URI(
            protocol,
            host,
            int(port),
            path
        )


class Websocket:

    is_client = False

    def __init__(self, reader, writer):

        self.reader = reader
        self.writer = writer
        self.open = True

    async def read_exactly(self, size):

        data = bytearray()

        while len(data) < size:

            chunk = await self.reader.read(
                size - len(data)
            )

            if not chunk:
                raise NoDataException

            data.extend(chunk)

        return bytes(data)

    async def read_frame(self, max_size=None):

        two_bytes = await self.read_exactly(2)

        byte1, byte2 = struct.unpack(
            "!BB",
            two_bytes
        )

        fin = bool(byte1 & 0x80)
        opcode = byte1 & 0x0f

        mask = bool(byte2 & 0x80)
        length = byte2 & 0x7f

        if length == 126:

            data = await self.read_exactly(2)

            length, = struct.unpack(
                "!H",
                data
            )

        elif length == 127:

            data = await self.read_exactly(8)

            length, = struct.unpack(
                "!Q",
                data
            )

        if max_size is not None and length > max_size:

            await self.close(
                code=CLOSE_TOO_BIG
            )

            return True, OP_CLOSE, None

        mask_bits = None

        if mask:

            mask_bits = await self.read_exactly(4)

        data = await self.read_exactly(length)

        if mask:

            data = bytes(
                b ^ mask_bits[i % 4]
                for i, b in enumerate(data)
            )

        return fin, opcode, data

    async def write_frame(
        self,
        opcode,
        data=b''
    ):

        fin = True
        mask = self.is_client

        length = len(data)

        byte1 = 0x80 if fin else 0
        byte1 |= opcode

        byte2 = 0x80 if mask else 0

        if length < 126:

            byte2 |= length

            header = struct.pack(
                "!BB",
                byte1,
                byte2
            )

        elif length < (1 << 16):

            byte2 |= 126

            header = struct.pack(
                "!BBH",
                byte1,
                byte2,
                length
            )

        elif length < (1 << 64):

            byte2 |= 127

            header = struct.pack(
                "!BBQ",
                byte1,
                byte2,
                length
            )

        else:
            raise ValueError(
                "Frame too large"
            )

        self.writer.write(header)

        if mask:

            mask_bits = struct.pack(
                "!I",
                random.getrandbits(32)
            )

            self.writer.write(mask_bits)

            data = bytes(
                b ^ mask_bits[i % 4]
                for i, b in enumerate(data)
            )

        self.writer.write(data)

        await self.writer.drain()

    async def recv(self):

        if not self.open:
            raise ConnectionClosed()

        while self.open:

            try:

                fin, opcode, data = await self.read_frame()

            except NoDataException:

                self._close()

                raise ConnectionClosed()

            except ValueError:

                self._close()

                raise ConnectionClosed()

            if not fin:
                raise NotImplementedError(
                    "Fragmented frames"
                )

            if opcode == OP_TEXT:

                return data.decode("utf-8")

            elif opcode == OP_BYTES:

                return data

            elif opcode == OP_CLOSE:

                await self.close()

                return None

            elif opcode == OP_PONG:

                continue

            elif opcode == OP_PING:

                await self.write_frame(
                    OP_PONG,
                    data
                )

                continue

            elif opcode == OP_CONT:

                raise NotImplementedError(
                    "Continuation frames"
                )

            else:

                raise ValueError(
                    opcode
                )

    async def send(self, buf):

        if not self.open:
            raise ConnectionClosed()

        if isinstance(buf, str):

            opcode = OP_TEXT
            buf = buf.encode("utf-8")

        elif isinstance(buf, bytes):

            opcode = OP_BYTES

        else:

            raise TypeError(
                "WebSocket data must be str or bytes"
            )

        await self.write_frame(
            opcode,
            buf
        )

    async def close(
        self,
        code=CLOSE_OK,
        reason=''
    ):

        if not self.open:
            return

        buf = (
            struct.pack("!H", code) +
            reason.encode("utf-8")
        )

        try:

            await self.write_frame(
                OP_CLOSE,
                buf
            )

        except Exception:
            pass

        self._close()

    def _close(self):

        if not self.open:
            return

        self.open = False

        try:
            self.writer.close()
        except Exception:
            pass