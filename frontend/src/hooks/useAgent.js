import { useCallback, useEffect, useRef, useState } from "react";
import { connectAgent, disconnectAgent } from "../services/deviceService";

const BASE_RETRY_MS = 1000;
const MAX_RETRY_MS = 15000;

export const useAgent = () => {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("connecting"); // "connecting" | "connected" | "reconnecting" | "disconnected"
    const [models, setModels] = useState();
    const [loading, setLoading] = useState(false);

    const isMountedRef = useRef(true);
    const manualDisconnectRef = useRef(false);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimerRef = useRef(null);

    const handleAgentMessage = useCallback((data) => {
        console.log("Agent response:", data);

        if (data.type === "model_list") {
            setModels(data);
        }
        if (data.type == "error" || data.streaming === false) {
            setLoading(false);
        }

        setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.streaming) {
                return [
                    ...prev.slice(0, -1),
                    {
                        ...last,
                        content: last.content + (data?.content || ""),
                    },
                ];
            }
            return [
                ...prev,
                {
                    id: Date.now(),
                    role: "assistant",
                    content: data?.content || "",
                    streaming: true,
                },
            ];
        });
    }, []);

    const clearReconnectTimer = () => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    };

    const scheduleReconnect = useCallback(() => {
        if (!isMountedRef.current || manualDisconnectRef.current) return;

        clearReconnectTimer();

        const attempt = reconnectAttemptsRef.current;
        const delay = Math.min(BASE_RETRY_MS * 2 ** attempt, MAX_RETRY_MS);
        reconnectAttemptsRef.current = attempt + 1;

        setConnectionStatus("reconnecting");

        reconnectTimerRef.current = setTimeout(() => {
            if (!isMountedRef.current || manualDisconnectRef.current) return;
            connectAgent(handleAgentMessage, handleConnection);
        }, delay);
    }, [handleAgentMessage]);

    const handleConnection = useCallback(
        (status) => {
            console.log("Agent connection:", status);

            if (status) {
                reconnectAttemptsRef.current = 0;
                clearReconnectTimer();
                setConnectionStatus("connected");
            } else {
                if (manualDisconnectRef.current) {
                    setConnectionStatus("disconnected");
                } else {
                    scheduleReconnect();
                }
            }
        },
        [scheduleReconnect]
    );

    useEffect(() => {
        isMountedRef.current = true;
        manualDisconnectRef.current = false;
        reconnectAttemptsRef.current = 0;

        setConnectionStatus("connecting");
        connectAgent(handleAgentMessage, handleConnection);

        return () => {
            isMountedRef.current = false;
            manualDisconnectRef.current = true;
            clearReconnectTimer();
            disconnectAgent();
        };
    }, []);

    return {
        loading,
        setLoading,
        messages,
        setMessages,
        connected: connectionStatus === "connected",
        connectionStatus,
        models,
    };
};