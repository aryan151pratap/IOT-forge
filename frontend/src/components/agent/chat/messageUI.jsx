import { useEffect, useState } from "react";
import { useAgentContext } from "../agentContext";

import {
    LuBrain,
    LuSparkles,
    LuCheck,
    LuChevronDown,
    LuChevronRight,
    LuCircleCheck
} from "react-icons/lu";
import { ChatMessage } from "./chatStyle";
import { useNotify } from "../../Device-IDE/notify";


const MessageUI = function ({ message }) {
    const [open, setOpen] = useState({});
    const notify = useNotify();
    if(message.type === "details") return;
    if (message.type === "thinking") {
        return (
            <div className="text-xs text-zinc-400">
                {message.streaming ? (
                    <div className="flex items-center gap-2 py-2">
                        <div className="relative flex items-center justify-center">
                            <LuBrain size={16} className="text-purple-400 animate-pulse"/>
                            <LuSparkles size={9} className="absolute z-10 -right-1 -top-1 text-purple-300 animate-ping"/>
                        </div>

                        <span className="text-white/80">
                            Thinking
                        </span>


                        <div className="flex gap-1 ml-1">
                            <span className=" w-1 h-1 rounded-full bg-zinc-400 animate-bounce"/>
                            <span
                                className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce"
                                style={{
                                    animationDelay: "150ms"
                                }}
                            />
                            <span
                                className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce"
                                style={{
                                    animationDelay: "300ms"
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 py-2">
                        <LuCheck
                            size={15}
                            className="text-green-400"
                        />
                        <span>
                            Thought
                        </span>
                    </div>
                )}
                {message.content && (
                    <div className="ml-6 text-zinc-500">
                        {message.content}
                    </div>
                )}
            </div>
        );
    }
    if (message.type === "tool_start" || message.type === "tool_end") {
        const isStart =
            message.type === "tool_start";
        const isOpen =
            open[message.id] ?? false;
        const toggleOpen = () => {
            setOpen(prev => ({
                ...prev,
                [message.id]: !isOpen
            }));
        };
        return (
            <div className="my-0.5 text-xs font-mono border border-zinc-800 bg-zinc-900/40 rounded-md">
                <button
                    onClick={toggleOpen}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left bg-zinc-800/20 hover:bg-zinc-800/40 transition"
                >
                    {isOpen ? (
                        <LuChevronDown
                            size={13}
                            className="text-zinc-500"
                        />
                    ) : (
                        <LuChevronRight
                            size={13}
                            className="text-zinc-500"
                        />
                    )}
					<LuCircleCheck
						size={13}
						className="text-green-400"
					/>
                    <span className="text-zinc-400">
						{message?.type == "tool_start"?
                        "Tool Input"
						:
						"Tool Output"
						}
                    </span>
                </button>

                {isOpen && (
                    <div className="max-h-80 flex flex-col gap-1 overflow-y-auto hide-scrollbar border-t border-zinc-800 px-3 py-2 text-zinc-500 bg-black/10">
                        <div className="flex flex-row gap-2 items-center">
                            <span className="text-zinc-200/60 bg-zinc-800/30 hover:bg-zinc-800/40 hover:text-zinc-200/80 px-2 p-1 rounded">{message?.tool}</span>
                        </div>
                        <div>
                            <p>
                                {message.content}
                            </p>
                        </div>
                    </div>
                )}
            </div>

        );
    }
    if(message.type == "error"){
        const [openError, setOpenError] = useState(false);
        const [timer, setTimer] = useState(0);
        useEffect(() => {
            if (message?.retry_time) {
                setTimer(parseInt(message.retry_time)+5);
            }
        }, [message]);
        useEffect(() => {   
            if(timer > 0){
                const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
                return () => clearInterval(interval);
            } else {
                notify({type: "status", "message": "time reset"});
            }
        }, [timer])
        return(
            <div className="bg-zinc-800/20 rounded text-xs border border-zinc-800">
                <div className="p-1 flex flex-row items-center gap-2">
                    <div className="hover:bg-zinc-800 p-1 rounded cursor-pointer"
                        onClick={() => setOpenError(e => !e)}
                    >
                        {openError ? (
                            <LuChevronDown
                                size={13}
                                className="text-zinc-500"
                            />
                        ) : (
                            <LuChevronRight
                                size={13}
                                className="text-zinc-500"
                            />
                        )}
                    </div>
                    <span className="text-red-200/50 capitalize">{message.type}</span>
                    <div className="ml-auto flex flex-row gap-1 items-center">
                        <span className="text-zinc-400 px-2 bg-zinc-800 rounded px-2 p-0.5">
                            {timer} 
                        </span>
                        sec
                    </div>
                </div>
                {openError &&
                <div className="p-2">
                    <div className="max-h-[95px] text-red-400 overflow-auto hide-scrollbar">
                        <pre className="text-wrap">{message.content}</pre>
                    </div>
                </div>
                }
            </div>
        )
    }
    return (
        <div className="w-full font-inter">
            <ChatMessage
                content={message?.content}
                isStreaming={message?.streaming}
                role={message?.role}
            />
        </div>
    );
};


export default MessageUI;
