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
	const { user, steps } = useUser();

	return (
		<View style={styles.container}>
			{user ?
				<HeaderBar title={"Tu actividad"} subTitle={""} />
			:	<ActivityIndicator size="small" />}
			{user ?
				<ScrollView style={styles.content}>
					<View style={styles.indicatorsContent}>
						<CircularProgress
							percentage={(steps * 100) / user.RECOMMENDED_DAILY_STEPS}
						/>
						<Image
							style={styles.footPrint}
							source={require("./assets/footprint.png")}
						/>
					</View>

					<ChartGraph uid={user.id} totalSteps={user.totalSteps} />
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
	content: {
		marginBottom: 100,
	},
	indicatorsContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 20,
		paddingVertical: 20,
	},
	footPrint: {
		width: 130,
		height: 150,
	},
});
