import { API } from "../services/authService";

export const connect_iot_Device_to_agent = async (device_id) => {
	try{
		const res = await API.get(`/agent/connectDevice/${device_id}`);
		return res.data;
	} catch (err) {
		return null;
	}
}

export const disconnect_iot_Device_from_agent = async () => {
	try{
		const res = await API.get(`/agent/disconnectDevice`);
		return res.data;
	} catch (err){
		console.log(err);
	}
}
export const agent_model_list = async () => {
	try{
		const res = await API.get(`/agent/models/`);
		return res.data;
	} catch (err) {
		return null;
	}
}

