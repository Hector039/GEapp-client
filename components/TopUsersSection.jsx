import { Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getTopUsers } from "../services/apiEndpoints.js";

export default function TopUsersSection() {
	const [topUsers, setTopUsers] = useState([]);
	const [error, setError] = useState("");

	async function fetchTopUsers() {
		try {
			const responseData = await getTopUsers();
			if (responseData) setTopUsers(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar los usuarios destacados");
		}
	}

	useEffect(() => {
		fetchTopUsers();
	}, []);

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<Text>Usuarios destacados:</Text>
			<View style={styles.topUsersRow}>
				{topUsers.length > 0 ?
					topUsers.map((topUser) => (
						<View style={styles.topUsersContainer} key={topUser._id}>
							<Image
								style={styles.image}
								source={
									topUser.avatar ?
										{ uri: topUser.avatar }
									:	require("../assets/default-avatar.png")
								}
								resizeMode="cover"
							/>
							<Text> {topUser.email.slice(0, topUser.email.indexOf("@"))} </Text>
						</View>
					))
				:	<Text>No hay usuarios destacados disponibles.</Text>}
			</View>
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
	topUsersContainer: {
		alignItems: "center",
		margin: 5,
	},
	topUsersRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 10,
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
});
