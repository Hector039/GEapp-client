import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getFinishedChallenges } from "../../../services/apiEndpoints.js";
import { useEffect, useState } from "react";
import { globalStyles } from "../../../stylesConstants.js";

export default function FinishedChallengesSection({ uid }) {
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
			<Text style={styles.titleContainer}>Desafíos terminados:</Text>
			<ScrollView>
				{finishedChallenges && finishedChallenges.length > 0 ?
					finishedChallenges.map((challenge) => (
						<View style={styles.challengesContainer} key={challenge._id}>
							<Image
								style={styles.image}
								source={{ uri: challenge.triviaId.icon }}
								resizeMode="contain"
							/>
							<View style={styles.textContainer}>
								<Text style={styles.title}>{challenge.triviaId.title}</Text>
								<Text style={styles.reward}>
									Recompensa: {challenge.triviaId.reward} pasos
								</Text>
								<Text style={styles.reward}>Tipo: Trivia</Text>
							</View>
						</View>
					))
				:	<Text style={styles.notYetChallengesContainer}>
						Aún no completaste ningún desafío
					</Text>
				}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 40,
	},
	titleContainer: {
		fontFamily: "RubikBold",
		fontSize: 18,
		marginBottom: 15,
	},
	challengesContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 15,
		borderRadius: 30,
		borderColor: globalStyles.colors.tertiary,
		borderWidth: 1,
		width: "100%",
		marginBottom: 15,
	},
	image: {
		width: 70,
		height: 70,
		borderRadius: 50,
	},
	notYetChallengesContainer: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
		textAlign: "center",
		width: "90%",
		marginTop: 50,
	},
	textContainer: {
		paddingRight: 20,
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.medium,
	},
	reward: {
		fontFamily: "RubikMedium",
		color: "#00000071",
	},
});
