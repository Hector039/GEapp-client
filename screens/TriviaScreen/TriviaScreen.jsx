import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
	saveChallenge,
	updateOrgEventSteps,
	updateUserTotalSteps,
} from "../../services/apiEndpoints";
import { useUser } from "../../context/UserContext";

const TriviaScreen = ({ route }) => {
	const { challenge, userId } = route.params;
	const { user, setSteps } = useUser();
	const navigation = useNavigation();
	const [selectedIndex, setSelectedIndex] = useState(null);

	const handleSubmit = async () => {
		if (selectedIndex === null) {
			Alert.alert(
				"Selecciona una opción",
				"Debes elegir una respuesta antes de continuar."
			);
			return;
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

		//setAnswered(true);

		Alert.alert(
			isCorrectAnswer ? "✅ ¡Correcto!" : "❌ Incorrecto",
			isCorrectAnswer ?
				`Ganaste ${challenge.reward} pasos`
			:	`Incorrecto, vuelve a intentarlo!`,
			[
				{
					text: "OK",
					onPress: () => navigation.navigate("Home"),
				},
			]
		);
	};

	return (
		<View style={styles.container}>
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
	);
};

export default TriviaScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
		justifyContent: "center",
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 8,
	},
	descr: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 16,
		color: "#555",
	},
	questionContainer: {
		marginBottom: 20,
	},
	question: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
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
		borderColor: "#007bff",
	},
	correctOption: {
		backgroundColor: "#b8f2b8",
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
		backgroundColor: "#007bff",
		paddingVertical: 14,
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "bold",
	},
});
