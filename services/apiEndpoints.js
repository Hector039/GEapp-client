import axios from "./axiosInstance";

const ENDPOINTS = {
	userLogin: "users/login",
	userSignUp: "users/signin",
	restorePassword: "users/passrestoration",
	changePass: "users/changepassword",
	changeUserEmail: "users/changeemail",
	changeUserAvatar: "users/changeavatar",
	getUserTotalSteps: "users/getusertotalsteps",
	updateUserTotalSteps: "users/updateusertotalsteps",
	deactivateAccount: "users/updateuserstatus",
	reactivateUserAccount: "users/reactivateuserstatus",
	getUserInfoRewards: "sessions/getuserinforewards",
	saveUserSession: "sessions/saveusersession",
	getRandomChallenge: "challenges/getrandomchallenge",
	getFinishedChallenges: "userchallenges/getdonechallenges",
	saveChallenge: "userchallenges/saveuserchallenge",
	getOrgEventTotalSteps: "orgevents/getorgeventtotalsteps",
	getDataChart: "sessions/getdatachart",
	getAllChallenges: "challenges/getallchallenges",
	getInfoProject: "refprojects/getrefproject",
	getTicText: "tic/gettic",
	updateOrgEventSteps: "orgevents/updateorgeventsteps",
};

export const getUserInfoRewards = async (uid, date) => {
	try {
		const response = await axios.get(
			ENDPOINTS.getUserInfoRewards + `/${uid}` + `/${date}`
		);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getUserInfoRewards:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getInfoProject = async (pid) => {
	try {
		const response = await axios.get(ENDPOINTS.getInfoProject + `/${pid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getInfoProject:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getTicText = async () => {
	try {
		const response = await axios.get(ENDPOINTS.getTicText);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getTicText:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const saveChallenge = async (uid, cid) => {
	const payload = { uid, cid };
	try {
		const response = await axios.post(ENDPOINTS.saveChallenge, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en saveChallenge:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getAllChallenges = async (uid) => {
	try {
		const response = await axios.get(ENDPOINTS.getAllChallenges + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getAllChallenges:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getFinishedChallenges = async (uid) => {
	try {
		const response = await axios.get(ENDPOINTS.getFinishedChallenges + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getFinishedChallenges:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getDataChart = async (uid, filter) => {
	try {
		const response = await axios.get(
			ENDPOINTS.getDataChart + `/${uid}` + `/${filter}`
		);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getDataChart:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const getOrgEventTotalSteps = async (eid) => {
	try {
		const response = await axios.get(ENDPOINTS.getOrgEventTotalSteps + `/${eid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getOrgEventTotalSteps:", errorMessage, error);
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

export const getRandomChallenge = async (uid) => {
	try {
		const response = await axios.get(ENDPOINTS.getRandomChallenge + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en getRandomChallenge:", errorMessage, error);
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
				error.response.data.error.message
			:	"Error de red o timeout";
		throw new Error(errorMessage);
	}
};

export const userSignUp = async (email, password) => {
	const payload = { email, password };
	try {
		const response = await axios.post(ENDPOINTS.userSignUp, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.error.message
			:	"Error de red o timeout";
		throw new Error(errorMessage);
	}
};

export const restorePassword = async (email, password) => {
	try {
		const response = await axios.get(
			ENDPOINTS.restorePassword + `/${email}` + `/${password}`
		);
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

export const updateOrgEventSteps = async (eid, steps) => {
	const payload = { eid, steps };
	try {
		const response = await axios.put(ENDPOINTS.updateOrgEventSteps, payload);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en updateOrgEventSteps:", errorMessage, error);
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

export const deactivateAccount = async (uid) => {
	try {
		const response = await axios.put(ENDPOINTS.deactivateAccount + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en deactivateAccount:", errorMessage, error);
		throw new Error(errorMessage);
	}
};

export const reactivateUserAccount = async (uid) => {
	try {
		const response = await axios.put(ENDPOINTS.reactivateUserAccount + `/${uid}`);
		return response.data;
	} catch (error) {
		const errorMessage =
			error.response ?
				error.response.data.message ||
				`Error ${error.response.status}: Error en el servidor`
			:	"Error de red o timeout";
		console.error("Error en reactivateUserAccount:", errorMessage, error);
		throw new Error(errorMessage);
	}
};
