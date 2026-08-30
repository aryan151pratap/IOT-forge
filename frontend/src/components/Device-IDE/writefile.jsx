import { useState } from "react";
import { sendToBackend } from "../../services/deviceService.js";
import { VscChevronRight } from "react-icons/vsc";

const CHUNK_SIZE = 512;

const WriteFile = function ({ activeFile, currentDevice, setFileTrigger }) {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	const handleSave = async () => {
		if (!activeFile || saving) return;
		setSaving(true);
		setError(null);

		try {
			sendToBackend({
				type: "filesystem",
				operation: "write_file_start",
				path: activeFile.path,
				device_id: currentDevice
			});

			const content = activeFile.content || "";
			for (let i = 0; i < content.length; i += CHUNK_SIZE) {
				const chunk = content.slice(i, i + CHUNK_SIZE);
				sendToBackend({
					type: "filesystem",
					operation: "write_file",
					path: activeFile.path,
					data: chunk,
					device_id: currentDevice,
				});
			}

			sendToBackend({
				type: "filesystem",
				operation: "write_file_end",
				path: activeFile.path,
				device_id: currentDevice
			});
		} catch (err) {
			console.log(err);
			setError(err?.message || "Failed to save file");
		} finally {
			setSaving(false);
			setFileTrigger(e => e+1);
		}
	};

	return (
		<div className="h-6 border-zinc-800 w-full flex flex-row items-center text-white overflow-hidden">
			<div className={`${activeFile ? "opacity-100" : "hidden"} group-hover:opacity-100 transition text-white text-xs p-1 text-zinc-400 bg-zinc-900/80 px-2 border-zinc-800 overflow-auto`}>
				<div className="flex flex-row items-center overflow-auto hide-scrollbar">
					{activeFile?.path?.split("/").slice(1,).map((i, index) => (
						<div key={index} className="shrink-0 flex flex-row items-center">
							<span>{i}</span>
							<span className="text-green-500 px-0.5">
								<VscChevronRight/>
							</span>
						</div>
					))}
				</div>	
			</div>
			<div className="shrink-0 h-full flex items-center gap-2 ml-auto overflow-hidden">
				<button
					onClick={handleSave}
					disabled={!activeFile || saving}
					className="text-sm px-2 p-2 bg-zinc-700/80 text-zinc-400 hover:bg-purple-500/80 hover:text-white cursor-pointer rounded disabled:opacity-80 disabled:cursor-not-allowed border-l border-zinc-800"
				>
					{saving ? "Saving..." : "Save"}
				</button>
				{error && <span className="text-[11px] text-red-400">{error}</span>}
			</div>
		</div>
	);
};

export default WriteFile;