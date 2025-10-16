import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../context/UserContext.js";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

export default function HeaderBar() {
	const { user, userAvatar } = useContext(UserContext);
	const navigation = useNavigation();

	const handleGoToProfile = () => {
		navigation.navigate("Profile");
	};

	return (
		<View style={styles.userInfoContainer}>
			<TouchableOpacity onPress={handleGoToProfile}>
				<Image
					style={styles.userAvatar}
					source={
						userAvatar ? { uri: userAvatar } : require("../assets/default-avatar.png")
					}
					resizeMode="cover"
				/>
			</TouchableOpacity>

			<View style={styles.userOrgContainer}>
				<Text>
					Bienvenido {user ? user.email.slice(0, user.email.indexOf("@")) : ""}
				</Text>
				{user && user.org && <Text>{user.org}</Text>}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	userInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingVertical: 30,
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	userOrgContainer: {
		flexDirection: "column",
	},
	userAvatar: {
		width: 30,
		height: 30,
		borderRadius: 50,
	},
});
