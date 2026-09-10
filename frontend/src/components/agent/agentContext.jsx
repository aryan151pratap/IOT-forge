import { createContext, useContext, useState } from "react";

const AgentContext = createContext(null);

export const AgentProvider = ({ children }) => {
    const [codePreview, setCodePreview] = useState("");
    const [showCodePreview, setShowCodePreview] = useState(false);

    return (
        <AgentContext.Provider
            value={{
                codePreview,
                setCodePreview,
                showCodePreview,
                setShowCodePreview
            }}
        >
            {children}
        </AgentContext.Provider>
    );
};

export const useAgentContext = () => {
    const context = useContext(AgentContext);

    if (!context) {
        throw new Error("useAgentContext must be used inside AgentProvider");
    }

    return context;
};