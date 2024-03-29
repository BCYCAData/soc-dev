import type {
	UserProfile,
	UserPostalAddressData,
	CommunityMondrookProfileData,
	CommunityExternalProfileData,
	CommunityTinoneeProfileData,
	CommunityBCYCAProfileData,
	PropertyProfileData,
	PropertyAgentData,
	ProfileAboutMeFormData
} from '$lib/custom.types';

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

export const splitStreetAddress = (streetAddress: string) => {
	const bits = streetAddress.split(' ');
	const result = [bits[0], streetAddress.replace(bits[0], '').trim()];
	return result;
};

export const splitFullAddress = (fullAddress: string) => {
	const bits = fullAddress.split(' ');
	const more = bits[bits.length - 1];
	const result = [bits[0], fullAddress.replace(bits[0], '').replace(more, '').trim(), more];
	return result;
};

export const toTitleCase = (text: string) => {
	return text
		.toLowerCase()
		.split(' ')
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
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

export const checkStreetAddressString = (streetaddress: string) => {
	let streetRegEx =
		/^\d+[a-zA-Z]?\s*\w+(\s+\w+)*\s+\w+(\s+\w+)*\s+(ALLEY|ARCADE|AVENUE|BOULEVARD|BYPASS|CIRCUIT|CLOSE|CORNER|COURT|CRESCENT|CUL-DE-SAC|DRIVE|ESPLANADE|GREEN|GROVE|HIGHWAY|JUNCTION|LANE|LINK|LMEWS|PARADE|PLACE|RIDGE|ROAD|SQUARE|STREET|TERRACE|WAY|)$/;
	return streetRegEx.test(String(streetaddress).toUpperCase());
};

export const checkSuburbString = (suburb: string) => {
	let suburbRegex = /^(?:(?!NSW|NEW\sSOUTH\sWALES)[A-Z\s])+$/;
	return suburbRegex.test(String(suburb).toUpperCase());
};
export const geometryToGeoJson = (featureType: string, geometryObject: any) => {
	const geojson = {
		featureType: featureType,
		geometry: {
			type: geometryObject.type,
			crs: geometryObject.crs,
			coordinates: geometryObject.coordinates
		}
	};
	return geojson;
};

declare const PUBLIC_VITE_SITE_URL: string | undefined;
declare const PUBLIC_VITE_VERCEL_URL: string | undefined;

export const getURL = () => {
	let url =
		PUBLIC_VITE_SITE_URL ?? // Set this to your site URL in production env.
		PUBLIC_VITE_VERCEL_URL ?? // Automatically set by Vercel.
		'http://127.0.0.1:5173/';
	// Make sure to include `https://` when not localhost.
	url = url.includes('http') ? url : `https://${url}`;
	// Make sure to include a trailing `/`.
	url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
	return url;
};
