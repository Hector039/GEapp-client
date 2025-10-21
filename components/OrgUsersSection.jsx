import { Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getOrgUsers } from "../services/apiEndpoints";

export default function OrgUsersSection({ uid }) {
	const [orgUsers, setOrgUsers] = useState([]);
	const [error, setError] = useState("");

	async function fetchOrgUsers() {
		try {
			const responseData = await getOrgUsers(uid);
			if (responseData) setOrgUsers(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar los usuarios destacados");
		}
	}

	useEffect(() => {
		fetchOrgUsers();
	}, []);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<Text>Usuarios destacados de tu organización:</Text>
			{orgUsers.length > 0 ?
				orgUsers.map((orgUser) => (
					<View style={styles.orgUsersContainer} key={orgUser._id}>
						<Image
							style={styles.image}
							source={
								orgUser.avatar ?
									{ uri: orgUser.avatar }
								:	require("../assets/default-avatar.png")
							}
							resizeMode="cover"
						/>
						<Text> {orgUser.email.slice(0, orgUser.email.indexOf("@"))} </Text>
					</View>
				))
			:	<Text>No hay usuarios destacados de tu organización aún.</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d0d0d0ff",
		alignItems: "center",
		justifyContent: "center",
	},
	orgUsersContainer: {
		alignItems: "center",
		margin: 5,
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
});
