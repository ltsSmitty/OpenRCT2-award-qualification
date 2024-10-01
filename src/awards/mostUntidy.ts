/**
 * TODO I'm unsure if I'm only checking for guests in park.
 * */

/**
 * Most Untidy Award
 * Found in Award.cpp
 *
 * Loop through the peeps in the park with thought freshness <=5
 * If the peep has thought of BadLitter, PathDisgusting, or Vandalism, increment the count
 * If the total count > numGuestsInPark/16, they qualify
 *
 * Should be false if they have MostBeautiful, BestStaff, or MostTidy awards, but don't have access to those in the api at this time.
 */

import { getRideCategory } from "../utils/isRollercoasterCategory";
import { rideHasLifeCycleFlag } from "../utils/rideHasLifecycleFlag";

const untidyThoughts: ThoughtType[] = ["bad_litter", "path_disgusting", "vandalism"];

const tidyThoughts: ThoughtType[] = ["very_clean"];

const doesGuestHaveThought = (guest: Guest, thoughtTypes: ThoughtType[]) => {
	return guest.thoughts.some((thought) => thoughtTypes.indexOf(thought.type) !== -1);
};

const deserveMostUntidy = () => {
	const guests = map.getAllEntities("guest");

	let count = 0;
	guests.forEach((guest) => {
		if (guest.thoughts.some((thought) => thought.freshness > 5)) {
			return;
		}
		if (doesGuestHaveThought(guest, untidyThoughts)) {
			count++;
		}
	});

	return count > park.guests / 16;
};

/**
 * Most Tidy Award
 * Found in Award.cpp
 *
 * More than 1/64 of the total guests must be thinking tidy thoughts and less than 6 guests thinking untidy thoughts.
 *
 * Should be false if they have MostUntidy or MostDisappointing awards, but don't have access to those in the api at this time.
 */
const deserveMostTidy = () => {
	let positiveCount = 0,
		negativeCount = 0;

	const guests = map.getAllEntities("guest");
	guests.forEach((guest) => {
		if (guest.thoughts.some((thought) => thought.freshness > 5)) {
			return;
		}
		if (doesGuestHaveThought(guest, untidyThoughts)) {
			negativeCount++;
		}
		if (doesGuestHaveThought(guest, tidyThoughts)) {
			positiveCount++;
		}
	});

	return negativeCount < 6 && positiveCount > park.guests / 64;
};

/**
 * Best Rollercoaster Award
 * Found in Award.cpp
 *
 * At least 6 open roller coasters that have never crashed.
 */
const deserveBestRollerCoasters = () => {
	const rides = map.rides.filter((ride) => ride.classification);
	let count = 0;
	rides.forEach((ride) => {
		if (getRideCategory(ride.type) === "Rollercoaster" && rideHasLifeCycleFlag(ride, 10)) {
			count++;
		}
	});

	return count >= 6;
};

/**
 * Best Value Award
 * Found in Award.cpp
 *
 * Entrance fee is at least 0.10 less than half of the total ride value.
 *
 * Should be false if they have WorstValue or MostDisappointing awards, but don't have access to those in the api at this time.
 * */
const deserveBestValuePark = () => {
	if (park.getFlag("freeParkEntry") || park.getFlag("noMoney")) {
		return false;
	}
	if (park.totalRideValueForMoney < 10) {
		return false;
	}
	if (park.entranceFee + 0.1 < park.totalRideValueForMoney / 2) {
		return false;
	}
	return true;
};

/**
 * Most Beautiful Park Award
 * Found in Award.cpp
 *
 * More than 1/128 of the total guests must be thinking scenic thoughts and fewer than 16 untidy thoughts.
 *
 * Should be false if they have MostUntidy or MostDisappointing awards, but don't have access to those in the api at this time.
 */
const deserveMostBeautiful = () => {
	let positiveCount = 0,
		negativeCount = 0;

	const guests = map.getAllEntities("guest");
	guests.forEach((guest) => {
		if (guest.thoughts.some((thought) => thought.freshness > 5)) {
			return;
		}
		if (doesGuestHaveThought(guest, untidyThoughts)) {
			negativeCount++;
		}
		if (doesGuestHaveThought(guest, ["scenery"])) {
			positiveCount++;
		}
	});

	return negativeCount <= 15 && positiveCount > park.guests / 128;
};

/**
 * Worst Park Value Award
 * Found in Award.cpp
 *
 * Entrance fee is more than total ride value.
 *
 * Should be false if they have BestValue award, but don't have access to those in the api at this time.
 */
const deserveWorstValue = () => {
	if (park.entranceFee == 0 || park.getFlag("noMoney")) {
		return false;
	}
	if (park.entranceFee <= park.totalRideValueForMoney) {
		return false;
	}
	return true;
};

/**
 * Safest Park Award
 * Found in Award.cpp
 *
 * No more than 2 people who think the vandalism is bad and no crashes.
 * */
const deserveSafestPark = () => {
	let guestsWhoDislikeVandalist = 0;
	map.getAllEntities("guest").forEach((guest) => {
		if (guest.thoughts.some((thought) => thought.freshness > 5)) {
			return;
		}
		if (doesGuestHaveThought(guest, ["vandalism"])) {
			guestsWhoDislikeVandalist++;
		}
	});

	if (guestsWhoDislikeVandalist > 2) {
		return false;
	}

	const ridesHaveCrashed = map.rides.some((ride) => {
		return ride.classification === "ride" && rideHasLifeCycleFlag(ride, 10);
	});

	return !ridesHaveCrashed;
};
