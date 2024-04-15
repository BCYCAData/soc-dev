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
