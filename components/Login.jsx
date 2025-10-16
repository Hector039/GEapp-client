import { useEffect, useState, useContext } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	Text,
	Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { passwordRegex, emailRegex } from "../tools/regexConstants";
import { UserContext } from "../context/UserContext.js";

const userLogin = "users/login";

export default function Login() {
	const { setUser, setUserAvatar } = useContext(UserContext);
	const navigation = useNavigation();
	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [isRemembered, setIsRemembered] = useState(false);

	const handleLogin = async () => {
		setError("");
		try {
			if (!email || !password) return setError("Faltan datos");
			if (!emailRegex.test(email))
				return setError("Correo inválido, verifica e intenta nuevamente");
			if (!passwordRegex.test(password))
				return setError(
					"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales"
				);

			axios
				.post(userLogin, { email: email, password: password })
				.then(async (response) => {
					await AsyncStorage.setItem("user", JSON.stringify(response.data));
					setUser(response.data);
					if (response.data.avatar) {
						setUserAvatar(response.data.avatar);
					}
					navigation.reset({
						index: 0,
						routes: [{ name: "Home" }],
					});
				})
				.catch((error) => {
					console.log(error.response.data);
					setError(error.response?.data?.error || "Error de login");
				});
		} catch (error) {
			console.log("Login error:", error);
		}
	};

	const handlePassRestoration = () => {
		navigation.navigate("PasswordRestoration");
	};

	// Función para cargar el estado guardado al iniciar la app
	const loadRememberedState = async () => {
		try {
			const isRemembered = await AsyncStorage.getItem("isRemembered");
			if (isRemembered !== null) {
				setIsRemembered(JSON.parse(isRemembered));

				if (isRemembered === "true") {
					const userEmail = await AsyncStorage.getItem("userEmail");
					const userPass = await AsyncStorage.getItem("userPassword");
					if (userEmail && userPass) {
						setEmail(JSON.parse(userEmail));
						setPassword(JSON.parse(userPass));
					}
				}
			}
		} catch (error) {
			console.error("Error loading remembered state", error);
		}
	};

	// Función para manejar el cambio del switch y guardarlo
	const handleRememberChange = async (newValue) => {
		try {
			setIsRemembered(newValue);
			await AsyncStorage.setItem("isRemembered", JSON.stringify(newValue));
			if (email && password && newValue) {
				await AsyncStorage.setItem("userEmail", JSON.stringify(email));
				await AsyncStorage.setItem("userPassword", JSON.stringify(password));
			}
		} catch (error) {
			console.error("Error saving remembered state", error);
		}
	};

	useEffect(() => {
		loadRememberedState();
	}, []);

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
			<View style={styles.rememberMeContainer}>
				<Text>Recordarme</Text>
				<Switch
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					thumbColor={isRemembered ? "#f5dd4b" : "#f4f3f4"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={handleRememberChange}
					value={isRemembered}
				/>
			</View>
			<TouchableOpacity onPress={() => handleLogin()}>
				<Text>Ingresar</Text>
			</TouchableOpacity>

			<View style={styles.restorationContainer}>
				<Text> ¿Olvidaste tu contraseña? </Text>
				<TouchableOpacity onPress={handlePassRestoration}>
					<Text>Restáurala aquí</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity>
				<Text>Continuar con Google</Text>
			</TouchableOpacity>
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
	restorationContainer: {
		flexDirection: "row",
		marginTop: 50,
	},
	rememberMeContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});
