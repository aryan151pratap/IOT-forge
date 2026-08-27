export const handleMouseDown = (
    e,
    containerRef,
    setAgentWidth
) => {
    e.preventDefault();

    const handleMouseMove = (event) => {
        const container = containerRef.current;

        if (!container) return;

        const rect = container.getBoundingClientRect();
        const newWidth = rect.right - event.clientX;

        setAgentWidth(
            Math.min(600, Math.max(200, newWidth))
        );
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};