import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getOrgEventTotalSteps } from "../../../services/apiEndpoints.js";

export default function OrgIndicatorsSection({ eid }) {
	const [orgEventSteps, setOrgEventSteps] = useState(0);
	const [projectGoalSteps, setProjectGoalSteps] = useState(0);
	const [error, setError] = useState("");

	async function fetchTotalOrgEventSteps() {
		try {
			const responseData = await getOrgEventTotalSteps(eid);
			if (responseData) {
				setOrgEventSteps(responseData.orgEventSteps);
				setProjectGoalSteps(responseData.projectGoalSteps);
			}
		} catch (error) {
			console.log(error);
			setError("Error al cargar los pasos de la organización");
		}
	}

	useEffect(() => {
		fetchTotalOrgEventSteps();
	}, []);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<Text style={styles.progressText}>
				Avanzamos {(orgEventSteps * 100) / projectGoalSteps}%
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	progressText: {
		marginVertical: 15,
	},
});
