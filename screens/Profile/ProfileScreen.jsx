import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useUser } from "../../context/UserContext.js";
import Logout from "./components/logout.jsx";
import ChangePassword from "./components/changePassword.jsx";
import ChangeEmail from "./components/changeEmail.jsx";
import ChangeAvatar from "./components/changeAvatar.jsx";
import { globalStyles } from "../../stylesConstants.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
	const { user, userAvatar } = useUser();
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Perfil</Text>
			{user ?
				<View style={styles.userInfocontainer}>
					<Image
						style={styles.userAvatar}
						source={
							userAvatar ?
								{ uri: userAvatar }
							:	require("../../assets/avatar-generico-dama.png")
						}
						resizeMode="cover"
					/>
					<View style={styles.emailInfoContainer}>
						<Text style={styles.emailTitleText}>Mail de registro</Text>
						<Text style={styles.emailText}>{user.email}</Text>
					</View>
				</View>
			:	<ActivityIndicator size="small" />}
			{user ?
				<ScrollView style={styles.content}>
					<ChangeEmail uid={user.id} oldEmail={user.email} />
					<ChangePassword uid={user.id} />
					<ChangeAvatar uid={user.id} />
					<Logout />
				</ScrollView>
			:	<ActivityIndicator size="large" />}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
		marginTop: 40,
		marginBottom: 80,
	},
	title: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
		textAlign: "center",
	},
	userInfocontainer: {
		flexDirection: "row",
		alignSelf: "center",
		alignItems: "center",
		gap: 20,
	},
	userAvatar: {
		width: 130,
		height: 130,
		borderRadius: 80,
	},
	emailInfoContainer: {},
	emailTitleText: {
		fontFamily: "RubikMedium",
		fontSize: 20,
	},
	emailText: {
		fontFamily: "RubikMedium",
		fontSize: 14,
	},
	content: {
		gap: 10,
	},
});
