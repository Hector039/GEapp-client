import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { globalStyles } from "../../stylesConstants";
import { useRef, useState } from "react";

import Onboarding1png from "./assets/onboarding1png.png";
import Onboarding2png from "./assets/onboarding2png.png";
import Onboarding3png from "./assets/onboarding3png.png";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { orgName, steps, treeGoal, locationProject } = route.params;
	const data = [
		{
			id: 1,
			image: Onboarding1png,
			title: `Cuida tu salud y compromete a tu empresa`,
			text: `Te invitamos a salvar el planeta mientras cuidas tu salud.`,
		},
		{
			id: 2,
			image: Onboarding2png,
			title: `${orgName} desafió asus empleados a caminar`,
			text: `Los empleados deben caminar ${steps} pasos en un tiempo especificado.`,
		},
		{
			id: 3,
			image: Onboarding3png,
			title: `Si se cumple el desafío, ${orgName} donará ${treeGoal} arboles`,
			text: `Que serán plantados en ${locationProject}.`,
		},
	];

	const flatListRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const scrollToNextItem = () => {
		if (currentIndex < data.length - 1) {
			const nextIndex = currentIndex + 1;
			flatListRef.current.scrollToIndex({
				index: nextIndex,
				animated: true, // Para un desplazamiento suave
			});
			setCurrentIndex(nextIndex);
		}
	};

	const scrollToPreviousItem = () => {
		if (currentIndex > 0) {
			const prevIndex = currentIndex - 1;
			flatListRef.current.scrollToIndex({
				index: prevIndex,
				animated: true,
			});
			setCurrentIndex(prevIndex);
		}
	};

	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		if (viewableItems.length > 0) {
			setCurrentIndex(viewableItems[0].index);
		}
	});
	const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

	const renderDots = () => {
		return (
			<View style={styles.dotContainer}>
				{data.map((_, index) => (
					<View
						key={index.toString()}
						style={[
							styles.dot,
							// Aplicar el color verde si el índice coincide con el actual
							index === currentIndex && styles.activeDot,
						]}
					/>
				))}
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<FlatList
				ref={flatListRef}
				data={data}
				keyExtractor={(item) => item.id}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				decelerationRate="fast"
				pagingEnabled={true}
				onViewableItemsChanged={onViewableItemsChanged.current}
				viewabilityConfig={viewabilityConfig}
				getItemLayout={(data, index) => ({
					length: width,
					offset: width * index,
					index,
				})}
				renderItem={({ item, index }) => {
					/* const SvgComponent = item.image; */
					return (
						<View style={styles.itemContainer}>
							<TouchableOpacity
								onPress={
									currentIndex === 0 ?
										() => navigation.navigate("MainTabs", { screen: "Home" })
									:	scrollToPreviousItem
								}
								style={styles.skipIntroButton}
							>
								<Text style={styles.skipIntroButtonText}>
									{currentIndex === 0 ? "Omitir intro" : "Anterior"}
								</Text>
							</TouchableOpacity>

							<Image source={item.image} style={styles.image} />
							{/* <SvgComponent
								style={styles.image}
								width={styles.image.width} // A veces necesario
								height={styles.image.height} // A veces necesario
							/> */}

							<Text style={styles.titleText}>{item.title}</Text>
							<Text style={styles.contentText}>{item.text}</Text>

							{renderDots()}

							<TouchableOpacity
								onPress={
									currentIndex === data.length - 1 ?
										() => navigation.navigate("MainTabs", { screen: "Home" })
									:	scrollToNextItem
								}
								style={styles.nextButton}
							>
								<Text style={styles.nextButtonText}>
									{currentIndex === data.length - 1 ? "EMPEZAR" : "SIGUIENTE"}
								</Text>
							</TouchableOpacity>
						</View>
					);
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
	},
	nextButton: {
		width: "95%",
		borderRadius: 30,
		backgroundColor: globalStyles.colors.primary,
		marginBlock: 30,
	},
	nextButtonText: {
		color: "white",
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.medium,
		textAlign: "center",
		paddingBlock: 15,
	},
	image: {
		width: "80%",
		height: 400,
	},
	itemContainer: {
		width: width,
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
	},
	skipIntroButton: {
		alignSelf: "flex-start",
		marginTop: 15,
	},
	skipIntroButtonText: {
		color: globalStyles.colors.primary,
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.medium,
	},
	titleText: {
		fontFamily: "RubikBold",
		fontSize: globalStyles.fSizes.large,
		textAlign: "center",
		width: "85%",
	},
	contentText: {
		fontFamily: "RubikMedium",
		fontSize: globalStyles.fSizes.medium,
		textAlign: "center",
		width: "75%",
	},
	dotContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 20,
	},
	dot: {
		height: 10,
		width: 10,
		borderRadius: 5,
		backgroundColor: "#E0E0E0",
		marginHorizontal: 5,
	},
	activeDot: {
		backgroundColor: globalStyles.colors.primary,
		width: 25,
	},
});
