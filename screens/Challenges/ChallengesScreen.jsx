import { ScrollView, StyleSheet, Text, View } from "react-native";
import HeaderBar from "../../components/HeaderBar.jsx";
import NavBar from "../../components/NavBar.jsx";
import RandomChallengeSection from "../Home/components/RandomChallengeSection.jsx";
import FinishedChallengesSection from "./components/FinishedChallenges.jsx";
import { useUser } from "../../context/UserContext.js";

export default function ChallengesScreen() {
	const { user } = useUser();
	return (
		<View style={styles.container}>
			<HeaderBar />
			{user ?
				<ScrollView style={styles.content}>
					<Text>Desafíos</Text>
					<RandomChallengeSection uid={user.id} />
					<FinishedChallengesSection uid={user.id} />
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
});
