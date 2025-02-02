import type { TransformedOptionsData } from '$lib/types';

export const accessOptions = [
	{ value: 1, lable: 'All gates are more than 2.5 metres wide' },
	{ value: 4, lable: 'Other' },
	{ value: 2, lable: 'Most gates are more than 2.5 metres wide' },
	{ value: 3, lable: 'No' }
];

export const residencyOptions = [
	{ value: 1, lable: 'Resident at the property fulltime ' },
	{ value: 2, lable: 'Present large proportion of time' },
	{ value: 3, lable: 'Occasional short periods away' },
	{ value: 4, lable: 'At the property at least every month' },
	{ value: 5, lable: 'At the property occasionally' },
	{ value: 6, lable: 'Resident fulltime with long absences' },
	{ value: 7, lable: 'Not very often at the property' }
];
export const yesNoOptions = [
	{ value: true, lable: 'Yes' },
	{ value: false, lable: 'No' }
];

export const yesNoMaybeOptions = [
	{ value: 'Y', lable: 'Yes' },
	{ value: 'N', lable: 'No' },
	{ value: 'M', lable: 'Maybe' }
];
export const fireFightingResourceOptions = [
	{ value: 1, lable: 'Fire trailer' },
	{ value: 2, lable: 'Fire fighting pump' },
	{ value: 3, lable: 'Fire hose' },
	{ value: 4, lable: 'Trailer with spray equipment' },
	{ value: 5, lable: 'Generator' }
];
export const staticWaterOptions = [
	{ value: 1, lable: 'Tank' },
	{ value: 2, lable: 'Swimming Pool' },
	{ value: 3, lable: 'Dam' },
	{ value: 4, lable: 'Creek' },
	{ value: 5, lable: 'None' }
];

export const siteHazardsOptions = [
	{ value: 1, lable: 'Solar batteries' },
	{ value: 2, lable: 'Fuel stores' },
	{ value: 3, lable: 'Chemical stores' },
	{ value: 4, lable: 'Bottled gas' }
];
export const fireHazardReductionOptions = [
	{ value: 1, lable: 'Fire breaks' },
	{ value: 2, lable: 'Slashed areas around house/sheds' },
	{ value: 3, lable: 'A backup pump (petrol or diesel)' },
	{ value: 4, lable: 'Driveway 3.5m overhead clearance ' },
	{ value: 5, lable: 'Truck access around your property ' }
];
export const fireFightingExperienceOptions = [
	{ value: 1, lable: 'No experience' },
	{ value: 2, lable: 'Some experience with small fires' },
	{ value: 3, lable: 'In training RFS (relatively new)' },
	{ value: 4, lable: 'Experienced firefighting' }
];
export const yesNoSendOptions = [
	{ value: 'Y', lable: 'Yes' },
	{ value: 'N', lable: 'No' }
];

export const stayGoOptions = [
	{ value: 1, lable: 'Planning on staying' },
	{ value: 2, lable: 'Leaving as early as possible' },
	{ value: 3, lable: 'Unsure depending on severity' }
];

export type CommunityRequestOption = {
	index_value: number;
	lable: string;
	community_request_options_concordance: {
		table_name: string;
		object_name: string;
		field_name: string;
	};
};

export function getCommunityOptions(data: CommunityRequestOption[]): TransformedOptionsData[] {
	const result: TransformedOptionsData[] = [];

	// Group by table_name
	const groupedByTable = data.reduce(
		(acc, item) => {
			const { table_name, object_name } = item.community_request_options_concordance;
			if (!acc[table_name]) {
				acc[table_name] = [];
			}
			acc[table_name].push({
				object_name,
				options: {
					value: item.index_value.toString(), // Using index_value as value
					lable: item.lable
				}
			});
			return acc;
		},
		{} as Record<string, { object_name: string; options: { value: string; lable: string } }[]>
	);

	// Transform into the desired structure
	Object.entries(groupedByTable).forEach(([table_name, object_names]) => {
		const groupedObjectNames: {
			object_name: string;
			options: { value: string; lable: string }[];
		}[] = [];
		object_names.forEach(({ object_name, options }) => {
			const existing = groupedObjectNames.find((o) => o.object_name === object_name);
			if (existing) {
				existing.options.push(options);
			} else {
				groupedObjectNames.push({
					object_name,
					options: [options]
				});
			}
		});
		result.push({
			table_name,
			object_names: groupedObjectNames
		});
	});

	return result;
}
