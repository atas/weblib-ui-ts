/**
 * Generates random alpha-numeric mixed-case string with given length
 * @returns random string by given length
 */
export function randomString(length: number): string {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	for (let i = length; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

export function shortenString(str: string | null | undefined, maxLength: number): string | null | undefined {
	if (!str) return str;

	if (str.length > maxLength) {
		return str.substr(0, maxLength - 3) + '...';
	}
	return str;
}


// Overload signatures:
export function intOrDefault(strValue: string | null | undefined, defaultValue: number): number;
export function intOrDefault(strValue: string | null | undefined, defaultValue?: undefined): number | undefined;
export function intOrDefault<T extends number | undefined>(strValue: string | null | undefined, defaultValue?: T): T;

/**
 * Parses given string to int or returns default value
 * @param strValue string to parse
 * @param defaultValue default value to return if parsing fails
 * @returns parsed int or default value
 */
export function intOrDefault<T extends number | undefined>(strValue: string | null | undefined, defaultValue?: T): T | number | undefined {
	if (!strValue || strValue == null || strValue == '' || strValue?.trim() == '') return defaultValue ;

	const intVal = parseInt(strValue);

	return isNaN(intVal) ? defaultValue : intVal;
}

export function prettyNumberCount(no: number) {
	if (no >= 1000000000) {
		return Math.floor(no / 1000000000) + 'B';
	}

	if (no >= 1000000) {
		return Math.floor(no / 1000000) + 'M';
	}

	if (no >= 1000) {
		return Math.floor(no / 1000) + 'K';
	}

	return no.toString();
}

/**
 * Prepends 0 to single digit numbers
 * @param num
 */
export function zeropad(num: number | string) {
	return ('0' + num).slice(-2);
}
