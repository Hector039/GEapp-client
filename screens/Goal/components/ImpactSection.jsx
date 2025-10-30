import { StyleSheet, Text } from "react-native";

export default function ImpactSection() {
	return <Text style={styles.content}>Componente Impacto</Text>;
}

const styles = StyleSheet.create({
	content: {
		textAlign: "center",
		marginVertical: 15,
	},
});
