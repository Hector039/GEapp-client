import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import Start from "./Start";
import OrgIndicatorsSection from "./OrgIndicatorsSection";
import backGroundimage from "../assets/Card_Proyecto.png";
import { globalStyles } from "../../../stylesConstants";
import { useUser } from "../../../context/UserContext";

export default function ProjectCard() {
	const { steps, orgEvent } = useUser();
	return (
		<ImageBackground source={backGroundimage} style={styles.cardContainer}>
			<View style={styles.componentContainer}>
				<View style={styles.buttonAndTextContainer}>
					<Start />
					<Text style={styles.userStepsText}>{steps} pasos totales</Text>
				</View>
				<Image
					style={styles.logo}
					source={require("../assets/generar_eco_logos-01.png")}
				/>
			</View>
			<OrgIndicatorsSection eid={orgEvent._id} />
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		paddingTop: 20,
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	componentContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingHorizontal: 50,
		paddingTop: 10,
		paddingBottom: 50,
		zIndex: 1,
	},
	buttonAndTextContainer: {
		flexDirection: "column",
		alignItems: "flex-start",
		gap: 20,
	},
	logo: {
		width: 140,
		height: 140,
		marginRight: 10,
	},
	userStepsText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: globalStyles.colors.tertiary,
	},
});
