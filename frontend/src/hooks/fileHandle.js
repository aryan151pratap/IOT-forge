import { useNotify } from "../components/Device-IDE/notify";
import { sendToBackend } from "../services/deviceService";


export const handleCreateDevice = (currentDevice, entry_type, input, currentFolder) => {
    try {
        const data = {
            device_id: currentDevice,
            entry_type: entry_type,
            path: currentFolder + "/" + input,
            type: "filesystem",
            operation: "create",
        };

        sendToBackend(data);
    } catch (err) {
        console.log(err.message);
    }
};


export const handleDeleteDevice = (currentDevice, entry_type, path) => {
    try {
        const data = {
            device_id: currentDevice,
            entry_type: entry_type,
            path: path,
            type: "filesystem",
            operation: "delete",
        };

        sendToBackend(data);

    } catch (err) {
        console.log(err.message);
    }
};