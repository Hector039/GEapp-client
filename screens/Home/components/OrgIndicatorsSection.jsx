import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getOrgEventTotalSteps } from "../../../services/apiEndpoints.js";
import { globalStyles } from "../../../stylesConstants.js";
import ProgressBar from "./ProgressBar.jsx";
import { useUser } from "../../../context/UserContext.js";

export default function OrgIndicatorsSection({ eid }) {
	const {
		subscriptionState,
		setOrgEventSteps,
		setProjectGoalSteps,
		projectGoalSteps,
		orgEventSteps,
	} = useUser();

	async function fetchTotalOrgEventSteps() {
		try {
			const responseData = await getOrgEventTotalSteps(eid);
			if (responseData) {
				setOrgEventSteps(responseData.orgEventSteps);
				setProjectGoalSteps(responseData.projectGoalSteps);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchTotalOrgEventSteps();
	}, []);

	return (
		<View style={styles.container}>
			{(orgEventSteps * 100) / projectGoalSteps < 100 ?
				<Image style={styles.xIcon} source={require("../assets/icon_x.png")} />
			:	<Image style={styles.xIcon} source={require("../assets/icon_v.png")} />}

			<View>
				<View style={styles.progressTextContainer}>
					{orgEventSteps && projectGoalSteps ?
						<Text style={styles.progressText}>
							{(orgEventSteps * 100) / projectGoalSteps}%
						</Text>
					:	<ActivityIndicator size="small" />}
					<Text
						style={[
							styles.infoText,
							{
								color:
									subscriptionState ?
										globalStyles.colors.primary
									:	globalStyles.colors.tertiary,
							},
						]}
					>
						{subscriptionState ? "Estás sumando pasos" : "No estás sumando pasos"}
					</Text>
				</View>
				<ProgressBar percentage={(orgEventSteps * 100) / projectGoalSteps} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		width: "89%",
		alignSelf: "center",
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
		borderTopRightRadius: 15,
		borderTopLeftRadius: 15,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
		paddingBlock: 15,
		marginTop: -30, // Si quieres que se superponga un poco con el fondo verde
		padding: 15,
		zIndex: 2, // Aseguramos que esté por encima de todo
	},
	progressTextContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	progressText: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.large,
	},
	infoText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
	},
	xIcon: {
		width: 40,
		height: 40,
		borderRadius: 15,
	},
});
