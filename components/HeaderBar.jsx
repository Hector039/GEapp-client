import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../context/UserContext.js";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../stylesConstants.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HeaderBar({ title, subTitle }) {
	const { user, userAvatar } = useUser();
	const navigation = useNavigation();

	const handleGoToProfile = () => {
		navigation.navigate("Profile");
	};

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity onPress={handleGoToProfile}>
				<Image
					style={styles.userAvatar}
					source={
						userAvatar ?
							{ uri: userAvatar }
						:	require("../assets/avatar-generico-dama.png")
					}
					resizeMode="cover"
				/>
			</TouchableOpacity>

			<View style={styles.userInfoContainer}>
				{subTitle ?
					<Text style={styles.titleWelcome}>
						Hola {user.email ? user.email.slice(0, user.email.indexOf("@")) : ""}
					</Text>
				:	<Text style={styles.title}>{title}</Text>}
				{subTitle ?
					<Text style={styles.subTitleWelcome}>{subTitle}</Text>
				:	null}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "relative", // Fija la barra
		top: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 20,
		marginLeft: 25,
		gap: 30,
		height: 120,
	},
	userInfoContainer: {
		flexDirection: "column",
	},
	userAvatar: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
	titleWelcome: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: globalStyles.colors.tertiary,
	},
	subTitleWelcome: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.small,
		color: globalStyles.colors.tertiary,
	},
	title: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
	},
});
