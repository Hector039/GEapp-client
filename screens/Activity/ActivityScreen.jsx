import { ScrollView, StyleSheet, View } from "react-native";
import { useUser } from "../../context/UserContext.js";
import HeaderBar from "../../components/HeaderBar.jsx";
import NavBar from "../../components/NavBar.jsx";
import StepsChartSection from "../../screens/Activity/components/chartSection.jsx";
import SimpleFinishedChallengesSection from "../Activity/components/SimpleFinishedChallengesSection.jsx";
import SeeMoreBar from "../../components/seeMoreBar.jsx";
import SimpleUserIndicatorsSection from "../Activity/components/SimpleUserIndicatorsSection.jsx";
import RandomChallengeSection from "../Home/components/RandomChallengeSection.jsx";

export default function ActivityScreen() {
	const { user, steps } = useUser();

	return (
		<View style={styles.container}>
			<HeaderBar />
			{user ?
				<ScrollView style={styles.content}>
					<SimpleUserIndicatorsSection
						recommendedSteps={user.RECOMMENDED_DAILY_STEPS}
						steps={steps}
					/>
					<StepsChartSection uid={user.id} />
					<View style={styles.finnishedChallengesContainer}>
						<SeeMoreBar title={"Desafíos terminados"} destiny={"Challenges"} />
						<SimpleFinishedChallengesSection uid={user.id} />
					</View>
					<RandomChallengeSection uid={user.id} />
				</ScrollView>
			:	<Text style={styles.content}>Cargando...</Text>}
			<NavBar />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "grid",
		gridTemplateRows: "auto 1fr auto",
		flex: 1,
	},
	content: {
		flexGrow: 1,
	},
	finnishedChallengesContainer: {
		alignItems: "center",
	},
});
