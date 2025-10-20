import { StyleSheet, View } from "react-native";
import { useUser } from "../context/UserContext.js";
import Logout from "../components/profileComponents/logout.jsx";
import ChangePassword from "../components/profileComponents/changePassword.jsx";
import ChangeEmail from "../components/profileComponents/changeEmail.jsx";
import ChangeAvatar from "../components/profileComponents/changeAvatar.jsx";
import HeaderBar from "../components/HeaderBar.jsx";
import NavBar from "../components/NavBar.jsx";

export default function Profile() {
	const { user } = useUser();
	return (
		<>
			<View style={styles.container}>
				{user && <ChangeEmail uid={user.id} oldEmail={user.email} />}
				{user && <ChangePassword uid={user.id} />}
				{user && <ChangeAvatar uid={user.id} />}
				<Logout />
			</View>
			<HeaderBar />
			<NavBar />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
	},
});
