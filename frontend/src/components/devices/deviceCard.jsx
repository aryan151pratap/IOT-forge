import { FaTrash } from "react-icons/fa";
import { DeleteDevice } from "../../services/iotService";
import { useNotify } from "../Device-IDE/notify";

function DeviceCard({ data = SAMPLE, setTrigger }) {
	const notify = useNotify();
    const humanize = (k) =>
        k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const HEADER_KEYS = [
        "device_id",
        "name",
        "location",
        "status"
    ];

    const SPECIAL_KEYS = [
        "name",
        "device_id",
        "location",
        "firmware",
        "platform",
        "mac_address",
    ];

    const GAUGE_KEYS = {
        temperature: {
            max: 50,
            unit: "°C",
            color: "bg-sky-400"
        },
        humidity: {
            max: 100,
            unit: "%",
            color: "bg-teal-400"
        }
    };

    const STATUS = {
        online: {
            dot: "bg-emerald-400",
            text: "text-emerald-400",
            ring: "ring-emerald-400/20"
        },
        offline: {
            dot: "bg-rose-400",
            text: "text-rose-400",
            ring: "ring-rose-400/20"
        },
        idle: {
            dot: "bg-amber-400",
            text: "text-amber-400",
            ring: "ring-amber-400/20"
        }
    };

    const st = STATUS[data.status] || STATUS.offline;

    const gaugeKeys = Object.keys(data).filter(
        (key) => GAUGE_KEYS[key]
    );

    const restKeys = Object.keys(data).filter(
        (key) =>
            !HEADER_KEYS.includes(key) &&
            !GAUGE_KEYS[key] &&
            !SPECIAL_KEYS.includes(key) &&
            key !== "sensors"
    );

	const handleDelete = async function(){
		try{
			const res = await DeleteDevice(data.device_id);
			setTrigger(e => e+1);
			notify(res.data);
		} catch (err) {
			notify({type: "error", message: err.message});
		}
	}
    return (
        <div className="w-fit bg-neutral-950">
            <div className="w-full overflow-hidden border border-white/10 hover:border-orange-500/50 bg-neutral-900/60 backdrop-blur rounded-lg">

                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-400/80 text-orange-900 font-semibold border border-white/10 font-mono text-sm">
                            {(data.name || "?")
                                .slice(0, 3)
                                .toUpperCase()}
                        </div>
                        <div>
                            <div className="text-sm font-semibold leading-tight text-orange-500">
                                {data.name}
                            </div>
                            <div className="font-mono text-orange-500/50 text-[11px]">
                                {data.device_id}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${st.ring + " " + st.dot +"/10"}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${st.dot} ${
                                data.status === "online"
                                    ? "animate-pulse"
                                    : ""
                            }`}
                        />

                        <span
                            className={`text-[11px] font-medium ${st.text}`}
                        >
                            {humanize(data.status || "unknown")}
                        </span>
                    </div>
                </div>

                {gaugeKeys.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 px-5 pb-4">
                        {gaugeKeys.map((key) => {
                            const { max, unit, color } = GAUGE_KEYS[key];

                            const pct = Math.min(
                                100,
                                (data[key] / max) * 100
                            );

                            return (
                                <div
                                    key={key}
                                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                                >
                                    <div className="text-[10px] uppercase tracking-wide text-neutral-500">
                                        {humanize(key)}
                                    </div>

                                    <div className="mt-1 font-mono text-xl text-white">
                                        {data[key]}
                                        <span className="ml-0.5 text-xs text-neutral-500">
                                            {unit}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className={`h-full rounded-full ${color}`}
                                            style={{
                                                width: `${pct}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {data.location && (
                    <div className="border-t border-white/10 px-5 py-3">
                        <div className="text-[10px] uppercase tracking-wide text-neutral-500">
                            Location
                        </div>

                        <div className="capitalize text-sm text-neutral-200">
                            {data.location}
                        </div>
                    </div>
                )}

                {Array.isArray(data?.sensors) && (
                    <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                        {data.sensors.map((sensor) => (
                            <span
                                key={sensor}
                                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-neutral-300"
                            >
                                {sensor}
                            </span>
                        ))}
                    </div>
                )}

                <div className="border-t border-white/10 divide-y divide-white/5">

                    {SPECIAL_KEYS.map((key) => {
                        if (
                            data[key] === undefined ||
                            data[key] === null
                        ) {
                            return null;
                        }

                        return (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-4 px-5 py-2 text-sm"
                            >
                                <span className="text-neutral-500">
                                    {humanize(key)}
                                </span>

                                <span className="max-w-[65%] truncate text-right font-mono text-neutral-200">
                                    {String(data[key])}
                                </span>
                            </div>
                        );
                    })}

                    {restKeys.map((key) => (
                        <div
                            key={key}
                            className="flex items-center justify-between gap-4 px-5 py-2 text-sm"
                        >
                            <span className="text-neutral-500">
                                {humanize(key)}
                            </span>

                            <span className="font-mono text-neutral-200">
                                {String(data[key])}
                            </span>
                        </div>
                    ))}

                </div>
				<div className="w-full flex items-center p-2 border-t border-zinc-800">
					<button className="ml-auto text-sm bg-red-400/10 font-semibold text-red-500 px-2 p-1 rounded hover:bg-red-500/20 cursor-pointer"
						onClick={() => handleDelete()}
					>
						Delete
					</button>
				</div>
            </div>
        </div>
    );
}

export default DeviceCard;