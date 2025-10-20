import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUserCommunity } from "../services/apiEndpoints.js";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CommunitySection() {
	const navigation = useNavigation();
	const [error, setError] = useState("");
	const [community, setCommunity] = useState([]);

	async function fetchUserCommunity() {
		try {
			const responseData = await getUserCommunity();
			if (responseData) setCommunity(responseData);
		} catch (error) {
			console.log(error);
			setError("Error al cargar los datos de la comunidad");
		}
	}

	useEffect(() => {
		fetchUserCommunity();
	}, []);

	function handleSeeMore() {
		navigation.navigate("Community");
	}

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<View style={styles.titleContainer}>
				<Text>Comunidad:</Text>
				<View style={styles.seeMoreContainer}>
					<TouchableOpacity onPress={handleSeeMore}>
						<Text>Ver más</Text>
					</TouchableOpacity>
					<Ionicons name="arrow-forward-outline" size={25} color="#333b30ff" />
				</View>
			</View>
			<View style={styles.newUsersContainer}>
				<Text>Últimos caminadores seriales:</Text>
				<View style={styles.newUsersRow}>
					{community && community.length > 0 ?
						community.map((newCommunityUser) => (
							<View style={styles.usersContainer} key={newCommunityUser._id}>
								<Image
									style={styles.image}
									source={
										newCommunityUser.avatar ?
											{ uri: newCommunityUser.avatar }
										:	require("../assets/default-avatar.png")
									}
									resizeMode="cover"
								/>
								<Text>
									{newCommunityUser.email.slice(0, newCommunityUser.email.indexOf("@"))}
								</Text>
							</View>
						))
					:	<Text>Error recibiendo nuevos usuarios</Text>}
				</View>
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
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "80%",
	},
	newUsersContainer: {
		marginTop: 20,
	},
	seeMoreContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	usersContainer: {
		alignItems: "center",
		margin: 5,
	},
	newUsersRow: {
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
