import { useRef, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
} from "react-native";

const ICON_MAP = {
	Home: {
		label: "Inicio",
		NormalIcon: require("../assets/icons/HomeIconNormal.svg").default,
		ActiveIcon: require("../assets/icons/HomeIconActive.svg").default,
		size: 28,
	},
	Project: {
		label: "Proyecto",
		NormalIcon: require("../assets/icons/ClockIconNormal.svg").default,
		ActiveIcon: require("../assets/icons/ClockIconActive.svg").default,
		size: 28,
	},
	Activity: {
		label: "Actividad",
		NormalIcon: require("../assets/icons/HeartIconNormal.svg").default,
		ActiveIcon: require("../assets/icons/HeartIconActive.svg").default,
		size: 28,
	},
};

export default function NavBar({ state, navigation, descriptors }) {
	return (
		<View style={styles.tabBarContainer}>
			{state.routes.map((route, index) => {
				// 1. Verificar si la ruta tiene datos de ícono (Home, Project, Activity)
				const iconData = ICON_MAP[route.name];
				// 2. Obtener el descriptor para acceder a las opciones de la pantalla
				const descriptor = descriptors[route.key];
				// 3. Obtener el componente que se usa para renderizar el botón de la pestaña
				const TabBarButton = descriptor.options.tabBarButton;
				// 4. Lógica de Filtrado:
				// Si la ruta NO tiene datos de ícono O si su TabBarButton está explícitamente
				// configurado como '() => null' (oculto), saltear (return null).
				if (!iconData || TabBarButton === null) {
					return null; // Salta la renderización de este botón
				}
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				return (
					<TabBarItem
						key={index}
						isFocused={isFocused}
						onPress={onPress}
						iconData={iconData}
					/>
				);
			})}
		</View>
	);
}

const TabBarItem = ({ isFocused, onPress, iconData }) => {
	// `fadeAnim` controlará la opacidad para el fade-in/out
	const fadeAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

	useEffect(() => {
		// Cuando el foco cambia, anima el valor de 0 a 1 o de 1 a 0
		Animated.timing(fadeAnim, {
			toValue: isFocused ? 1 : 0,
			duration: 50, // Duración del fade (suave)
			useNativeDriver: true,
		}).start();
	}, [isFocused, fadeAnim]);

	// Si está enfocado, la opacidad va a 1 (visible).
	// Si no está enfocado, la opacidad va a 0 (invisible).

	const ActiveIconComponent = iconData.ActiveIcon;
	const NormalIconComponent = iconData.NormalIcon;

	return (
		<TouchableOpacity
			accessibilityRole="button"
			accessibilityState={isFocused ? { selected: true } : {}}
			onPress={onPress}
			style={styles.tabBarItem}
		>
			<View style={styles.iconContainer}>
				<Animated.View style={[styles.absoluteFill, { opacity: fadeAnim }]}>
					<ActiveIconComponent
						width={iconData.size + 10}
						height={iconData.size + 10}
					/>
				</Animated.View>

				<Animated.View
					style={[
						styles.contentContainer,
						{
							opacity: fadeAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
						},
					]}
				>
					<NormalIconComponent
						width={iconData.size}
						height={iconData.size}
						fill={"gray"} // El color se maneja internamente en el SVG, pero por si acaso
					/>
					<Text style={styles.tabBarLabel}>{iconData.label}</Text>
				</Animated.View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	tabBarContainer: {
		flexDirection: "row",
		backgroundColor: "white",
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 80,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 5,
	},
	tabBarItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		position: "relative",
	},
	// Contenedor para alinear el ícono y el texto, centrado
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	// Contenedor para el icono normal y el texto
	contentContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
	},
	// Para superponer los íconos
	absoluteFill: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	tabBarLabel: {
		fontSize: 12,
		marginTop: 2,
		color: "gray",
		fontFamily: "RubikRegular",
	},
});
