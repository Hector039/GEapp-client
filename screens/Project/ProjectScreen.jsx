import { ScrollView, StyleSheet, Text, View } from "react-native";
import NavBar from "../../components/NavBar.jsx";
import HeaderBar from "../../components/HeaderBar.jsx";
import { useUser } from "../../context/UserContext.js";
import { useEffect, useState } from "react";
import { getInfoProject } from "../../services/apiEndpoints.js";

export default function ProjectScreen() {
	const [error, setError] = useState("");
	const [project, setProject] = useState(null);
	const { user } = useUser();

	useEffect(() => {
		if (user) fetchInfoProject(user.orgEvent.projectId._id);
	}, []);

	async function fetchInfoProject(pid) {
		try {
			const responseData = await getInfoProject(pid);
			console.log("Info project in poject Screen:", responseData);

			if (responseData) setProject(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar información del proyecto activo");
		}
	}

	return (
		<View style={styles.container}>
			<HeaderBar />
			{project ?
				<ScrollView contentContainerStyle={styles.projectContainer}>
					{error && <Text>{error}</Text>}
					<Text>{project.name}</Text>
					<Text>Ubicación: {project.location}</Text>
					<Text>{project.descr}</Text>
				</ScrollView>
			:	<Text>No se encontró un projecto activo, intenta más tarde</Text>}

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
	projectContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 20,
		paddingHorizontal: 30,
	},
});
