/**
 * Returns x time ago style dates
 * @param timestamp UTC timestamp
 * @returns
 */
import { zeropad } from './string';

export function prettyDate(timestamp: number) {
	const diff = new Date().getTime() - timestamp * 1000;
	let relativeDiff = Math.ceil(diff / 1000 / 60);

	if (relativeDiff < 60) return Math.ceil(relativeDiff) + 'm';

	relativeDiff /= 60;
	if (relativeDiff < 24) return Math.ceil(relativeDiff) + 'h';

	relativeDiff /= 24;
	if (relativeDiff < 30) return Math.ceil(relativeDiff) + 'd';

	relativeDiff /= 30;
	if (relativeDiff < 30) return Math.ceil(relativeDiff) + 'mo';

	relativeDiff /= 12;
	return Math.ceil(relativeDiff) + 'y';
}

export function secondsToPrettyDuration(secs: number) {
	secs = Math.round(secs);
	if (secs < 60) {
		return `${secs}sec`;
	}

	const hours = Math.floor(secs / (60 * 60));
	const divisor_for_minutes = secs % (60 * 60);
	const minutes = Math.floor(divisor_for_minutes / 60);
	const divisor_for_seconds = divisor_for_minutes % 60;
	const seconds = Math.ceil(divisor_for_seconds);

	let sb = '';
	if (hours > 0) sb += `${hours}hr`;
	if (minutes > 0) sb += (sb.length > 0 ? ':' : '') + `${minutes}min`;

	return sb;
}

export function secondsToHumanDuration(secs?: number | null, removeLeadingZero = false) {
	if (!Number.isFinite(secs) || secs === undefined || secs === null) return '';

	const totalSeconds = Math.floor(secs);
	const fractionalPart = secs - totalSeconds;
	const milliseconds = Math.round(fractionalPart * 10) / 10; // Keep only one significant digit

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const hoursStr = hours > 0 ? `${hours}` : '';
	const minutesStr = minutes > 9 ? `${minutes}` : `0${minutes}`;
	const secondsStr = seconds > 9 ? `${seconds}` : `0${seconds}`;
	const millisecondsStr = milliseconds > 0 ? `.${Math.round(fractionalPart * 10)}` : '';

	let result = '';
	if (hours > 0) {
		result = `${hoursStr}:${minutesStr}:${secondsStr}${millisecondsStr}`;
	} else if (minutes > 0) {
		result = `${minutes}:${secondsStr}${millisecondsStr}`;
	} else {
		result = `${seconds}${millisecondsStr}`;
	}

	if (removeLeadingZero && result.startsWith('0')) {
		result = result.substring(1);
	}

	return result;
}

export function humanDurationToSeconds(humanDuration?: string | null, includesSeconds = true) {
	if (!humanDuration || humanDuration.trim() == '') return null;

	const vals = (humanDuration || '').trim().split(':');

	let secs = 0;
	let multiplier = includesSeconds ? 0 : 1; // Start with seconds if includesSeconds, otherwise start with minutes

	for (let i = vals.length - 1; i >= 0; i--) {
		if (i === vals.length - 1 && includesSeconds) {
			// Use parseFloat for the seconds component to handle fractions
			secs += parseFloat(vals[i]) * Math.pow(60, multiplier++);
		} else {
			secs += parseInt(vals[i], 10) * Math.pow(60, multiplier++);
		}
	}
	return secs;
}

export function prettySeconds(seconds: number) {
	seconds = Math.floor(seconds);
	const mins = Math.floor(seconds / 60).toString();
	const secs = (seconds % 60).toString();

	return `${zeropad(mins)}:${zeropad(secs)}`;
}
