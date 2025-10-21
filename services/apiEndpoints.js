import axios from "./axiosInstance";

const ENDPOINTS = {
	userLogin: "users/login",
	userSignUp: "users/signin",
	getOrgData: "orgs/getorgs",
	restorePassword: "users/restorepass",
	changePass: "users/changepassword",
	changeUserEmail: "users/changeemail",
	changeUserAvatar: "users/changeavatar",
	getUserTotalSteps: "users/getusertotalsteps",
	updateUserTotalSteps: "users/updateusertotalsteps",
	saveUserSession: "sessions/saveusersession",
	getUserCommunity: "users/getnewuserscommunity",
	getUserChallenges: "users/challenges",
	getTopUsers: "users/gettopusers",
	getCommunitySteps: "users/getcommunitysteps",
	getOrgUsers: "users/getorgusers",
};

export const getOrgUsers = async (uid) => {
	try {
		const response = await axios.get(ENDPOINTS.getOrgUsers + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getOrgUsers:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getTotalCommunitySteps = async () => {
	try {
		const response = await axios.get(ENDPOINTS.getCommunitySteps);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getTotalCommunitySteps:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getTopUsers = async () => {
	try {
		const response = await axios.get(ENDPOINTS.getTopUsers);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getTopUsers:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const changeUserAvatar = async (uid, formData) => {
	const payload = { formData };
	try {
		const response = await axios.put(
			ENDPOINTS.changeUserAvatar + `/${uid}`,
			payload,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en changeUserAvatar:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const changeUserEmail = async (uid, newEmail) => {
	const payload = { uid, newEmail };
	try {
		const response = await axios.put(ENDPOINTS.changeUserEmail, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en changeEmail:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const changePass = async (uid, oldPassword, newPassword) => {
	const payload = { uid, oldPassword, newPassword };
	try {
		const response = await axios.put(ENDPOINTS.changePass, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en changePass:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getUserChallenges = async (uid) => {
	try {
		const response = await axios.get(ENDPOINTS.getUserChallenges + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getUserChallenges:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getUserCommunity = async () => {
	try {
		const response = await axios.get(ENDPOINTS.getUserCommunity);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getUserCommunity:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const userLogin = async (email, password) => {
	const payload = { email, password };
	try {
		const response = await axios.post(ENDPOINTS.userLogin, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en userLogin:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getOrgData = async () => {
	try {
		const response = await axios.get(ENDPOINTS.getOrgData);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getOrgData:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const userSignUp = async (email, password, org) => {
	const payload = { email, password, org };
	try {
		const response = await axios.post(ENDPOINTS.userSignUp, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en userSignUp:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const restorePassword = async (email, password) => {
	const payload = { email, password };
	try {
		const response = await axios.post(ENDPOINTS.restorePassword, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en restorePassword:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const saveUserSession = async (uid, steps, date) => {
	const payload = { uid, steps, date };
	try {
		const response = await axios.post(ENDPOINTS.saveUserSession, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en saveUserSession:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const updateUserTotalSteps = async (uid, steps) => {
	const payload = { uid, steps };
	try {
		const response = await axios.put(ENDPOINTS.updateUserTotalSteps, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en updateUserTotalSteps:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getUserTotalSteps = async (uid) => {
	try {
		const response = await axios.get(ENDPOINTS.getUserTotalSteps + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getUserTotalSteps:", errorMessage, error);
		throw new Error(errorMessage);
	}
};
