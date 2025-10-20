import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUserChallenges } from "../services/apiEndpoints.js";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext.js";

export default function ChallengesSection() {
	const { user } = useUser();
	const [error, setError] = useState("");
	const [challenges, setChallenges] = useState([]);

	async function fetchUserChallenges(uid) {
		try {
			const responseData = await getUserChallenges(uid);
			console.log("Challenges data:", responseData);
			if (responseData) setChallenges(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar los desafíos");
		}
	}

	useEffect(() => {
		fetchUserChallenges(user.id);
	}, []);

	function handleSeeMore() {
		navigation.navigate("Challenges");
	}

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<View style={styles.titleContainer}>
				<Text>Desafíos activos:</Text>
				<View style={styles.seeMoreContainer}>
					<TouchableOpacity onPress={handleSeeMore}>
						<Text>Ver más</Text>
					</TouchableOpacity>
					<Ionicons name="arrow-forward-outline" size="25" color="#333b30ff" />
				</View>
			</View>
			<View style={styles.challengesContainer}>
				{challenges && challenges.length > 0 ?
					challenges.map((challenge) => (
						<View key={challenge.id}>
							<Image
								style={styles.image}
								source={{ uri: challenge.icon }}
								resizeMode="contain"
							/>
							<Text>{challenge.title}</Text>
						</View>
					))
				:	<Text>No tienes desafíos activos</Text>}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	challengesContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	seeMoreContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	image: {
		width: 50,
	},
});
