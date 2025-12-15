import * as Font from "expo-font";

export async function loadFonts() {
	await Font.loadAsync({
		RubikMedium: require("../assets/fonts/Rubik-Medium.ttf"),
		RubikBold: require("../assets/fonts/Rubik-Bold.ttf"),

		KarlaSemiBold: require("../assets/fonts/Karla-SemiBold.ttf"),
		KarlaBold: require("../assets/fonts/Karla-Bold.ttf"),
		KarlaExtraBold: require("../assets/fonts/Karla-ExtraBold.ttf"),
	});
}
