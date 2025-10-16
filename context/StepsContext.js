import { createContext, useState } from "react";
export const StepsContext = createContext();

export function StepsProvider({ children }) {
	const [steps, setSteps] = useState(0);

	return (
		<StepsContext.Provider
			value={{
				steps,
				setSteps,
			}}
		>
			{children}
		</StepsContext.Provider>
	);
}
