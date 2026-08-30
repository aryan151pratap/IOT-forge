import { useEffect, useState } from "react";

import ChatContainer from "./chat";
import AgentHeader from "./header";
import AgentInput from "./input";

import {connectAgent, sendToAgent, disconnectAgent} from "../../services/deviceService";
import { useAgent } from "../../hooks/useAgent";
import HtmlPreview from "./htmlpreview";
import { useAuth } from "../../AuthContext";
import AgentBackground from "./Agentbackground";

const Agent = () => {
	const [input, setInput] = useState("");	
	const [codePreview, setCodePreview] = useState();
	const [showCodePreview, setShowCodePreview] = useState(false);
	const {loading, setLoading, messages, setMessages, connected, connectionStatus, models} = useAgent();
	const data = useAuth();
	
	const handleSend = (current_model) => {
		setLoading(true);
		const content = input.trim();
		if (!content) return;
		const userMessage = {
			id: Date.now(),
			role: "user",
			content,
			time: "just now",
		};
		setMessages((prev) => [...prev, userMessage,]);
		setInput("");
		sendToAgent({
			type: "message",
			message: content,
			model: current_model
		});
	};

	const handleClear = () => {
		setMessages([]);
	};


	return (
		<div className={`relative ${showCodePreview ? "flex-col" : "flex-row"} font-inter w-full flex h-full border-zinc-800 bg-[#0d0d0f] text-zinc-200 overflow-auto dark-scrollbar`}>
			<AgentBackground />
			<div className={`${codePreview ? "md:flex hidden" : "flex"} relative h-full w-full min-h-0 flex flex-col overflow-hidden`}>
				<AgentHeader onClear={handleClear} codePreview={codePreview} setCodePreview={setCodePreview} showCodePreview={showCodePreview} setShowCodePreview={setShowCodePreview}/>

				<ChatContainer
					messages={messages}
					data={data}
					loading={loading}
				/>

				<div className="shrink-0 ">
                    <AgentInput
                        value={input}
                        onChange={setInput}
                        onSend={handleSend}
                        connected={connected}
                        models={models}
                        connectionStatus={connectionStatus}
                    />
                </div>

				<div className="mb-3"></div>
			</div>
			{codePreview &&
			<div className={`z-50 w-full h-full min-h-0 flex overflow-hidden`}>
				<HtmlPreview setCodePreview={setCodePreview}/>
			</div>
			}
		</div>
	);
};

export default Agent;