import { use, useEffect, useState } from "react";
import { FiPlus, FiMoreHorizontal, FiX } from "react-icons/fi";
import { CiMenuBurger } from "react-icons/ci";
import DeviceDetails from "./deviceDetails";
import { AddedDevice } from "../../services/iotService";
import FileManager from "./fileManager";
import { useNotify } from "./notify";
import { VscChevronRight, VscRefresh } from "react-icons/vsc";
import { sendToAgent, sendToBackend } from "../../services/deviceService";
import { handleCreateDevice, handleDeleteDevice } from "../../hooks/fileHandle";

export default function FileExplorer({
	files,
	setFiles,
	activeFile,
	onFileSelect,
	setOpenExplorer,
	setCurrentDevice,
	currentDevice,
	trigger,
	onLoadFolder,
	setFileTrigger
}) {
	const [devices, setDevices] = useState([]);
	const [currentFolder, setCurrentFolder] = useState("/");
	const [createFile, setCreateFile] = useState(false);
	const [input, setInput] = useState("");
	const [entry_type, setEntry_type] = useState("folder");
	const notify = useNotify();

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

	const handleRefresh = function(){
		setFileTrigger(e => e+1);
		notify({type: "status", message: "refreshing..."});
	}

	const handleCreate = function(){
		try{
			handleCreateDevice(currentDevice, entry_type, input, currentFolder);
			setCreateFile(false);
			setInput("");
		} catch (err) {
			console.log(err.message);
			notify({type: "error", message: err.message});
		}
	}

	const handleDelete = function(path){
		try{
			if(currentFolder == path) setCurrentFolder("/");
			handleDeleteDevice(currentDevice, entry_type, path);
			setFiles([]);
			setFileTrigger(e => e+1);
			setCreateFile(false);
		} catch (err) {
			console.log(err.message);
			notify({type: "error", message: err.message});
		}
	}
	return (
		<aside className="flex h-full w-full min-h-0 bg-[#0d0d0f] border-r border-zinc-800 text-zinc-300">
			<div className="flex h-full min-h-0 min-w-0 w-60 flex-1 flex-col">
				<div className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-800">
					<div className="flex items-center gap-2">
						<button
							onClick={() => setOpenExplorer(false)}
							className="p-3 text-zinc-500 transition hover:bg-zinc-800 hover:text-white border-r border-zinc-800"
							title="Close Explorer"
						>
							<CiMenuBurger size={17} />
						</button>

						<span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
							Explorer
						</span>
					</div>

					<div className="flex items-center">
						<button
							className="p-3 text-zinc-500 transition hover:bg-zinc-800 hover:text-white border-l border-r border-zinc-800"
							title={`New File in ${currentFolder}`}
							onClick={() => setCreateFile(e => !e)}
						>
							{!createFile ?
							<FiPlus size={15} />
							:
							<FiX/>
							}
						</button>

						<button
							className="p-3 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
							title="More Actions"
						>
							<FiMoreHorizontal size={15} />
						</button>
					</div>
				</div>
				<div className="overflow-auto hide-scrollbar flex flex-col gap-1 items-center rounded p-1">
					<div className="w-full p-1 bg-zinc-500/10 flex flex-row text-xs text-zinc-400 overflow-auto hide-scrollbar">
						{currentFolder?.split("/").slice(1,).map((i, index) => (
							<div key={index} className="shrink-0 flex flex-row items-center">
								<span>{i}</span>
								<span className="text-green-500 p-0.5 px-1">
									<VscChevronRight/>
								</span>
							</div>
						))}
					</div>
					{createFile &&
					<div className="w-full items-center shrink-0 flex flex-row bg-zinc-500/10 p-1">
						<input type="text" value={input} placeholder="Enter file name..."
						onChange={(e) => setInput(e.target.value)}
						className="w-fit min-w-0 px-2 p-0.5 outline-none placeholder:text-zinc-500 bg-zinc-900 text-xs border border-zinc-500/20 focus:border-purple-500/80"/>
						<div className="flex items-center px-1 ml-auto">
							<select name="" id="" className="bg-zinc-700/50 hover:bg-purple-500/80 text-xs p-0.5 outline-none cursor-pointer"
								value={entry_type}
								onChange={(e) => setEntry_type(e.target.value)}
							>
								<option value="folder" className="bg-zinc-800">folder</option>
								<option value="file" className="bg-zinc-800">file</option>
							</select>
						</div>
						<button className="text-xs p-0.5 px-2 bg-zinc-700/50 hover:bg-purple-500/60"
							onClick={() => handleCreate()}
						>
							save
						</button>
					</div>
					}
				</div>
				<div className="flex-1 min-h-0 h-full overflow-y-auto dark-scrollbar">
					<FileManager
						files={files}
						activeFile={activeFile}
						onFileSelect={onFileSelect}
						currentFolder={currentFolder}
						onFolderChange={setCurrentFolder}
						onLoadFolder={onLoadFolder}
						handleDelete={handleDelete}
					/>
				</div>
				<div className="p-1 w-fit rounded">
					<div className="px-2 p-1 text-xs flex flex-row items-center gap-2 bg-zinc-800/60 hover:bg-purple-500/80 hover:text-white cursor-pointer text-zinc-400 capitalize border border-zinc-900"
						onClick={() => handleRefresh()}
					>
						<VscRefresh className=""/>
						<span>refresh</span>
					</div>
				</div>

				<div className="h-full shrink-0 max-h-[45%] overflow-y-auto border-t border-zinc-800">
					<DeviceDetails devices={devices} setCurrentDevice={setCurrentDevice} currentDevice={currentDevice} />
				</div>
			</div>
		</aside>
	);
}