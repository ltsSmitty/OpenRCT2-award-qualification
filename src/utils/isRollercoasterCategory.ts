import { RideType } from "./RideType";

type RideCategory = "Rollercoaster" | "Transport" | "Gentle" | "Thrill" | "Water" | "Shop" | "None";

const rollercoasterRides = [
	0, 1, 2, 3, 4, 7, 9, 13, 15, 17, 19, 42, 44, 51, 52, 53, 55, 56, 57, 58, 59, 62, 64, 65, 66, 68,
	73, 74, 75, 76, 86, 87, 90, 91, 92, 94, 95, 96, 97, 98,
];

export const getRideCategory = (rideId: RideType): RideCategory => {
	if (rollercoasterRides.indexOf(rideId) !== -1) {
		return "Rollercoaster";
	}
	throw new Error("getRideCategory only implemented for roller coasters.");
};
