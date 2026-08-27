import { useState } from "react";
import {FiSend,FiPlus,FiPaperclip,FiTrash2,FiMoreHorizontal} from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { VscCode } from "react-icons/vsc";

const AgentHeader = ({ onClear, setCodePreview, showCodePreview, setShowCodePreview }) => {
	return (
		<header className="z-20 flex h-10 shrink-0 items-center justify-between overflow-auto dark-scrollbar">
			
			<div className="flex items-center gap-1 px-2 ml-auto">
				<button
					className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-zinc-200"
					onClick={() => setCodePreview(e => !e)}
				>
					<VscCode className="font-thin"/>
				</button>
				<button
					className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
					title="New Chat"
				>
					<FiPlus size={16} />
				</button>

				<button
					onClick={onClear}
					className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
					title="Clear Chat"
				>
					<FiTrash2 size={16} />
				</button>

				<button
					className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
					title="More"
				>
					<FiMoreHorizontal size={16} />
				</button>
			</div>
		</header>
	);
};


export default AgentHeader;






