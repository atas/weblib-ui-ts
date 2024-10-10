/* eslint-disable no-prototype-builtins */

/**
 *
 * @param obj1 Checks if two objects are equal
 * @param obj2
 * @returns
 */
export function objectEquals(obj1: any, obj2: any) {
	if (!obj1 || !obj2) return false;

	for (const i in obj1) {
		if (obj1.hasOwnProperty(i)) {
			if (!obj2.hasOwnProperty(i)) return false;
			if (obj1[i] != obj2[i]) return false;
		}
	}
	for (const i in obj2) {
		if (obj2.hasOwnProperty(i)) {
			if (!obj1.hasOwnProperty(i)) return false;
			if (obj1[i] != obj2[i]) return false;
		}
	}
	return true;
}

export function arrayToObject<T>(array: T[], keyFn: (elem: T) => string | number) {
	return array.reduce(function (acc, curr) {
		const k = keyFn(curr);
		acc[k] = curr;
		return acc;
	}, {} as { [k: string | number]: T });
}

export const removeKey = (key: string, { [key]: _, ...rest }) => rest;
