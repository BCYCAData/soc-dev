/**
 * Extract permissions from an array of permissions objects,
 * and organize them by the prefix of the permission.
 *
 * @param permissions Array of permission objects,
 *    where each permission object has a `permission` property.
 *
 * @returns An object with the permissions organized by prefix,
 *    where each prefix is a key with an array of actions as its value.
 */
export function getPermissionsData(permissions: any[]): {
	[prefix: string]: string[] | null;
} {
	const result = permissions.reduce(
		(acc, { permission }) => {
			if (permission) {
				const [prefix, action] = permission.split('.');
				if (!acc[prefix]) {
					acc[prefix] = [];
				}
				acc[prefix].push(action);
			}
			return acc;
		},
		{} as { [prefix: string]: string[] | null }
	);
	return result;
}
// Define the structure of the original data item
type CommunityRequestOption = {
	index_value: number;
	lable: string;
	community_request_options_concordance: {
		table_name: string;
		object_name: string;
		field_name: string;
	} | null;
};

// Define the structure of the grouped data by table_name
type GroupedDataByTable = {
	[tableName: string]: {
		[objectName: string]: CommunityRequestOption[];
	};
};

// Define the structure of the output
export type OptionsByTableAndObjectName = {
	tableName: string;
	objectNames: {
		objectName: string;
		options: {
			value: number;
			lable: string;
		}[];
	}[];
};

// Function to group the data by table_name
function groupByTable(data: CommunityRequestOption[]): GroupedDataByTable {
	return data.reduce((acc, item) => {
		const tableName = item.community_request_options_concordance?.table_name;
		const objectName = item.community_request_options_concordance?.object_name;
		if (tableName && objectName) {
			if (!acc[tableName]) {
				acc[tableName] = {};
			}
			if (!acc[tableName][objectName]) {
				acc[tableName][objectName] = [];
			}
			acc[tableName][objectName].push(item);
		}
		return acc;
	}, {} as GroupedDataByTable);
}

// Function to extract options definition array for each table
function extractOptionsByTable(groupedData: GroupedDataByTable): OptionsByTableAndObjectName[] {
	return Object.entries(groupedData).map(([tableName, objectGroups]) => ({
		tableName,
		objectNames: Object.entries(objectGroups).map(([objectName, items]) => ({
			objectName,
			options: items.map((item) => ({
				value: item.index_value,
				lable: item.lable
			}))
		}))
	}));
}

export function getOptionsDataByTable(communityRequestOptionsData: CommunityRequestOption[]) {
	const groupedData = groupByTable(communityRequestOptionsData);
	const optionsByTable: OptionsByTableAndObjectName[] = extractOptionsByTable(groupedData);
	return optionsByTable;
}
