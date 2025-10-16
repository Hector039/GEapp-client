import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para usar íconos de Expo

const CustomModal = ({
    visible,
    onClose,
    title,
    message,
    buttons, // Array de objetos { text: 'Botón', onPress: () => {}, style: {} }
    backgroundColor, // Color de fondo del contenido del modal
    iconName, // Nombre del ícono (ej: 'checkmark-circle', 'warning')
    iconColor, // Color del ícono
    iconSize = 60, // Tamaño del ícono por defecto
}) => {
    return (
        <Modal
            animationType="fade" // O 'slide' para un efecto diferente
            transparent={true}
            visible={visible}
            onRequestClose={onClose} // Obligatorio para Android al presionar el botón de atrás
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: backgroundColor || '#fff' }]}>
                    {iconName && (
                        <Ionicons
                            name={iconName}
                            size={iconSize}
                            color={iconColor || '#333'}
                            style={styles.icon}
                        />
                    )}
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.button, button.style]}
                                onPress={button.onPress}
                            >
                                <Text style={styles.buttonText}>{button.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente oscuro
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Ancho del modal
    },
    icon: {
        marginBottom: 15,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        minWidth: 100, // Ancho mínimo para los botones
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomModal;
