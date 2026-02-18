import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { globalStyles } from "../../../stylesConstants.js";
import CircularProgress from "./CircularProgress.jsx";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../context/UserContext.js";

export default function UserIndicatorsSection() {
	const { user, sessionSteps } = useUser();

	const navigation = useNavigation();

	function handleGoToChallenge() {
		navigation.navigate("Challenges");
	}

	return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Tu actividad</Text>
			</View>

			<View style={styles.indicatorsCardContainer}>
				<CircularProgress
					percentage={(sessionSteps * 100) / (user.RECOMMENDED_DAILY_STEPS || 5000)}
				/>

				<ImageBackground
					style={styles.challengeContainer}
					source={require("../assets/mountain.png")}
					resizeMode="contain"
				>
					<TouchableOpacity
						onPress={handleGoToChallenge}
						style={styles.challengeButton}
					>
						<Text style={styles.challengeText}>Desafíos</Text>
						<Text style={styles.challengeSeeText}>Ver</Text>
					</TouchableOpacity>
				</ImageBackground>
			</View>
			<Text style={styles.subTitle}>
				¡Has alcanzado el{" "}
				{(sessionSteps * 100) / (user.RECOMMENDED_DAILY_STEPS || 5000)}% de tu
				objetivo de hoy, mantente enfocado en tu salud!
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 15,
		borderRadius: 20,
		borderColor: "#D0DBE2",
		borderWidth: 1,
		width: "88%",
		alignSelf: "center",
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: 20,
		color: globalStyles.colors.tertiary,
		paddingVertical: 15,
		paddingLeft: 15,
	},
	subTitle: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
		color: globalStyles.colors.tertiary,
		paddingHorizontal: 30,
		marginVertical: 10,
		textAlign: "center",
	},
	indicatorsCardContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
	},
	percentage: {
		fontFamily: "RubikBold",
		fontSize: 35,
		color: globalStyles.colors.primary,
	},
	percentageText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
	},
	challengeContainer: {
		borderRadius: 10,
		width: 160,
		height: 180,
		justifyContent: "center",
	},
	challengeSeeText: {
		fontFamily: "RubikBold",
		fontSize: 22,
		color: "#043000",
	},
	challengeText: {
		fontFamily: "RubikMedium",
		fontSize: 16,
		color: "#043000",
		paddingRight: 30,
	},
	challengeButton: {
		paddingLeft: 10,
		gap: 25,
	},
});
