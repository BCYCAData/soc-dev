/**
 * Pure, environment-agnostic profile-completion engine.
 *
 * Given the raw `get_profile_for_user` JSON payload and the set of required field
 * keys (from `profile_required_question`), it reports how much of the configured
 * profile a user has answered. No I/O — safe to import on server or client and to
 * unit-test in isolation.
 *
 * Scope rules (matching the "flat list + community scope" decision):
 * - A community-scoped question only counts when the user actually has that
 *   community profile (otherwise it is neither answered nor part of the total).
 * - An `appliesWhenRented` question only counts when the property is rented.
 *
 * @module profile/completion
 */

import {
	PROFILE_FIELD_BY_KEY,
	type ProfileAnswerType,
	type ProfileFieldDefinition
} from './field-catalog';

export interface MissingQuestion {
	key: string;
	label: string;
	section: string;
}

export interface ProfileCompletion {
	/** Number of in-scope required questions. */
	total: number;
	/** How many of those have an answer. */
	answered: number;
	/** 0–100, rounded. 100 when there are no in-scope required questions. */
	percent: number;
	isComplete: boolean;
	missing: MissingQuestion[];
}

type RawProfile = Record<string, unknown> | null | undefined;

/** Walks a `(string|number)[]` path into a nested object/array payload. */
function readPath(root: RawProfile, path: (string | number)[]): unknown {
	let current: unknown = root;
	for (const segment of path) {
		if (current == null) return undefined;
		if (typeof segment === 'number') {
			if (!Array.isArray(current)) return undefined;
			current = current[segment];
		} else {
			if (typeof current !== 'object' || Array.isArray(current)) return undefined;
			current = (current as Record<string, unknown>)[segment];
		}
	}
	return current;
}

/** True when `value` represents a real answer for the given answer type. */
function isAnswered(value: unknown, answerType: ProfileAnswerType): boolean {
	switch (answerType) {
		case 'text':
			return typeof value === 'string' && value.trim().length > 0;
		case 'number':
			return typeof value === 'number' && Number.isFinite(value);
		case 'boolean':
			return typeof value === 'boolean';
		case 'array':
		case 'choices':
			return Array.isArray(value) && value.length > 0;
		default:
			return false;
	}
}

const COMMUNITY_PROFILE_KEY: Record<NonNullable<ProfileFieldDefinition['communityScope']>, string> =
	{
		bcyca: 'community_bcyca_profile',
		tinonee: 'community_tinonee_profile',
		mondrook: 'community_mondrook_profile',
		external: 'community_external_profile'
	};

/** Whether a question is in scope for this particular user's profile. */
function isInScope(profile: RawProfile, field: ProfileFieldDefinition): boolean {
	if (field.communityScope) {
		const communityProfile = readPath(profile, [COMMUNITY_PROFILE_KEY[field.communityScope]]);
		if (communityProfile == null) return false;
	}
	if (field.appliesWhenRented) {
		const rented = readPath(profile, ['property_profile', 0, 'property_rented']);
		if (rented !== true) return false;
	}
	return true;
}

/**
 * Computes completion for a user.
 *
 * @param profile      Raw payload from `get_profile_for_user` (property_profile is an array).
 * @param requiredKeys Field keys marked required in `profile_required_question`.
 */
export function computeProfileCompletion(
	profile: RawProfile,
	requiredKeys: Iterable<string>
): ProfileCompletion {
	const missing: MissingQuestion[] = [];
	let total = 0;
	let answered = 0;

	for (const key of requiredKeys) {
		const field = PROFILE_FIELD_BY_KEY.get(key);
		// Unknown keys (e.g. config left over from a removed field) are ignored.
		if (!field) continue;
		if (!isInScope(profile, field)) continue;

		total += 1;
		if (isAnswered(readPath(profile, field.jsonPath), field.answerType)) {
			answered += 1;
		} else {
			missing.push({ key: field.key, label: field.label, section: field.section });
		}
	}

	const percent = total === 0 ? 100 : Math.round((answered / total) * 100);
	return { total, answered, percent, isComplete: answered === total, missing };
}
