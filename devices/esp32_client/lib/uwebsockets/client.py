import uasyncio as asyncio
import ubinascii as binascii
import urandom as random
import ssl as ussl

from .protocol import Websocket, urlparse


class DummyLogger:
    def debug(self, *args, **kwargs):
        pass


LOGGER = DummyLogger()


class WebsocketClient(Websocket):
    is_client = True


async def connect(uri):

    uri = urlparse(uri)

    if not uri:
        raise ValueError("Invalid WebSocket URL")

    print("Opening connection:", uri.hostname, uri.port)

    reader, writer = await asyncio.open_connection(
        uri.hostname,
        uri.port
    )

    if uri.protocol == "wss":
        raise NotImplementedError("wss is not supported yet")

    key = binascii.b2a_base64(
        bytes(
            random.getrandbits(8)
            for _ in range(16)
        )
    )[:-1]

    def header(value):
        return value + b"\r\n"

    request = (
        b"GET " + (uri.path or "/").encode() + b" HTTP/1.1\r\n"
        b"Host: " + uri.hostname.encode() + b":" +
        str(uri.port).encode() + b"\r\n"
        b"Connection: Upgrade\r\n"
        b"Upgrade: websocket\r\n"
        b"Sec-WebSocket-Key: " + key + b"\r\n"
        b"Sec-WebSocket-Version: 13\r\n"
        b"Origin: http://" + uri.hostname.encode() +
        b":" + str(uri.port).encode() + b"\r\n"
        b"\r\n"
    )

    writer.write(request)
    await writer.drain()

    header_line = await reader.readline()

    if not header_line.startswith(b"HTTP/1.1 101"):
        writer.close()
        raise OSError(
            "WebSocket handshake failed: " +
            str(header_line)
        )

    while True:

        header_line = await reader.readline()

        if not header_line:
            break

        if header_line in (b"\r\n", b"\n"):
            break

    return WebsocketClient(reader, writer)