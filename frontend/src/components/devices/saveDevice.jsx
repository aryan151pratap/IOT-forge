import { useEffect, useState } from "react";
import { Cpu, Loader2, X, Check } from "lucide-react";
import { addDevice, getESP } from "../../services/iotService.js";
import { useNotify } from "../Device-IDE/notify.jsx";

const SaveDevice = ({ addingId, setAddingId }) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [input, setInput] = useState("");
	const notify = useNotify();

	const deviceNotify = function(type, message){
		notify({type, message});
	}

	useEffect(() => {
		setData(e => ({...e, "location": input}));
	}, [input])

	useEffect(() => {
		if (!addingId) return setData(null);
		(async () => {
			setLoading(true);
			try {
				const res = await getESP(addingId);
				if (res.data) setData(res.data);
			} catch (err) { console.error("Failed to get device:", err); }
			finally { setLoading(false); }
		})();
	}, [addingId]);

	const handleSave = async () => {
		if(!input.trim()) {
			deviceNotify("warning", "location input required");
			return;
		}
		setSaving(true);
		try {
			const res = await addDevice(data);
			if(!res.status) {
				deviceNotify("error", "device not saved");
				return;
			}
			deviceNotify("status", res.data.message);
			setAddingId(null);
			setInput("");
		} catch (error) { 
			if (error.response?.status === 409) {
				const msg = error.response.data.detail;
				console.log(msg);
				deviceNotify("error", msg);
			} else console.error("Failed to save device:", error); 
		}
		finally { setSaving(false); }
	};

	const rows = data && [
		["Device ID", data.device_id],
		["Firmware", data.firmware],
		["Platform", data.platform],
		["MAC address", data.mac],
		["Memory", `${Math.round(data.free_memory / 1024)}KB free / ${Math.round(data.heap_total / 1024)}KB`],
	];

	return (
		<div className="h-full w-full flex items-center justify-center overflow-auto">
			<div className="sm:w-full md:max-w-md h-full sm:h-full md:h-fit sm:rounded-0 md:rounded-md md:border border-zinc-800 focus-within:border-cyan-500/50 bg-zinc-400/4 shadow-xl shadow-black/20 backdrop-blur overflow-auto scrollbar-thin">
				{loading ? (
					<div className="w-full flex flex-col items-center gap-2 py-12 text-zinc-500">
						<Loader2 className="h-5 w-5 animate-spin" />
						<p className="text-sm">Loading device…</p>
					</div>
				) : (
					<div className="h-full w-full flex flex-col">
						<div className="w-full flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
								<Cpu className="h-4 w-4" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold text-zinc-100">{data?.name || "New Device"}</p>
								<p className="text-xs text-zinc-500">{data?.device_id || "unconfigured"}</p>
							</div>
							<div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
								<span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
								{data?.status}
							</div>
						</div>

						<div className="flex items-center justify-between gap-3 px-4">
							<label className="shrink-0 text-xs font-medium text-zinc-500">Location</label>
							<input type="text" placeholder="Enter device location"
								value={input} onChange={(e) => setInput(e.target.value)}
								className="w-[60%] border-b border-zinc-100/0 hover:border-orange-500 bg-zinc-800/60 px-2 py-1 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-orange-500"
							/>
						</div>

						<div className="w-full divide-y divide-zinc-800/70 border-y border-zinc-800">
							{rows?.map(([label, value]) => (
								<div key={label} className="px-4 flex items-center justify-between py-1.5 text-sm">
									<span className="text-zinc-500">{label}</span>
									<span className="font-mono text-xs text-zinc-300">{value}</span>
								</div>
							))}
						</div>

						<div className="h-full items-end flex justify-end gap-2 px-4 py-3">
							<button onClick={() => setAddingId(null)}
								className="h-fit flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800">
								<X className="h-3.5 w-3.5" /> Cancel
							</button>
							<button onClick={handleSave} disabled={loading || saving || !data}
								className="h-fit flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40">
								{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
								{saving ? "Saving…" : "Save device"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SaveDevice;