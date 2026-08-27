import { API } from "./authService";

export const userData = async (id) => {
	try{
		const res = await API.get(`/users/${id}`);
		return res.data;
	} catch (err) {
		return null;
	}
}
