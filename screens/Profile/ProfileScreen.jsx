import { StyleSheet, View } from "react-native";
import { useUser } from "../../context/UserContext.js";
import Logout from "./components/logout.jsx";
import ChangePassword from "./components/changePassword.jsx";
import ChangeEmail from "./components/changeEmail.jsx";
import ChangeAvatar from "./components/changeAvatar.jsx";
import HeaderBar from "../../components/HeaderBar.jsx";
import NavBar from "../../components/NavBar.jsx";

export default function Profile() {
	const { user } = useUser();
	return (
		<View style={styles.container}>
			<HeaderBar />
			<View style={styles.content}>
				{user && <ChangeEmail uid={user.id} oldEmail={user.email} />}
				{user && <ChangePassword uid={user.id} />}
				{user && <ChangeAvatar uid={user.id} />}
				<Logout />
			</View>
			<NavBar />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "grid",
		gridTemplateRows: "auto 1fr auto",
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
