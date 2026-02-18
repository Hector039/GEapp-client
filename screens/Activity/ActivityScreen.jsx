import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { useUser } from "../../context/UserContext.js";
import HeaderBar from "../../components/HeaderBar.jsx";
import RandomChallengeSection from "../Home/components/RandomChallengeSection.jsx";
import CircularProgress from "../Home/components/CircularProgress.jsx";
import ChartGraph from "./components/chartGraph.jsx";

export default function ActivityScreen() {
	const { user, sessionSteps, steps } = useUser();

	return (
		<View style={styles.container}>
			{user ?
				<HeaderBar title={"Tu actividad"} subTitle={""} />
			:	<ActivityIndicator size="small" />}
			{user ?
				<ScrollView style={styles.scrollContent}>
					<View style={styles.indicatorsContent}>
						<CircularProgress
							percentage={
								(sessionSteps * 100) / (user.RECOMMENDED_DAILY_STEPS || 5000)
							}
						/>
						<Image
							style={styles.footPrint}
							source={require("./assets/footprint.png")}
						/>
					</View>

					<ChartGraph uid={user.id} totalSteps={steps} />
					<RandomChallengeSection uid={user.id} />
				</ScrollView>
			:	<ActivityIndicator size="large" />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	indicatorsContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 20,
	},
	footPrint: {
		width: 130,
		height: 150,
	},
});
