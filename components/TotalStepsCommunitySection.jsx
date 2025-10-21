import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getTotalCommunitySteps } from "../services/apiEndpoints.js";

export default function TotalStepsCommunitySection() {
	const [communitySteps, setCommunitySteps] = useState(0);
	const [error, setError] = useState("");

	async function fetchTotalCommunitySteps() {
		try {
			const responseData = await getTotalCommunitySteps();
			if (responseData) setCommunitySteps(responseData.communitySteps);
		} catch (error) {
			console.log(error);
			setError("Error al cargar los pasos de la comunidad");
		}
	}

	useEffect(() => {
		fetchTotalCommunitySteps();
	}, []);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<Text>Pasos de la comunidad: {communitySteps}</Text>
		</View>
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
