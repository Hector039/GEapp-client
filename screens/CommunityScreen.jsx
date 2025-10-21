import { StyleSheet, Text, View } from "react-native";
import { useUser } from "../context/UserContext.js";
import TotalStepsCommunitySection from "../components/TotalStepsCommunitySection.jsx";
import TopUsersSection from "../components/TopUsersSection.jsx";
import OrgUsersSection from "../components/OrgUsersSection.jsx";
import HeaderBar from "../components/HeaderBar.jsx";
import NavBar from "../components/NavBar.jsx";

export default function CommunityScreen() {
	const { user } = useUser();

	return (
		<>
			<View style={styles.container}>
				<Text>Comunidad</Text>
				<TotalStepsCommunitySection />
				<TopUsersSection />
				{user && user.org && <OrgUsersSection uid={user.id} />}
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
		paddingTop: 100,
	},
});
