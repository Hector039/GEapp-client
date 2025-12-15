import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRandomChallenge } from "../../../services/apiEndpoints";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../../../stylesConstants";
import PlayIcon from "../assets/play.svg";

export default function RandomChallengeSection({ uid }) {
	const navigation = useNavigation();
	const [lastChallenge, setLastChallenge] = useState(null);

	async function fetchRandomChallenge() {
		try {
			const responseData = await getRandomChallenge(uid);
			if (responseData) setLastChallenge(responseData);
		} catch (error) {
			console.log(error);
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
			{lastChallenge ?
				<View style={styles.challengeCard}>
					<Text style={styles.title}>{lastChallenge.title}</Text>
					<View style={styles.challengeContainer}>
						<Image
							style={styles.image}
							source={require("../assets/mountainBig.png")}
							resizeMode="contain"
						/>
						<View style={styles.challengeInfoContainer}>
							<Text style={styles.typeText}>Tipo de desafío: Trivia</Text>
							<Text style={styles.themeText}>Tema: {lastChallenge.title}</Text>
							<TouchableOpacity
								onPress={handleGoToChallenge}
								style={styles.startButton}
							>
								<PlayIcon width={50} height={50} />
								<Text style={styles.startText}>Iniciar desafío</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			:	<Text>Aún no hay desafíos, intenta más tarde.</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		alignSelf: "center",
		borderRadius: 30,
		borderColor: globalStyles.colors.primary,
		borderWidth: 1,
		width: "90%",
	},
	challengeCard: {
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
	challengeContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "90%",
		gap: 10,
	},
	challengeInfoContainer: {},
	image: {
		width: 130,
		height: 130,
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: 18,
		marginBottom: 10,
	},
	statusbar: {
		justifyContent: "center",
	},
	startButton: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 15,
	},
	startImage: {
		width: 50,
		height: 50,
	},
	startText: {
		fontFamily: "RubikBold",
		fontSize: 20,
		color: globalStyles.colors.primary,
	},
	typeText: {
		fontFamily: "RubikBold",
		color: "#0000009e",
	},
	themeText: {
		fontFamily: "RubikMedium",
		color: "#00000071",
	},
});
