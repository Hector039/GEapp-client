import { useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTicText } from "../../services/apiEndpoints";
import Markdown from "react-native-markdown-display";
import Logo from "../../assets/geLogo01.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../stylesConstants";

export default function TicScreen() {
	const navigation = useNavigation();
	const [ticText, setTicText] = useState(null);
	const [error, setError] = useState("");

	const fetchTicText = async () => {
		try {
			const responseData = await getTicText();
			if (responseData) setTicText(responseData);
		} catch (error) {
			console.error(error);
			setError("Error buscando TÉRMINOS Y CONDICIONES");
		}
	};

	const handleBackToSignIn = () => navigation.navigate("SignLogin");

	useEffect(() => {
		fetchTicText();
	}, []);

	return (
		<SafeAreaView style={styles.safe}>
			<Logo style={styles.logo} />
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}
			>
				{error ?
					<Text>{error}</Text>
				:	<Markdown>{ticText}</Markdown>}
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => handleBackToSignIn()}
				>
					<Text style={styles.backButtonText}>Volver</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

export const styles = StyleSheet.create({
	safe: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FBFBFB",
	},
	logo: {
		alignSelf: "center",
		marginTop: 10,
		marginBottom: 20,
	},
	content: {
		padding: 30,
	},
	scroll: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContent: {
		paddingBottom: 60,
	},
	backButton: {
		marginBottom: 35,
		width: "45%",
		borderRadius: 30,
		backgroundColor: globalStyles.colors.primary,
		marginBlock: 30,
		alignSelf: "center",
	},
	backButtonText: {
		color: "white",
		fontFamily: "KarlaSemiBold",
		fontSize: globalStyles.fSizes.medium,
		textAlign: "center",
		paddingBlock: 15,
	},
});
