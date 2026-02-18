import {
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Text,
	ImageBackground,
} from "react-native";
import { getDataChart } from "../../../services/apiEndpoints";
import { useEffect, useState } from "react";
import { globalStyles } from "../../../stylesConstants";
import backGroundimage from "../assets/graphBackground.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FILTERS = ["Semana", "Mes", "Año"];

// Altura máxima del contenedor (100% de la meta visual)
const MAX_HEIGHT = 110;

// --- Componente Principal ---
const ChartGraph = ({ uid, totalSteps }) => {
	const [activeFilter, setActiveFilter] = useState("Semana");
	const [isLoading, setIsLoading] = useState(true);
	const [apiData, setApiData] = useState([]);
	const [streak, setStreak] = useState(0);

	const fetchStepsData = async (filter) => {
		setIsLoading(true);
		const streakCount = await AsyncStorage.getItem("streak");
		setStreak(streakCount ? JSON.parse(streakCount) : 0);
		try {
			// El backend ahora devuelve un array de porcentajes: [P1, P2, ...]
			const responseData = await getDataChart(uid, filter);
			if (responseData) {
				console.log("responseData in chartGraph: ", responseData);
				setApiData(responseData);
				setIsLoading(false);
			}
		} catch (err) {
			console.error("Fetch Error:", err);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStepsData(activeFilter);
	}, [activeFilter, uid]);

	return (
		<View style={styles.container}>
			{/* Contenedor de Filtros de Tiempo */}
			<View style={styles.filterContainer}>
				{FILTERS.map((filter) => (
					<TouchableOpacity
						key={filter}
						style={[
							styles.filterButton,
							activeFilter === filter && styles.filterButtonActive,
						]}
						onPress={() => setActiveFilter(filter)}
					>
						<Text
							style={[
								styles.filterText,
								activeFilter === filter && styles.filterTextActive,
							]}
						>
							{filter}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Contenedor Principal del Gráfico */}
			{
				isLoading ?
					<Text style={styles.loadingText}>Cargando datos...</Text>
					// El ImageBackground actúa como el contenedor del gráfico y su fondo
				:	<ImageBackground
						source={backGroundimage}
						resizeMode="stretch"
						style={styles.graphContainer}
					>
						{activeFilter === "Semana" ?
							<Text style={styles.chartInfoText}>7 días atrás en %</Text>
						:	null}
						{activeFilter === "Mes" ?
							<Text style={styles.chartInfoText}>4 semanas atrás en %</Text>
						:	null}
						{activeFilter === "Año" ?
							<Text style={styles.chartInfoText}>12 meses atrás en %</Text>
						:	null}

						<View style={styles.barContainer}>
							{apiData.map((percentage, index) => {
								const barHeight = (percentage / 100) * MAX_HEIGHT;

								return (
									<View key={index} style={styles.emptyBars}>
										<View
											style={[
												styles.barStyle,
												{
													width: 10,
													height: barHeight,
												},
											]}
										/>
									</View>
								);
							})}
						</View>

						<View style={styles.stepsTextWrapper}>
							<Text style={styles.stepsText}>{totalSteps}</Text>
							<Text style={styles.textWithSteps}>pasos</Text>
							<Text style={styles.textWithSteps}>- Días de racha: {streak}</Text>
						</View>
					</ImageBackground>

			}
		</View>
	);
};

// --- Estilos Corregidos ---
const styles = StyleSheet.create({
	container: {
		marginBlock: 30,
		width: "90%",
		alignSelf: "center",
	},
	graphContainer: {
		paddingTop: 20,
	},
	// Contenedor del Gráfico de Barras y el fondo
	barContainer: {
		height: MAX_HEIGHT,
		width: "95%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignSelf: "center",
		gap: 20,
	},
	// Estilo base de cada barra
	barStyle: {
		backgroundColor: globalStyles.colors.primary,
		borderRadius: 4,
	},
	emptyBars: {
		height: MAX_HEIGHT,
		borderRadius: 4,
		backgroundColor: "#67a59958",
		alignItems: "flex-end",
		flexDirection: "row",
	},
	loadingText: {
		color: "#FFF",
		textAlign: "center",
		paddingVertical: MAX_HEIGHT / 2,
	},
	// --- Estilos de Filtro ---
	filterContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 15,
	},
	filterButton: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 30,
		alignItems: "center",
		borderColor: globalStyles.colors.secondary,
		borderWidth: 2,
	},
	filterButtonActive: {
		backgroundColor: globalStyles.colors.secondary,
	},
	filterText: {
		fontFamily: "RubikMedium",
		fontSize: 14,
		color: globalStyles.colors.secondary,
	},
	filterTextActive: {
		color: "#FFFFFF",
	},
	stepsTextWrapper: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 15,
		gap: 8,
		// Ajustamos la posición para que no se superponga
		position: "relative",
		bottom: 0,
		left: 30,
		right: 0,
	},
	stepsText: {
		fontFamily: "RubikMedium",
		fontSize: 30,
		color: "#ffffffff",
	},
	textWithSteps: {
		fontFamily: "RubikMedium",
		color: "#ffffffff",
		fontSize: globalStyles.fSizes.medium,
	},
	chartInfoText: {
		fontFamily: "RubikMedium",
		color: "#67a599a4",
		fontSize: globalStyles.fSizes.small,
		textAlign: "right",
		paddingBottom: 8,
	},
});

export default ChartGraph;
