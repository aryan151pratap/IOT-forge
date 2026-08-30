import { useEffect, useRef } from "react";
import { ChatMessage } from "./chatStyle";
import { me } from "../../services/authService";
import { useNotify } from "../Device-IDE/notify";
import { BsCopy } from "react-icons/bs";

const ChatContainer = ({ messages, data, loading }) => {
	const chatRef = useRef(null);
	useEffect(() => {
		const container = chatRef.current;

		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages]);
	
	return (
		<div ref={chatRef} className="h-fit min-h-0 w-full min-w-0 flex-1 overflow-auto hide-scrollbar px-4 py-5">
			<div className="max-w-3xl mx-auto flex flex-col gap-5 overflow-auto dark-scrollbar">
				{messages.length === 0 ? (
					<div className="flex flex-1 items-center justify-center py-20 text-center">
						<div>
							<h2 className="text-lg font-semibold text-zinc-300">
								How can I help?
							</h2>

							<p className="mt-2 text-sm text-zinc-500">
							</p>
						</div>
					</div>
				) : (
					messages.map((message) => (
						<ChatType
							key={message.id}
							message={message}
							data={data}
						/>
					))
				)}
			</div>
			{loading &&
			<div className="mt-10 relative w-5 h-5 rounded-full border border-orange-300/10">
				<div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
			</div>
			}
			<div className="h-[40px]"></div>
		</div>
	);
};

export default ChatContainer;

const handleCopy = async (code, notify) => {
	try {
		await navigator.clipboard.writeText(code);
		notify({type: "status", message: "Link copied!"});
	} catch (err) {
		notify({type: "error", message: err.message});
	}
};

const ChatType = ({ message, data }) => {
	const isUser = message.role === "user";
	console.log(message);
	const notify = useNotify();
	return (
		<div
			className={`w-full flex ${
				isUser ? "justify-end" : "justify-start"
			}`}
		>
			<div className={`${isUser ? "max-w-[400px]" : "w-full"} flex flex-col gap-1.5`}>
				{isUser ?
					<div className="ml-auto text-xs text-zinc-200/80 capitalize mt-2">
						<span className="p-1 px-2 rounded-md bg-blue-500/10">{data?.user?.email.split("@")[0]}</span>
					</div>
					:
					<div></div>
			    }
				<pre
					className={`font-inter rounded-xl py-2.5 break-words text-wrap overflow-auto dark-scrollbar ${
						isUser
							? "px-4 max-h-[450px] bg-orange-400/10 text-orange-100/80 text-sm"
							: "text-zinc-300 text-[15px] break-words text-wrap "
					}`}
			    >
					{!isUser ?
						<MessageUI content={message?.content} isStreaming={message?.streaming} role={message?.role}/>
						:
						message.content
					}
			    </pre>
				<div className="flex flex-row">
					<span className={`${isUser ? "ml-auto" : "hidden"} text-zinc-400 hover:text-zinc-300 cursor-pointer`}
						onClick={() => handleCopy(message?.content ,notify)} 
					>
						<BsCopy/>
					</span>
					<span className="text-xs px-2 font-inter first-letter:capitalize text-zinc-400">{message?.time}</span>
				</div>
			</div>
		</div>
	);
};

const MessageUI = function({ content, isStreaming, role }) {
	return (
		<div className="w-full font-inter">
			<ChatMessage content={content} isStreaming={isStreaming} role={role} />
			{/* {content} */}
		</div>
	);
};