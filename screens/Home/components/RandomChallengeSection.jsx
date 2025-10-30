import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRandomChallenge } from "../../../services/apiEndpoints";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function RandomChallengeSection({ uid }) {
	const navigation = useNavigation();
	const [error, setError] = useState("");
	const [lastChallenge, setLastChallenge] = useState(null);

	async function fetchRandomChallenge() {
		try {
			const responseData = await getRandomChallenge(uid);
			if (responseData) setLastChallenge(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar el desafío activo");
		}
	}

	useEffect(() => {
		fetchRandomChallenge();
	}, []);

	function handleGoToChallenge() {
		navigation.navigate("Trivia", {
			userId: uid,
			challenge: lastChallenge,
		});
	}

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			{lastChallenge ?
				<View style={styles.challengeContainer}>
					<Image
						style={styles.image}
						source={
							lastChallenge.icon ?
								{ uri: lastChallenge.icon }
							:	require("../../../assets/default-avatar.png")
						}
						resizeMode="contain"
					/>
					<View>
						<Text>{lastChallenge.title}</Text>
						<Text>Recompensa: {lastChallenge.reward} pasos</Text>
					</View>
					<TouchableOpacity onPress={handleGoToChallenge}>
						<Text>Iniciar</Text>
					</TouchableOpacity>
				</View>
			:	<Text>Todavía no hay desafíos, intenta más tarde</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	challengeContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "90%",
		padding: 10,
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
});
