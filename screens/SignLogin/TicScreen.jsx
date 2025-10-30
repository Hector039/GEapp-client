import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTicText } from "../../services/apiEndpoints";
import Markdown from "react-native-markdown-display";

export default function TicScreen() {
	const navigation = useNavigation();
	const [ticText, setTicText] = useState(null);
	const [error, setError] = useState("");

	const fetchTicText = async () => {
		try {
			const responseData = await getTicText();
			if (responseData) setTicText(responseData);
		} catch (error) {
			console.error(error);
			setError("Error buscando TÉRMINOS Y CONDICIONES");
		}
	};

	const handleBackToSignIn = () => navigation.navigate("SignLogin");

	useEffect(() => {
		fetchTicText();
	}, []);

	return (
		<ScrollView style={styles.content}>
			{error ?
				<Text>{error}</Text>
			:	<Markdown>{ticText}</Markdown>}
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => handleBackToSignIn()}
			>
				<Text>Volver</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

export const styles = StyleSheet.create({
	content: {
		flexGrow: 1,
		padding: 30,
		marginBottom: 50,
	},
	backButton: {
		marginBottom: 35,
	},
});
