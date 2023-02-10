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

export const geometryToGeoJson = (featureType: string, geometryObject: any) => {
	let geojson = {
		featureType: featureType,
		geometry: {
			type: geometryObject.type,
			crs: geometryObject.crs,
			coordinates: geometryObject.coordinates
		}
	};
	return geojson;
};
