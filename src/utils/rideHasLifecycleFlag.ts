export const rideHasLifeCycleFlag = (ride: Ride, flag: number) => {
	return (ride.lifecycleFlags & (1 << flag)) !== 0;
};
