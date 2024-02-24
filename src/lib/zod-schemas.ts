import { z } from 'zod';

export const testSchema = z.object({
	name: z.string().default('Hello world!'),
	email: z.string().email()
});

export const addressUnChallengedSchema = z.object({
	streetaddress: z
		.string()
		.regex(
			/^\d+[a-zA-Z]?\s*\w+(\s+\w+)*\s+\w+(\s+\w+)*\s+(ALLEY|ARCADE|AVENUE|BOULEVARD|BYPASS|CIRCUIT|CLOSE|CORNER|COURT|CRESCENT|CUL-DE-SAC|DRIVE|ESPLANADE|GREEN|GROVE|HIGHWAY|JUNCTION|LANE|LINK|LMEWS|PARADE|PLACE|RIDGE|ROAD|SQUARE|STREET|TERRACE|WAY|)$/,
			'Address must have a number and abbreviations are not allowed.'
		)
		.refine((value) => value === value.toUpperCase(), 'Must be all upper case.')
		.transform((value) => value.trim()),
	suburb: z
		.string()
		.regex(/^(?:(?!NSW|NEW\sSOUTH\sWALES)[A-Z\s])+$/, {
			message: 'Do not include Postcode or State.'
		})
		.refine((value) => value === value.toUpperCase(), 'Must be all upper case.')
		.transform((value) => value.trim())
});

export type TestSchema = typeof testSchema;
export type AddressUnChallengedSchema = typeof addressUnChallengedSchema;
