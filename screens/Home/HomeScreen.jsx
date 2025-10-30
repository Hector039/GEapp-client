import { ScrollView, StyleSheet, Text, View } from "react-native";
import NavBar from "../../components/NavBar.jsx";
import RandomChallengeSection from "./components/RandomChallengeSection.jsx";
import UserIndicatorsSection from "./components/UserIndicatorsSection.jsx";
import HeaderBar from "../../components/HeaderBar.jsx";
import Start from "./components/Start.jsx";
import OrgIndicatorsSection from "./components/OrgIndicatorsSection.jsx";
import { useUser } from "../../context/UserContext.js";
import SeeMoreBar from "../../components/seeMoreBar.jsx";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	getUserInfoRewards,
	updateOrgEventSteps,
	updateUserTotalSteps,
} from "../../services/apiEndpoints.js";

export default function HomeScreen() {
	const { user, setSteps, steps } = useUser();

	async function checkUserRewards(uid) {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		const today = `${year}-${month}-${day}`;

		// --- VERIFICAR SI YA SE PROCESÓ HOY ---
		const lastCheckDate = await AsyncStorage.getItem("tracker");
		console.log("Última verificación de recompensa:", lastCheckDate);

		if (lastCheckDate === today) {
			console.log("Recompensas de hoy ya procesadas.");
			return; // Detiene la función si ya se procesó hoy
		}
		try {
			//en el backend Busca la session de ayer IMPORTANTE
			const responseData = await getUserInfoRewards(uid, today);
			console.log("userInfo rewards in HomeScreen:", responseData);
			//Si existe la sesión de ayer, reviso la cantidad de pasos para premiar
			// y aumento o elimino la racha según el caso
			if (responseData) {
				if (responseData.steps > user.RECOMMENDED_DAILY_STEPS) {
					console.log(
						"Felicitaciones! Superaste los pasos recomendados en una sola sesion. ganaste 200 pasos!"
					);
					// modal y actualizar pasos usuario y orgEvent
					try {
						const updateResponse = await updateUserTotalSteps(
							uid,
							user.SESSION_REWARD
						);
						console.log("User total steps updated:", updateResponse);
						setSteps(updateResponse.newTotalSteps);
					} catch (error) {
						console.log("Error updating user total steps:", error);
					}

					try {
						await updateOrgEventSteps(user.orgEvent._id, user.SESSION_REWARD);
					} catch (error) {
						console.log("Error updating Org Event total steps:", error);
					}
				}
				//Busco el conteo de racha, si existe, actualizo sumando 1
				// Si no existe, lo inicio en 1
				const streakCount = await AsyncStorage.getItem("streak");
				console.log("Streak in LS:", streakCount);

				if (streakCount && responseData.steps > 500) {
					const parsedStreakCount = JSON.parse(streakCount);
					await AsyncStorage.setItem(
						"streak",
						JSON.stringify(parsedStreakCount + 1)
					);
					//si la racha es igual a 5, premio con pasos y luego reinicio el conteo
					if (parsedStreakCount + 1 === 5) {
						console.log(
							"Felicitaciones! Tuviste una racha de 5 días de caminatas. ganaste 500 pasos!"
						);
						// modal y actualizar pasos usuario y orgEvent
						try {
							const updateResponse = await updateUserTotalSteps(
								uid,
								user.STREAK_REWARD
							);
							console.log("User total steps updated:", updateResponse);
							setSteps(updateResponse.newTotalSteps);
						} catch (error) {
							console.log("Error updating user total steps:", error);
						}

						try {
							await updateOrgEventSteps(user.orgEvent._id, user.STREAK_REWARD);
						} catch (error) {
							console.log("Error updating Org Event total steps:", error);
						}
						await AsyncStorage.removeItem("streak");
					}
				} else {
					await AsyncStorage.setItem("streak", JSON.stringify(1));
				}
			} else {
				await AsyncStorage.removeItem("streak");
			}
			await AsyncStorage.setItem("tracker", today);
			console.log("Recompensas procesadas y marcadas para hoy:", today);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (user) checkUserRewards(user.id);
	}, []);

	return (
		<View style={styles.container}>
			<HeaderBar />
			{user ?
				<ScrollView style={styles.content}>
					<View style={styles.projectTitleContainer}>
						<SeeMoreBar
							title={"Proyecto activo:" + " " + user.orgEvent.projectId.name}
							destiny={"Project"}
						/>
					</View>

					<View style={styles.startButtonContainer}>
						<Start />
					</View>
					<OrgIndicatorsSection eid={user.orgEvent._id} />
					<UserIndicatorsSection
						uid={user.id}
						recommendedSteps={user.RECOMMENDED_DAILY_STEPS}
						eid={user.orgEvent._id}
						setSteps={setSteps}
						steps={steps}
					/>
					<RandomChallengeSection uid={user.id} />
				</ScrollView>
			:	<Text style={styles.content}>Cargando...</Text>}
			<NavBar />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "grid",
		gridTemplateRows: "auto 1fr auto",
		flex: 1,
	},
	projectTitle: {
		textAlign: "center",
	},
	startButtonContainer: {
		alignItems: "center",
		marginVertical: 30,
	},
	projectTitleContainer: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#d0d0d0ff",
	},
});
