import { useEffect, useState } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	Text,
	Switch,
	ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
	deactivateAccount,
	reactivateUserAccount,
	userLogin,
} from "../../../services/apiEndpoints.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { passwordRegex, emailRegex } from "../../../tools/regexConstants.js";
import { useUser } from "../../../context/UserContext.js";
import { globalStyles } from "../../../stylesConstants";
import CustomLightModal from "../../../tools/CustomLightModal.jsx";
import CustomModal from "../../../tools/CustomModal.jsx";

export default function Login() {
	const { setUser, setUserAvatar, setOrgEvent, setProject } = useUser();
	const navigation = useNavigation();

	const [errorModalVisible, setErrorModalVisible] = useState(false);
	const [isDeactivatedModalVisible, setIsDeactivatedModalVisible] =
		useState(false);
	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [userId, setUserId] = useState(null);
	const [password, setPassword] = useState("");

	const [isRemembered, setIsRemembered] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		if (isLoading) return;
		setIsLoading(true);
		if (!email || !password) return handleError("Faltan datos");
		if (!emailRegex.test(email))
			return handleError("Correo inválido, verifica e intenta nuevamente");
		if (!passwordRegex.test(password))
			return handleError(
				"Contraseña inválida, debe tener entre 6 y 8 caracteres y no contener caracteres especiales",
			);
		try {
			const responseData = await userLogin(email, password);

			if (responseData.user.status === false) {
				setIsDeactivatedModalVisible(true);
				setUserId(responseData.user.id);
				return;
			}

			if (responseData.user.avatar) setUserAvatar(responseData.user.avatar);
			if (responseData.orgEvent) setOrgEvent(responseData.orgEvent);
			if (responseData.project) setProject(responseData.project);

			if (responseData) {
				console.log("Login data user:", responseData);
				setIsLoading(false);

				const today = new Date();
				const registerUserDate = new Date(responseData.user.registerDate);
				if (
					today.getDate() === registerUserDate.getDate() &&
					today.getMonth() === registerUserDate.getMonth() &&
					today.getFullYear() === registerUserDate.getFullYear()
				) {
					return navigation.navigate("Onboarding", {
						orgName: responseData.orgEvent.orgName,
						treeGoal: responseData.project.treeGoal,
						locationProject: responseData.project.location,
						user: responseData.user,
					});
				}
				setUser(responseData.user);
			}
		} catch (error) {
			console.log(error.message);
			handleError(error.message || "Error de login");
		} finally {
			setIsLoading(false);
		}
	};

	const activateUser = async (uid) => {
		try {
			const responseData = await reactivateUserAccount(uid);
			if (responseData.ok) {
				setError(
					"Tu cuenta se reactivó correctamente, ya puedes ingresar normalmente.",
				);
				setErrorModalVisible(!errorModalVisible);
			}
		} catch (error) {
			console.log(error.message);
			handleError(error.message || "Error de activación");
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

	const handleError = (error) => {
		setError(error);
		setErrorModalVisible(!errorModalVisible);
		setIsLoading(false);
	};

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Correo electrónico"
				placeholderTextColor="#5E5D5D"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
				style={styles.textInput}
			/>
			<TextInput
				placeholder="Contraseña"
				placeholderTextColor="#5E5D5D"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				style={styles.textInput}
			/>

			<View style={styles.rememberMeContainer}>
				<Switch
					trackColor={{ false: "#d8d8d8ff", true: "#67A599" }}
					thumbColor={isRemembered ? "#80B349" : "#a8a8a8ff"}
					ios_backgroundColor="#3e3e3e"
					onValueChange={handleRememberChange}
					value={isRemembered}
				/>
				<Text style={styles.rememberMeText}>Recordarme</Text>
			</View>
			<TouchableOpacity onPress={handlePassRestoration}>
				<Text style={styles.forgotText}>OLVIDÉ mi contraseña</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => handleLogin()}
				style={[styles.loginButton, isLoading && styles.disabledButton]}
				disabled={isLoading}
			>
				{isLoading ?
					<ActivityIndicator color="#fff" />
				:	<Text style={styles.loginButtonText}>Ingresar</Text>}
			</TouchableOpacity>

			<CustomLightModal
				visible={errorModalVisible}
				onClose={() => setErrorModalVisible(!errorModalVisible)}
				errorMessage={error}
			/>

			<CustomModal
				visible={isDeactivatedModalVisible}
				onClose={() => setIsDeactivatedModalVisible(false)}
				title="Bienvenido!"
				message="Este usuario está desactivado, quieres activarlo?."
				backgroundColor="#e6ffe6"
				iconName="warning-outline"
				iconColor="#736f38ff"
				buttons={[
					{
						text: "Aceptar",
						onPress: () => {
							activateUser(userId);
							setIsDeactivatedModalVisible(false);
						},
						style: { backgroundColor: globalStyles.colors.primary },
					},
					{
						text: "Cancelar",
						onPress: () => {
							setIsDeactivatedModalVisible(false);
						},
						style: { backgroundColor: "#735F38" },
					},
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 30,
		borderColor: globalStyles.colors.tertiary,
		borderWidth: 2,
		width: "85%",
		marginBottom: 30,
	},
	textInput: {
		width: "85%",
		borderColor: globalStyles.colors.secondary,
		borderWidth: 1,
		borderRadius: 18,
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		color: "#5E5D5D",
		textAlign: "center",
		backgroundColor: "#80b34925",
		marginTop: 40,
		paddingBlock: 15,
	},
	rememberMeContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
		marginBlock: 15,
	},
	rememberMeText: {
		color: globalStyles.colors.tertiary,
		fontFamily: "KarlaExtraBold",
		fontSize: globalStyles.fSizes.medium,
	},
	forgotText: {
		color: globalStyles.colors.tertiary,
		fontFamily: "KarlaExtraBold",
		fontSize: globalStyles.fSizes.medium,
	},
	loginButton: {
		width: "45%",
		height: 60,
		borderRadius: 30,
		backgroundColor: globalStyles.colors.primary,
		marginBlock: 30,
	},
	disabledButton: {
		justifyContent: "center",
	},
	loginButtonText: {
		color: "white",
		fontFamily: "KarlaBold",
		fontSize: globalStyles.fSizes.large,
		textAlign: "center",
		paddingBlock: 15,
	},
});
