import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import HeaderBar from "../../components/HeaderBar.jsx";
import { useUser } from "../../context/UserContext.js";
import { useEffect } from "react";
import { getInfoProject } from "../../services/apiEndpoints.js";
import ProjectCard from "../Home/components/ProjectCard.jsx";
import { globalStyles } from "../../stylesConstants.js";

export default function ProjectScreen() {
	const { user, project, setProject, orgEvent } = useUser();
	/* 
	useEffect(() => {
		if (project) fetchInfoProject(project._id);
	}, []);

	async function fetchInfoProject(pid) {
		try {
			const responseData = await getInfoProject(pid);
			console.log("Info project in project Screen:", responseData);

			if (responseData) setProject(responseData);
		} catch (error) {
			console.log(error);
		}
	} */

	return (
		<View style={styles.container}>
			{user ?
				<HeaderBar title={"Proyecto"} subTitle={""} />
			:	<ActivityIndicator size="small" />}
			{project ?
				<ScrollView style={styles.scrollContainer}>
					<ProjectCard />

					<View style={styles.impactCard}>
						<Text style={styles.title}>Impacto</Text>
						<View style={styles.infoSection}>
							<Image
								style={styles.footPrint}
								source={require("./assets/eco_footprint.png")}
							/>
							<View style={styles.textSection}>
								<View>
									<Text style={styles.textInfo}>Proyecto:</Text>
									<Text style={styles.textInfo}>{project.name}</Text>
								</View>
								<View>
									<Text style={styles.textInfo}>Lugar:</Text>
									<Text style={styles.textInfo}>{project.location}</Text>
								</View>
							</View>
						</View>
						<Text style={styles.descr}>{project.descr}</Text>
					</View>
				</ScrollView>
			:	<ActivityIndicator size="large" />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		flexGrow: 1,
	},
	title: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
		paddingVertical: 15,
		paddingLeft: 15,
	},
	impactCard: {
		marginTop: 30,
		borderRadius: 20,
		borderColor: "#D0DBE2",
		borderWidth: 1,
		width: "88%",
		alignSelf: "center",
	},
	infoSection: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 35,
	},
	footPrint: {
		width: 90,
		height: 130,
	},
	textSection: {
		gap: 20,
	},
	textInfo: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.medium,
	},
	descr: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
		color: globalStyles.colors.tertiary,
		paddingHorizontal: 30,
		marginVertical: 30,
		textAlign: "center",
	},
});
