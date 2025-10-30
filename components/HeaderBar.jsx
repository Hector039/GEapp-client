import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../context/UserContext.js";
import { useNavigation } from "@react-navigation/native";

export default function HeaderBar() {
	const { user, userAvatar } = useUser();
	const navigation = useNavigation();

	const handleGoToProfile = () => {
		navigation.navigate("Profile");
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handleGoToProfile}>
				<Image
					style={styles.userAvatar}
					source={
						userAvatar ? { uri: userAvatar } : require("../assets/default-avatar.png")
					}
					resizeMode="cover"
				/>
			</TouchableOpacity>

			<View style={styles.userInfoContainer}>
				<Text>
					Bienvenido {user ? user.email.slice(0, user.email.indexOf("@")) : ""}
				</Text>
				<Text>Tu acción suma!</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingVertical: 30,
	},
	userInfoContainer: {
		flexDirection: "column",
	},
	userAvatar: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
});
