import {
	getPersonalProfileHelpContent,
	getAdminHelpContent,
	getKYNGCoordinatorHelpContent
} from '$lib/help/utility';

export async function loadHelpContent(path: string) {
	if (path.startsWith('personal-profile')) {
		return getPersonalProfileHelpContent(path);
	} else if (path.startsWith('admin')) {
		return getAdminHelpContent(path);
	} else if (path.startsWith('kyng-coordinator')) {
		console.log('path', path);
		return getKYNGCoordinatorHelpContent(path);
	}
	return { hasHelp: false };
}

export const toTitleCase = (text: string) => {
	return text
		.toLowerCase()
		.split(' ')
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
};

export const checkStreetAddressString = (streetaddress: string) => {
	let streetRegEx =
		/^\d+[a-zA-Z]?\s*\w+(\s+\w+)*\s+\w+(\s+\w+)*\s+(ALLEY|ARCADE|AVENUE|BOULEVARD|BYPASS|CIRCUIT|CLOSE|CORNER|COURT|CRESCENT|CUL-DE-SAC|DRIVE|ESPLANADE|GREEN|GROVE|HIGHWAY|JUNCTION|LANE|LINK|LMEWS|PARADE|PLACE|RIDGE|ROAD|SQUARE|STREET|TERRACE|WAY|)$/;
	return streetRegEx.test(String(streetaddress).toUpperCase());
};

export const checkSuburbString = (suburb: string) => {
	let suburbRegex = /^(?:(?!NSW|NEW\sSOUTH\sWALES)[A-Z\s])+$/;
	return suburbRegex.test(String(suburb).toUpperCase());
};

export function setUpperCase(node: HTMLInputElement) {
	function handleInput(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value.toUpperCase();
		node.value = inputValue;
	}

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
}

export const formatMobile = (mobileNumber: string, digit: string) => {
	mobileNumber += digit;
	if (mobileNumber.length == 4) {
		mobileNumber += ' ';
	}
	if (mobileNumber.length == 8) {
		mobileNumber += ' ';
	}
	return mobileNumber;
};

export const formatPhone = (phoneNumber: string, digit: string) => {
	phoneNumber += digit;
	if (phoneNumber.length == 4) {
		phoneNumber += ' ';
	}
	return phoneNumber;
};

export const getTimestamp = () => {
	const now: Date = new Date();
	const year: number = now.getFullYear();
	const month: number = now.getMonth() + 1;
	const day: number = now.getDate();
	const hours: number = now.getHours();
	const minutes: number = now.getMinutes();

	const formattedMonth = month < 10 ? `0${month}` : `${month}`;
	const formattedDay = day < 10 ? `0${day}` : `${day}`;
	const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

	return `${year}${formattedMonth}${formattedDay}-${formattedHours}${formattedMinutes}`;
};
