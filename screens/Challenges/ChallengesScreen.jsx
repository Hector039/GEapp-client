import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import HeaderBar from "../../components/HeaderBar.jsx";
import RandomChallengeSection from "../Home/components/RandomChallengeSection.jsx";
import FinishedChallengesSection from "./components/FinishedChallenges.jsx";
import { useUser } from "../../context/UserContext.js";

export default function ChallengesScreen() {
	const { user } = useUser();
	return (
		<View style={styles.container}>
			{user ?
				<HeaderBar title={"Desafíos"} subTitle={""} />
			:	<ActivityIndicator size="small" />}
			{user ?
				<View style={styles.content}>
					<RandomChallengeSection uid={user.id} />
					<FinishedChallengesSection uid={user.id} />
				</View>
			:	<ActivityIndicator size="large" />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
});
