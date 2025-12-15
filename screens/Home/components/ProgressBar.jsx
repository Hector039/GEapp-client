import { StyleSheet, View } from "react-native";
import { globalStyles } from "../../../stylesConstants";

export default function ProgressBar({ percentage }) {
	// Aseguramos que el porcentaje esté entre 0 y 100
	const progreso = Math.min(100, Math.max(0, percentage));
	// Calculamos el ancho en porcentaje
	const anchoBarra = `${progreso}%`;

	return (
		<View style={styles.contenedor}>
			<View
				style={[
					styles.barra,
					{ width: anchoBarra },
					{
						backgroundColor:
							progreso < 100 ?
								globalStyles.colors.tertiary
							:	globalStyles.colors.primary,
					},
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		width: "100%",
		height: 8,
		backgroundColor: "#e0e0e0",
		borderRadius: 10,
		overflow: "hidden",
	},
	barra: {
		height: "100%",
		borderRadius: 10,
	},
});
