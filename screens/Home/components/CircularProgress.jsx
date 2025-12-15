import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

const CircularProgress = ({
	percentage,
	radius = 70,
	strokeWidth = 12,
	color = "#80B349",
	textColor = "#80B349",
}) => {
	const circumference = 2 * Math.PI * radius;
	const progressOffset = circumference - (percentage / 100) * circumference;

	// Fórmula para grados: (porcentaje / 100) * 360
	const rotation = -90; // Para empezar desde arriba (las 12)

	return (
		<Svg height={radius * 2} width={radius * 2} viewBox={`-6 -6 155 155`}>
			{/* Círculo de fondo (base) */}
			<Circle
				cx={radius}
				cy={radius}
				r={radius}
				fill="none"
				stroke="#8eddfc5f" // Color del fondo del círculo
				strokeWidth={strokeWidth}
			/>

			{/* Círculo de progreso */}
			<G rotation={rotation} origin={`${radius}, ${radius}`}>
				<Circle
					cx={radius}
					cy={radius}
					r={radius}
					fill="none"
					stroke={color}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={progressOffset}
					strokeLinecap="round" // Bordes redondeados para el progreso
				/>
			</G>

			{/* Texto del porcentaje */}
			<SvgText
				x={radius}
				y={radius - 7}
				fontSize="35"
				fontWeight="bold"
				fill={textColor}
				textAnchor="middle"
				alignmentBaseline="middle"
			>
				{`${percentage}%`}
			</SvgText>
			<SvgText
				x={radius}
				y={radius + strokeWidth / 0.7}
				fontSize="14"
				fontWeight="bold"
				fill={"black"}
				textAnchor="middle"
				alignmentBaseline="middle"
			>
				Caminata diaria
			</SvgText>
		</Svg>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default CircularProgress;
