import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useUser } from "../../context/UserContext.js";
import HeaderBar from "../../components/HeaderBar.jsx";
import NavBar from "../../components/NavBar.jsx";
import ImpactSection from "./components/ImpactSection.jsx";
import OrgIndicatorsSection from "../Home/components/OrgIndicatorsSection.jsx";
import Start from "../Home/components/Start.jsx";

export default function ActivityScreen() {
	const { user } = useUser();

	return (
		<View style={styles.container}>
			<HeaderBar />
			{user ?
				<ScrollView style={styles.content}>
					<Text style={styles.projectTitle}>
						Proyecto: {user.orgEvent.projectId.name}
					</Text>
					<View style={styles.startButtonContainer}>
						<Start />
					</View>
					<OrgIndicatorsSection eid={user.orgEvent._id} />
					<ImpactSection />
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
	startButtonContainer: {
		alignItems: "center",
		marginVertical: 30,
	},
	projectTitle: {
		textAlign: "center",
	},
});
