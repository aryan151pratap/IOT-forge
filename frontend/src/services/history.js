export function getPreviousHistory(history, index) {
    if (history.length === 0) {
        return {
            index: -1,
            value: ""
        };
    }

    const newIndex =
        index === -1
            ? history.length - 1
            : Math.max(0, index - 1);

    return {
        index: newIndex,
        value: history[newIndex]
    };
}

export function getNextHistory(history, index) {
    if (history.length === 0 || index === -1) {
        return {
            index: -1,
            value: ""
        };
    }

    if (index === history.length - 1) {
        return {
            index: -1,
            value: ""
        };
    }

    const newIndex = index + 1;

    return {
        index: newIndex,
        value: history[newIndex]
    };
}