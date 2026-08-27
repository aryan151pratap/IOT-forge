import { useEffect, useState } from "react";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { CiMenuBurger } from "react-icons/ci";
import DeviceDetails from "./deviceDetails";
import { AddedDevice } from "../../services/iotService";
import FileManager from "./fileManager";
import { useNotify } from "./notify";

export default function FileExplorer({
	files,
	activeFile,
	onFileSelect,
	setOpenExplorer,
	setCurrentDevice,
	currentDevice,
	trigger,
	onLoadFolder, // optional: (path) => Promise<entries[]> — wire to device read_folder() for lazy loading
}) {
	const [devices, setDevices] = useState([]);
	const [currentFolder, setCurrentFolder] = useState("/");

	useEffect(() => {
		const getAddedDevice = async function () {
			try {
				const data = await AddedDevice();
				if (!data) return;
				setDevices(data);
			} catch (err) {
				console.log(err);
			}
		};
		getAddedDevice();
	}, [trigger]);

	useEffect(() => {
		if (devices.length == 0) return;
		const device = localStorage.getItem("currentDevice");
		console.log(device);
		if (!device) return;
		const findDevice = devices.find((item) => item.device_id === device && item.status === "online");
		if (findDevice) setCurrentDevice(device);
		else localStorage.removeItem("currentDevice");
	}, [devices]);

	

	return (
		<aside className="flex h-full w-full min-h-0 bg-[#0d0d0f] border-r border-zinc-800 text-zinc-300">
			<div className="flex h-full min-h-0 min-w-0 w-60 flex-1 flex-col">
				<div className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-800">
					<div className="flex items-center gap-2">
						<button
							onClick={() => setOpenExplorer(false)}
							className="p-3 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
							title="Close Explorer"
						>
							<CiMenuBurger size={17} />
						</button>

						<span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
							Explorer
						</span>
					</div>

					<div className="flex items-center gap-1">
						<button
							className="rounded p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
							title={`New File in ${currentFolder}`}
						>
							<FiPlus size={15} />
						</button>

						<button
							className="rounded p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
							title="More Actions"
						>
							<FiMoreHorizontal size={15} />
						</button>
					</div>
				</div>

				<div className="flex-1 min-h-0 h-full overflow-y-auto dark-scrollbar">
					<FileManager
						files={files}
						activeFile={activeFile}
						onFileSelect={onFileSelect}
						currentFolder={currentFolder}
						onFolderChange={setCurrentFolder}
						onLoadFolder={onLoadFolder}
					/>
				</div>

				<div className="h-full shrink-0 max-h-[45%] overflow-y-auto border-t border-zinc-800">
					<DeviceDetails devices={devices} setCurrentDevice={setCurrentDevice} currentDevice={currentDevice} />
				</div>
			</div>
		</aside>
	);
}