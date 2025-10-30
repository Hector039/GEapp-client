import { StyleSheet, Text, View, Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function SimpleUserIndicatorsSection({
	recommendedSteps,
	steps,
}) {
	const chartConfig = {
		backgroundGradientFrom: "#1E2923",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#08130D",
		backgroundGradientToOpacity: 0,
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
	};

	return (
		<View style={styles.container}>
			<Text>Meta diaria</Text>
			<View style={styles.indicatorsContainer}>
				<View style={styles.percentageContainer}>
					<Text>{(steps * 100) / recommendedSteps}%</Text>
				</View>
				<ProgressChart
					data={{ data: [steps / recommendedSteps] }}
					width={screenWidth}
					height={400}
					strokeWidth={20}
					radius={32}
					chartConfig={chartConfig}
					hideLegend={true}
				/>
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
	percentageContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	indicatorsContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		width: screenWidth,
		height: 120,
	},
});
