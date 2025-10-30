import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getDataChart } from "../../../services/apiEndpoints";

const screenWidth = Dimensions.get("window").width;

const FILTERS = ["Semana", "Mes", "Año"];

const formatApiData = (apiData) => {
	if (apiData.length === 0) {
		return {
			datasets: [{ data: [] }],
			labels: [],
		};
	}

	const labels = apiData.map((item) => item.label);
	const chartData = apiData.map((item) => item.steps);

	return {
		datasets: [{ data: chartData }],
		labels,
	};
};

const StepsChartSection = ({ uid }) => {
	const [activeFilter, setActiveFilter] = useState("Mes");
	const [isLoading, setIsLoading] = useState(true);
	const [apiData, setApiData] = useState([]);
	const [error, setError] = useState(null);

	const fetchStepsData = async (filter) => {
		setError(null);
		try {
			const responseData = await getDataChart(uid, filter);
			if (responseData) {
				const formatedData = formatApiData(responseData.data);
				setApiData(formatedData);
				console.log("data en formatedData:", formatedData);
				console.log("datasets en formatedData:", formatedData.datasets);
				console.log("bars from labels:", formatedData.labels.length);
				setIsLoading(false);
			}
		} catch (err) {
			console.error("Fetch Error:", err);
			setError("No fue posible conectar con el servidor para obtener los datos.");
		}
	};

	useEffect(() => {
		fetchStepsData(activeFilter);
	}, [activeFilter]);

	const chartConfig = {
		backgroundGradientFrom: "#1E2923",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#08130D",
		backgroundGradientToOpacity: 0,
		color: (opacity = 1) => `rgba(0, 129, 66,  ${opacity})`,
		strokeWidth: 1,
		barPercentage: 0.5,
		propsForLabels: {
			fontSize: 15,
		},
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Historial de Pasos</Text>

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

			{/* Área de Visualización */}
			<View style={styles.chartWrapper}>
				<Text>Pasos por {activeFilter}</Text>
				{error ?
					<Text>{error}</Text>
				:	null}

				{isLoading ?
					<Text>Loading...</Text>
				:	<BarChart
						data={apiData}
						width={screenWidth - 50}
						height={180}
						chartConfig={chartConfig}
						verticalLabelRotation={0}
						style={styles.chart}
						withInnerLines={true}
						withVerticalLabels={true}
						withHorizontalLabels={false}
						showValuesOnTopOfBars={true}
						fromZero={true}
						//formatYLabel={chartConfig.formatYLabel}
						// Ajusta el número de divisiones del eje Y basado en la longitud de los datos
						segments={apiData.labels.length > 4 ? 6 : 4}
					/>
				}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		marginHorizontal: 16,
		marginBottom: 20,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1F2937",
		marginBottom: 15,
	},
	filterContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#E5E7EB",
		borderRadius: 12,
		marginBottom: 20,
		padding: 4,
	},
	filterButton: {
		flex: 1,
		paddingVertical: 8,
		borderRadius: 8,
		alignItems: "center",
		marginHorizontal: 2,
	},
	filterButtonActive: {
		backgroundColor: "#22C55E",
	},
	filterText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#4B5563",
	},
	filterTextActive: {
		color: "#FFFFFF",
		fontWeight: "700",
	},
	chartWrapper: {
		alignItems: "center",
		paddingBottom: 10,
	},
	chart: {
		borderRadius: 16,
		padding: 5,
	},
});

export default StepsChartSection;
