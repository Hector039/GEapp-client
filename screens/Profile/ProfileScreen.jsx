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
import TicButton from "./components/ticButton.jsx";
import DeactivateAccountButton from "./components/deactivateAccountButton.jsx";

export default function ProfileScreen() {
	const { user, userAvatar } = useUser();
	return (
		<View style={styles.container}>
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
					<View>
						<Text style={styles.emailTitleText}>Mail de registro</Text>
						<Text style={styles.emailText}>{user.email}</Text>
					</View>
				</View>
			:	<ActivityIndicator size="small" />}
			{user ?
				<ScrollView style={styles.scrollContent}>
					<ChangeAvatar uid={user.id} />
					<ChangeEmail uid={user.id} oldEmail={user.email} />
					<ChangePassword uid={user.id} />
					<View style={styles.separator}>
						<Logout />
					</View>
					<View style={styles.separator}>
						<TicButton />
					</View>
					<View style={styles.separator}>
						<DeactivateAccountButton uid={user.id} />
					</View>
					<View style={styles.lastSeparator}></View>
				</ScrollView>
			:	<ActivityIndicator size="large" />}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
	},
	scrollContent: {
		flexGrow: 1,
	},
	title: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.large,
		color: globalStyles.colors.tertiary,
		textAlign: "center",
		marginTop: 20,
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
	emailTitleText: {
		fontFamily: "RubikMedium",
		fontSize: 20,
	},
	emailText: {
		fontFamily: "RubikMedium",
		fontSize: 14,
	},
	separator: {
		alignSelf: "center",
		borderTopWidth: 2,
		borderTopColor: globalStyles.colors.secondary,
		width: "85%",
	},
	lastSeparator: {
		alignSelf: "center",
		borderTopWidth: 2,
		borderTopColor: globalStyles.colors.secondary,
		width: "85%",
		marginBottom: 2,
	},
});
