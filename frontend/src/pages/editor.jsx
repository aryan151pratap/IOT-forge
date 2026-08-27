import { use, useEffect, useState } from "react";
import EditorFile from "../components/Device-IDE/EditorFile";
import FileExplorer from "../components/Device-IDE/fileExplorer";
import TerminalFile from "../components/Device-IDE/Terminal";
import FileHeader from "../components/Device-IDE/fileHeader";
import {sampleFiles, file} from "../services/fileData.js";
import { sendToBackend, connectDashboard, disconnectDashboard } from "../services/deviceService.js";
import { getconnection, getESP, getFolder } from "../services/iotService.js";
import { userData } from "../services/user.js";
import { useNotify } from "../components/Device-IDE/notify.jsx";
import { VscChevronRight } from "react-icons/vsc";

const lang = {py: "python", txt: "text", css: "css", html: "html", java: "java", js: "javascript"};
const Editor = function ({user}) {
	const [files, setFiles] = useState([]);
	const [activeFile, setActiveFile] = useState(null);
	const [fileData, setFileData] = useState(sampleFiles);

	const [terminal, setTerminal] = useState([]);
	const [openExplorer, setOpenExplorer] = useState(true);
	const [openTerminal, setOpenTerminal] = useState(true);
	const [currentFolder, setCurrentFolder] = useState("");
	const [iotConn, setIotConn] = useState({});
	const [backend, setBackend] = useState(null);
	const [currentDevice, setCurrentDevice] = useState(null);
	const [trigger, setTrigger] = useState(0);
	const notify = useNotify();

	const getIotFiles = async function(path="", operation="list_folder", type="filesystem"){
		try {
			const data = {
				type,
				device_id: currentDevice,
				operation,
				path,
			};
			sendToBackend(data);
			console.log(data);
		} catch (err) {
			notify({type: "error", message: err.message});
		}
	};

	useEffect(() => {
		if(!currentDevice) return;
		getIotFiles();
	}, [currentDevice, iotConn, backend])
	
	useEffect(() => {
		const fetchESP = async () => {
			try {
				if(!currentDevice) return;
				notify({type: "status", message: `${currentDevice} connecting....`});
				const data = await getconnection(currentDevice);
				if(data.status == "online"){
					notify({type: "status", message: `${data?.name} ${data?.status} connected`});
					setIotConn(data);
					localStorage.setItem("currentDevice", currentDevice);
				} else {
					notify(data);
				} 
			} catch (err) {
				notify({type: "error", message: err.message});
				setCurrentDevice(null);
			}
		};
		fetchESP();
	}, [currentDevice]);

	useEffect(() => {
		connectDashboard(
			(data) => {
				console.log("Terminal stream:", data);
				const type = data.type;
				if(type == "terminal") setTerminal((prev) => [...prev, data]);
				else if(type == "IOT") {
					setIotConn(data);
					setTrigger(e => e+1);
				}
				else if(type == "filesystem"){
					const operation = data.operation;
					if(operation == "list_folder") setFiles(data.data);
					else if (operation === "read_file") {
						setFileData((prev) => {
							const currentFile = prev[data.path];
							const updatedFile = {...currentFile, content: (currentFile?.content || "") + data.data};
							setActiveFile(updatedFile);
							return {...prev, [data.path]: updatedFile};
						});
					}
				}
				else if(type == "error") notify({type: data.type, message: data.data});
			},
			(connected) => {
				console.log("Terminal connection:", connected);
				setBackend(connected);
			}
		);

		return () => disconnectDashboard();
	}, []);

	const handleTerminalInput = (data) => {
		const res = {type: "terminal_input", device_id: currentDevice, data};
		setTerminal((e) => [...e, res]); 
		sendToBackend(res);
	};

	const handleFileSelect = (file) => {
		try{
			const data = fileData[file.path];
			console.log(data);
			if(!data){
				getIotFiles(file.path, "read_file");
				notify({type: "status", message: `${file.name} fetching...`});
				const newData = {
					id: file.path,
					name: file.name,
					path: file.path,
					type: file.type,
					content: "",
					language: lang[file.name.split(".")[1]]
				}
				setFileData((e) => ({...e, [file.path]: newData}));
				setActiveFile(newData);
			}else{
				setActiveFile(data);
			}
		} catch (err) {
			notify({type: "error", message: err.message});
		}
	};

	const handleEditorChange = (content) => {
		console.log(content);
		setActiveFile((prevFile) => ({...prevFile, content}));
	};

	const handleClearTerminal = () => {
		setTerminal([]);
	};

	const handleCloseTerminal = () => {
		setOpenTerminal(e => !e);
	};

	const LoadFolders = async function(path){
		console.log(path);
		try{
			const folder = await getFolder(currentDevice, path);
			if(folder.data.length == 0){
				notify({type: "status", message: `${folder.path} Empty`});
				return;
			}
			else return folder.data;
		} catch (err) {
			notify({type: 'error', message: err.message});
		}
	}

	return (
		<div className="flex h-full w-full min-h-0 overflow-hidden 
			scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600"
		>
			<div className="h-full w-fit shrink-0 overflow-hidden">
				{openExplorer &&
					<FileExplorer
						files={files}
						activeFile={activeFile}
						onFileSelect={handleFileSelect}
						setOpenExplorer={setOpenExplorer}
						setCurrentDevice={setCurrentDevice}
						currentDevice={currentDevice}
						trigger={trigger}
						onLoadFolder={LoadFolders}
					/>
				}
			</div>

			<div className="group flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
				<div>
					<FileHeader 
						files={files} openExplorer={openExplorer} setOpenExplorer={setOpenExplorer}
						setActiveFile={setActiveFile} activeFile={activeFile} setOpenTerminal={setOpenTerminal}
					/>
				</div>
				<div className="min-h-0 flex-1 overflow-hidden">
					{activeFile ?
					<EditorFile
						file={activeFile}
						onChange={handleEditorChange}
					/>
					:
					<div className="text-zinc-400 h-full flex items-center justify-center">
						<div className="text-sm font-inter p-4">
							{currentDevice ?
							<div className="flex flex-col gap-2 capitalize">
								<div className="flex flex-wrap">
									<span className="flex flex-row gap-1">
										<span>device</span> 
										<span className="bg-zinc-800 px-1 p-0.5 text-xs border border-zinc-700/50 rounded">{currentDevice}</span>
									</span>
									<span className="px-1 text-green-500">connected...</span>
								</div>
								<div className="px-2 flex justify-center text-xs text-zinc-500/90">Select files to open</div>
							</div>
							:
							<span>not iot device connected</span>
							}
						</div>
					</div>
					}
				</div>
				<div className={`${activeFile ? "opacity-100" : "hidden"} group-hover:opacity-100 transition text-white text-xs p-1 text-zinc-400 bg-zinc-900/80 px-2 border-zinc-800`}>
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
				{openTerminal &&
				<div className="h-[40%] min-h-0 overflow-hidden">
					<TerminalFile
						terminal={terminal}
						setTerminal={setTerminal}
						onClear={handleClearTerminal}
						onClose={handleCloseTerminal}
						onSend={handleTerminalInput}
						iotConn={iotConn}
						backend={backend}
						openTerminal={openTerminal}
					/>
				</div>
				}
				
			</div>
		</div>
	);
};

export default Editor;