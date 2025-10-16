import { StyleSheet, View } from "react-native";
import NavBar from "../components/NavBar";
import ChallengesSection from "../components/ChallengesSection";
import CommunitySection from "../components/CommunitySection.jsx";
import UserIndicatorsSection from "../components/UserIndicatorsSection.jsx";
import HeaderBar from "../components/HeaderBar.jsx";

export default function HomeScreen() {
	return (
		<>
			<View style={styles.container}>
				<UserIndicatorsSection />

				{/* <ChallengesSection /> */}

				<CommunitySection />
			</View>

			<HeaderBar />
			<NavBar />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
	},
});
