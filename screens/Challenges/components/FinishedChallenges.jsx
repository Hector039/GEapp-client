import { Image, StyleSheet, Text, View } from "react-native";
import { getFinishedChallenges } from "../../../services/apiEndpoints.js";
import { useEffect, useState } from "react";

export default function FinishedChallengesSection({ uid }) {
	const [error, setError] = useState("");
	const [finishedChallenges, setFinishedChallenges] = useState([]);

	async function fetchUserFinishedChallenges(userId) {
		try {
			const responseData = await getFinishedChallenges(userId);
			console.log("finished Challenges:", responseData);
			if (responseData) setFinishedChallenges(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar los desafíos terminados");
		}
	}

	useEffect(() => {
		fetchUserFinishedChallenges(uid);
	}, []);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			{finishedChallenges && finishedChallenges.length > 0 ?
				finishedChallenges.map((challenge) => (
					<View style={styles.challengesContainer} key={challenge._id}>
						<Image
							style={styles.image}
							source={
								challenge.triviaId ?
									{ uri: challenge.triviaId.icon }
								:	require("../../../assets/default-avatar.png")
							}
							resizeMode="contain"
						/>
						<View>
							<Text>{challenge.triviaId.title}</Text>
							<Text>Recompensa: {challenge.triviaId.reward}</Text>
							<Text>Trivia</Text>
						</View>
					</View>
				))
			:	<Text>Aún no completaste ningún desafío</Text>}
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
	challengesContainer: {
		width: "85%",
		flexDirection: "row",
		justifyContent: "space-around",
		marginVertical: 15,
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
});
