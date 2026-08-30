import { useEffect, useState } from "react";
import { CiFileOn, CiMenuBurger } from "react-icons/ci";
import { FiRefreshCcw, FiTerminal } from "react-icons/fi";
import { VscClose, VscFileCode, VscPython } from "react-icons/vsc";

const FileHeader = function ({files, openExplorer, setOpenExplorer, activeFile, setActiveFile, setOpenTerminal, handleReconnect}) {
	
	const [activesFiles, setActivesFiles] = useState([]);
	useEffect(() => {
		if(!activeFile) return;
		const findFile = activesFiles.some((i, index) => i.name === activeFile.name);
		if(!findFile){
			setActivesFiles((e) => [...e, activeFile]);
		}
	}, [activeFile])

	return (
		<div className="w-full flex h-10 items-center border-b border-zinc-800 bg-[#0d0d0f]">
			{!openExplorer && (
				<button
					onClick={() => setOpenExplorer(true)}
					className="h-full p-3 text-zinc-500 border-r border-zinc-800 transition hover:bg-zinc-800 hover:text-white cursor-pointer"
					title="Open Explorer"
				>
					<CiMenuBurger size={17} />
				</button>
			)}
			<div className="w-full flex flex-row h-full items-center">
				<div className="h-full items-center flex flex-row text-white text-sm text-zinc-200 overflow-auto dark-scrollbar">
					{activesFiles.map((i, index) => (
						<div key={index} className={`h-full items-center flex gap-2 px-2 cursor-pointer ${activeFile?.name == i.name ? "bg-orange-400/10 border-t-2 border-orange-500" : "hover:bg-zinc-400/10 border-r border-zinc-800 text-zinc-400 hover:text-white"}`}
							onClick={() => setActiveFile(i)}
						>
							{i?.name?.split(".")[1] == "py" ?
								<VscPython className="text-blue-500 h-4 w-4"/>
								:
								<VscFileCode className="text-orange-500 h-4 w-4"/>
							}
							{i?.name}
							<button className="font-thin cursor-pointer hover:bg-zinc-500/20 p-1">
								<VscClose/>
							</button>
						</div>
					))}
				</div>
				<div className="p-2 ml-auto flex flex-row gap-2">
					<button 
						className="flex flex-row items-center gap-2 text-zinc-400 bg-zinc-500/20 text-xs px-2 p-1 hover:bg-purple-500/70 hover:text-white capitalize"
						onClick={() => handleReconnect()}
					>
						<FiRefreshCcw/>
						<span>reconnect</span>
					</button>
					<button className={'ml-auto h-full text-xs text-white px-2 p-1.5 flex flex-row items-center gap-1 bg-zinc-500/20 hover:bg-purple-500/80 hover:text-white text-zinc-400 cursor-pointer'}
						onClick={() => setOpenTerminal(e => !e)}
					>
						<FiTerminal className=""/>
						<span>Terminal</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FileHeader;