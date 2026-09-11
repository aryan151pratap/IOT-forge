import { useEffect, useRef, useState } from "react";
import { FiTerminal, FiTrash2, FiX } from "react-icons/fi";
import { getPreviousHistory, getNextHistory } from "../../services/history.js"; 
import { FaTimes } from "react-icons/fa";
import { FileOutput } from "lucide-react";

export default function TerminalFile({terminal, setTerminal, onClear, onClose, onSend, iotConn, backend, output}) {
	const [input, setInput] = useState(""); 
	const inputRef = useRef(null); 
	const {ref: terminalRef, handleScroll} = useAutoScroll(terminal);
	const [history, setHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [connection, setConnection] = useState();
	const [option, setOption] = useState("terminal");
	
	const options = [
		{
			id: "terminal",
			label: "TERMINAL",
			icon: <FiTerminal size={14} />,
		},
		{
			id: "output",
			label: "OUTPUT",
			icon: <FileOutput size={14} />,
		},
	];

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
		<section onClick={handleParentClick} className="relative group font-mono h-full flex flex-1 flex-col border-zinc-800 bg-[#09090b] oveflow-auto">
			<div className="flex shrink-0 items-center bg-[#111113] overflow-auto hide-scrollbar">
				{options.map((item) => (
					<div
						key={item.id}
						onClick={() => setOption(item.id)}
						className={`
							flex items-center gap-5 h-full px-2
							border-r border-zinc-800 cursor-pointer
							${option === item.id ? "bg-zinc-900" : ""}
						`}
					>
						<div
							className={`
								flex items-center gap-2 text-xs
								${option === item.id ? "text-white" : "text-zinc-500"}
							`}
						>
							{item.icon}
							{item.label}
						</div>
					</div>
				))}
				<div className="flex flex-row overflow-auto dark-scrollbar">
					{connection?.map((i, index) => (
						<div key={index} className="flex flex-row text-xs text-white border-r border-zinc-800">
							<div className="uppercase p-1 bg-zinc-500/10 border-r border-zinc-800">
								{i?.device_id ? i?.device_id : "Device"}
							</div>
							{i?.status ? 
								<div className="capitalize text-green-500 p-1 bg-green-500/10">connected</div>
								:
								<div className="capitalize text-red-500 p-1 bg-red-500/10">disconnected</div>
							}
						</div>
					))}
				</div>
				<div className="flex items-center gap-1 ml-auto">
					<button
						onClick={onClose}
						className="p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
					>
						<FiX size={14} />
					</button>
				</div>
			</div>
			{option == "terminal" ?
			<div ref={handleScroll} className="border-t-0 border-zinc-800 flex flex-col overflow-auto hide-scrollbar p-2 text-xs leading-4">
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
				<div className="group-hover:flex hidden absolute bottom-2 right-2 transition duration-300">
					<button className="flex flex-row items-center gap-1 bg-zinc-800/50 text-zinc-500 hover:bg-purple-600 hover:text-white px-2 p-1 font-inter"
						onClick={onClear}
					>
						clear
					</button>
				</div>
			</div>
			:
			<RawOutput output={output}/>
			}
		</section>
	);
}

const RawOutput = function({output}){
	const [raw, setRaw] = useState(false);
	const {ref: outputRef, handleScroll} = useAutoScroll(output);
	return(
		<div ref={outputRef} onScroll={handleScroll} className="h-full overflow-auto dark-scrollbar">
			<div className="sticky flex h-fit top-0 z-10 p-1">
				<button className={`ml-auto px-2 py-1 text-xs font-inter rounded-sm transition-colors
						${raw
							? "bg-orange-600/50 text-white"
							: "bg-purple-600/50 text-white"
						}
					`}
					onClick={() => setRaw((prev) => !prev)}
				>
					{raw ? "JSON" : "TABLE"}
				</button>
			</div>
			{output?.length > 0 ? (
				<div className="p-2 pb-8 flex flex-col gap-1">
					{output.map((item, index) => (
						<div key={index} className="mb-3">
							{raw ? (
								<pre className="text-xs text-zinc-300">
									{JSON.stringify(item, null, 2)}
								</pre>
							) : (
								<div className="text-xs font-mono">
									{Object.entries(item.data || item).map(
										([key, value]) => (
											<div key={key} className="flex gap-1">
												<span className="text-purple-400">
													{key}:
												</span>
												<span className="text-zinc-300">
													{typeof value === "object"
														? JSON.stringify(value)
														: String(value)}
												</span>
											</div>
										)
									)}
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="h-full bg-zinc-800/20 flex items-center justify-center">
					<div className="text-zinc-500 text-sm">
						No Output
					</div>
				</div>
			)}
		</div>
	)
}


const useAutoScroll = (dependency) => {
	const ref = useRef(null);
	const [autoScroll, setAutoScroll] = useState(true);

	const handleScroll = () => {
		if (!ref.current) return;

		const distance =
			ref.current.scrollHeight -
			ref.current.scrollTop -
			ref.current.clientHeight;

		setAutoScroll(distance < 20);
	};

	useEffect(() => {
		if (!ref.current || !autoScroll) return;

		ref.current.scrollTop = ref.current.scrollHeight;
	}, [dependency, autoScroll]);

	return {
		ref,
		handleScroll,
	};
};