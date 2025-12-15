import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

const CustomLightModal = ({ visible, onClose, errorMessage }) => {
	return (
		<Modal animationType="fade" transparent={true} visible={visible}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>{errorMessage}</Text>
					<Pressable style={styles.button} onPress={onClose}>
						<Text style={styles.textStyle}>Cerrar</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.9,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		fontFamily: "KarlaBold",
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 16,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		backgroundColor: "#80b34925",
	},
	textStyle: {
		fontFamily: "KarlaBold",
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default CustomLightModal;
