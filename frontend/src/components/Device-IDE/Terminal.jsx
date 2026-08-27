import { useEffect, useRef, useState } from "react";
import { FiTerminal, FiTrash2, FiX } from "react-icons/fi";
import { getPreviousHistory, getNextHistory } from "../../services/history.js"; 

export default function TerminalFile({terminal, setTerminal, onClear, onClose, onSend, iotConn, backend, openTerminal}) {
	const [input, setInput] = useState(""); 
	const inputRef = useRef(null); 
	const terminalRef = useRef(null); 
	const [history, setHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [connection, setConnection] = useState();

	useEffect(() => { 
		if (terminalRef.current) { 
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight; 
		} 
	}, [terminal]); 

	useEffect(() => {
		setConnection([iotConn, {device_id: "server", status: backend}]);
	}, [backend, iotConn])
	
	const handleKeyDown = (e) => { 
		if (e.key === "Enter" && e.shiftKey) {
			return;
		}
		if (e.key === "Enter") { 
			e.preventDefault(); 
			if (!input.trim()) 
				return; 
			const data = input;
			onSend(data); 
			setHistory(prev => [...prev, input]);
			setHistoryIndex(-1);
			if(data == "clear") setTerminal([]);
			setInput(""); 
		} 
		if (e.key === "ArrowUp") {
			e.preventDefault();
			const result = getPreviousHistory(history, historyIndex);
			setHistoryIndex(result.index);
			setInput(result.value);
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			const result = getNextHistory(history, historyIndex);
			setHistoryIndex(result.index);
			setInput(result.value);
		}
	};

	const handleParentClick = () => {
        inputRef.current?.focus();
    };

	return (
		<section onClick={handleParentClick} className="font-mono h-full flex flex-1 flex-col border-zinc-800 bg-[#09090b] oveflow-auto">
			<div className="flex shrink-0 items-center border-zinc-800 bg-[#111113] overflow-auto hide-scrollbar">
				<div className="flex items-center gap-5 h-full  px-2 border-r border-zinc-800">
					<div className="flex items-center gap-2 text-xs text-white">
						<FiTerminal size={14} />
						TERMINAL
					</div>
				</div>
				<div className="flex flex-row overflow-auto dark-scrollbar">
					{connection?.map((i, index) => (
						<div className="flex flex-row text-xs text-white border-r border-zinc-800">
							{i?.device_id &&
								<div className="uppercase p-1 bg-zinc-500/10 border-r border-zinc-800">
									{i?.device_id}
								</div>
							}
							{i?.status ? 
								<div className="capitalize text-green-500 p-1 bg-green-500/10">connected</div>
								:
								<div className="capitalize text-red-500 p-1 bg-red-500/10">disconnected</div>
							}
						</div>
					))}
				</div>
				<div className="flex items-center gap-1 ml-auto px-2">
					<button
						onClick={onClear}
						className="rounded p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
					>
						<FiTrash2 size={14} />
					</button>
					<button
						onClick={onClose}
						className="rounded p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
					>
						<FiX size={14} />
					</button>
				</div>
			</div>
			<div ref={terminalRef} className="flex flex-col overflow-auto hide-scrollbar p-2 text-xs leading-4">
				{terminal.map((line, index) => (
					<div
						key={index}
						className={`flex gap-1 break-all ${line.type == "error"
								? "text-red-400"
								: line.type == 'terminal_input'
									? "text-zinc-300"
									: line?.color ? `w-fit text-${line.color}-500 bg-${line.color}-500/20 p-1 mb-1 border-l border-r border-zinc-700` : "text-zinc-400"}
						`}
					>
						{line.type == "terminal_input" && 
							<span className="text-blue-500 flex gap-2">
								<span>{iotConn?.device_id}</span>
								<span>$</span>
							</span>
						}
						<pre className="flex text-wrap break-words break-all">{line?.data}</pre>
					</div>
				))}
				<div className="h-full flex gap-2"> 
					<span className="text-green-500/50">{iotConn?.device_id}</span>
					<span className="text-green-400">$</span> 
					<textarea ref={inputRef} value={input} 
						onChange={(event) => setInput(event.target.value)} 
						onKeyDown={handleKeyDown} 
						autoFocus 
						rows={10}
						className="h-full resize-none flex-1 bg-transparent text-zinc-300 outline-none dark-scrollbar" 
						spellCheck={false} 
					/> 
				</div>
				
			</div>
		</section>
	);
}