import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
	saveChallenge,
	updateOrgEventSteps,
	updateUserTotalSteps,
} from "../../services/apiEndpoints";
import { useUser } from "../../context/UserContext";
import CustomLightModal from "../../tools/CustomLightModal";
import CustomModal from "../../tools/CustomModal";
import { globalStyles } from "../../stylesConstants";
import HeaderBackground from "../SignLogin/assets/headerBackground.svg";

const TriviaScreen = ({ route }) => {
	const { challenge, userId } = route.params;
	const { user, setSteps } = useUser();
	const navigation = useNavigation();
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [answerResult, setAnswerResult] = useState(false);

	const [msg, setMsg] = useState("");
	const [msgModalVisible, setMsgModalVisible] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleMsg = (error) => {
		setMsg(error);
		setMsgModalVisible(!msgModalVisible);
	};

	const handleSubmit = async () => {
		if (selectedIndex === null) {
			return handleMsg("Debes elegir una respuesta antes de continuar.");
		}

		const isCorrectAnswer = selectedIndex === challenge.correctOptionIndex;
		if (isCorrectAnswer) {
			try {
				await saveChallenge(userId, challenge._id);
				console.log("Challenge saved");
			} catch (error) {
				console.log("Error saving user challenge:", error);
			}
			try {
				const updateResponse = await updateUserTotalSteps(userId, challenge.reward);
				console.log("User total steps updated in trivia:", updateResponse);
				setSteps(updateResponse.newTotalSteps);
			} catch (error) {
				console.log("Error updating user total steps:", error);
			}

			try {
				await updateOrgEventSteps(user.orgEvent._id, challenge.reward);
			} catch (error) {
				console.log("Error updating Org Event total steps from trivia:", error);
			}
		}

		setAnswerResult(isCorrectAnswer);
		setIsModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<HeaderBackground style={styles.headerBgTop} width={"100%"} height={180} />

			<View style={styles.content}>
				<Text style={styles.title}>{challenge.title}</Text>
				<Text style={styles.descr}>{challenge.descr}</Text>

				<View style={styles.questionContainer}>
					<Text style={styles.question}>{challenge.question}</Text>
					{challenge.options.map((option, index) => (
						<TouchableOpacity
							key={index}
							style={[styles.option, selectedIndex === index && styles.selectedOption]}
							onPress={() => setSelectedIndex(index)}
						>
							<Text style={styles.optionText}>{option}</Text>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Responder</Text>
				</TouchableOpacity>
			</View>

			<CustomLightModal
				visible={msgModalVisible}
				onClose={() => setMsgModalVisible(!msgModalVisible)}
				errorMessage={msg}
			/>

			<CustomModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				title={answerResult ? "¡Correcto!" : "Incorrecto"}
				message={
					answerResult ?
						`Ganaste ${challenge.reward} pasos`
					:	`Incorrecto, vuelve a intentarlo!`
				}
				backgroundColor="#e6ffe6"
				iconName={
					answerResult ? "checkmark-circle-outline" : "remove-circle-outline"
				}
				iconColor={answerResult ? "#80B349" : "#735F38"}
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setIsModalVisible(false);
							navigation.navigate("MainTabs", { screen: "Home" });
						},
						style: { backgroundColor: answerResult ? "#80B349" : "#735F38" },
					},
				]}
			/>
			<HeaderBackground
				style={styles.headerBgBottom}
				width={"100%"}
				height={180}
			/>
		</View>
	);
};

export default TriviaScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		width: "90%",
	},
	title: {
		fontSize: 28,
		color: globalStyles.colors.tertiary,
		fontFamily: "RubikBold",
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	descr: {
		fontSize: globalStyles.fSizes.medium,
		fontFamily: "KarlaSemiBold",
		textAlign: "center",
		color: "#555",
		marginBottom: 30,
	},
	questionContainer: {
		marginBottom: 20,
	},
	question: {
		fontSize: 20,
		fontFamily: "RubikBold",
		fontWeight: "600",
		marginBottom: 12,
		textAlign: "center",
	},
	option: {
		borderWidth: 1,
		borderColor: "#aaa",
		borderRadius: 8,
		padding: 12,
		marginVertical: 5,
	},
	selectedOption: {
		backgroundColor: "#d0ebff",
		borderColor: globalStyles.colors.tertiary,
	},
	correctOption: {
		backgroundColor: globalStyles.colors.primary,
		borderColor: "green",
	},
	wrongOption: {
		backgroundColor: "#f8b8b8",
		borderColor: "red",
	},
	optionText: {
		fontSize: 16,
	},
	button: {
		backgroundColor: globalStyles.colors.secondary,
		paddingVertical: 14,
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontSize: globalStyles.fSizes.medium,
		fontFamily: "RubikMedium",
	},
	headerBgTop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1,
	},
	headerBgBottom: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		transform: [{ rotate: "180deg" }],
	},
});
