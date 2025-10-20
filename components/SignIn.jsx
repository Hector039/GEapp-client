import { Picker } from "@react-native-picker/picker";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { userSignUp, getOrgData } from "../services/apiEndpoints.js";
import { useState } from "react";
import { passwordRegex, emailRegex } from "../tools/regexConstants";
import CustomModal from "../tools/CustomModal";

export default function SignIn() {
	const navigation = useNavigation();

	const [modalVisible, setModalVisible] = useState(false);
	const [isInOrganization, setIsInorganization] = useState(false);

	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");
	const [organizations, setOrganizations] = useState([
		{ id: 0, name: "No org" },
	]);
	const [selectedItem, setSelectedItem] = useState("");

	const handleSignIn = async () => {
		setError("");
		if (!email || !password || !rePassword) return setError("Faltan datos");
		if (isInOrganization && !selectedItem)
			return setError("Selecciona la organización a la que perteneces");
		if (password !== rePassword) return setError("Las contraseñas no coinciden");

		if (!emailRegex.test(email))
			return setError("Correo inválido, verifica e intenta nuevamente");
		if (!passwordRegex.test(password))
			return setError(
				"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
			);

		try {
			const responseData = await userSignUp(email, password, selectedItem);
			console.log("SignIn data:", responseData);
			if (responseData) setModalVisible(true);
		} catch (error) {
			console.log(error);
			setError(error.response?.data?.error || "Error de registro");
		}
	};

	const handleIsInOrganizationChange = async (newValue) => {
		setIsInorganization(newValue);
		if (newValue === true) {
			try {
				const responseData = await getOrgData();
				console.log("Org data:", responseData);
				if (responseData && Array.isArray(responseData))
					setOrganizations(responseData);
			} catch (error) {
				console.log("Error fetching Org data:", error);
				setError(error.response?.data?.error || "Error buscando la organización");
			}
		}
	};

	return (
		<View style={styles.container}>
			{error ?
				<Text>{error}</Text>
			:	null}
			<TextInput
				placeholder="Correo electrónico"
				placeholderTextColor="#000000ff"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				placeholder="Contraseña"
				placeholderTextColor="#000000ff"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<TextInput
				placeholder="Confirma Contraseña"
				placeholderTextColor="#000000ff"
				secureTextEntry
				value={rePassword}
				onChangeText={setRePassword}
			/>
			<View style={styles.switchContainer}>
				<Text>Perteneces una organización?</Text>
				<Text>NO</Text>
				<Switch
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					thumbColor={isInOrganization ? "#f5dd4b" : "#f4f3f4"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={handleIsInOrganizationChange}
					value={isInOrganization}
				/>
				<Text>SI</Text>
			</View>

			<View style={styles.pickerContainer}>
				{isInOrganization && organizations.length > 0 && (
					<Picker
						selectedValue={selectedItem}
						onValueChange={(itemValue) => setSelectedItem(itemValue)}
						style={styles.picker}
					>
						<Picker.Item label="Selecciona una organización" value="" />
						{organizations.map((org) => (
							<Picker.Item key={org.id} label={org.name} value={org.name} />
						))}
					</Picker>
				)}
			</View>

			<TouchableOpacity onPress={() => handleSignIn()}>
				<Text>Ingresar</Text>
			</TouchableOpacity>

			<CustomModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				title="Bienvenido!"
				message="Por favor revisa tu email para verificar tu cuenta antes de loguearte."
				backgroundColor="#e6ffe6"
				iconName="checkmark-circle-outline"
				iconColor="green"
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							setModalVisible(false);
							navigation.reset({
								index: 0,
								routes: [{ name: "SignLogin" }],
							});
						},
						style: { backgroundColor: "green" },
					},
				]}
			/>
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
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	pickerContainer: {
		backgroundColor: "transparent",
	},
	picker: {
		height: 60,
		width: 300,
		color: "black",
	},
});
