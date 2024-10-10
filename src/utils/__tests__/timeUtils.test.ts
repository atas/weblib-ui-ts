import { humanDurationToSeconds, secondsToHumanDuration } from '../timeUtils';

describe('humanDurationToSeconds', () => {
	test('converts "5:10" with includesSeconds=true to 310', () => {
		expect(humanDurationToSeconds('5:10', true)).toBe(310);
	});

	test('converts "5:10.5" with includesSeconds=true to 310.5', () => {
		expect(humanDurationToSeconds('5:10.5', true)).toBe(310.5);
	});

	test('converts "2:05" with includesSeconds=true to 165', () => {
		expect(humanDurationToSeconds('2:05', true)).toBe(125);
	});

	test('converts "2:5" with includesSeconds=true to 165', () => {
		expect(humanDurationToSeconds('2:5', true)).toBe(125);
	});

	test('converts "1:30:15.75" with includesSeconds=true to 5415.75', () => {
		expect(humanDurationToSeconds('1:30:15.75', true)).toBe(5415.75);
	});

	test('converts "1:02:30.25" with includesSeconds=true to 3750.25', () => {
		expect(humanDurationToSeconds('1:02:30.25', true)).toBe(3750.25);
	});

	test('converts "0:00:30.5" with includesSeconds=true to 30.5', () => {
		expect(humanDurationToSeconds('0:00:30.5', true)).toBe(30.5);
	});

	test('converts "0:01:30" with includesSeconds=true to 90', () => {
		expect(humanDurationToSeconds('0:01:30', true)).toBe(90);
	});

	test('handles empty string input gracefully', () => {
		expect(humanDurationToSeconds('')).toBe(null);
	});

	test('handles single component input with includesSeconds=true', () => {
		expect(humanDurationToSeconds('45', true)).toBe(45);
	});

	test('handles single component input with includesSeconds=false', () => {
		expect(humanDurationToSeconds('45', false)).toBe(2700); // 45 minutes * 60 seconds
	});
});

describe('secondsToHumanDuration', () => {
	test('converts seconds to HH:MM:SS format', () => {
		expect(secondsToHumanDuration(3661)).toBe('1:01:01');
		expect(secondsToHumanDuration(3661.5)).toBe('1:01:01.5');
		expect(secondsToHumanDuration(3600)).toBe('1:00:00');
		expect(secondsToHumanDuration(59.3)).toBe('59.3');
		expect(secondsToHumanDuration(61)).toBe('1:01');
	});

	test('handles leading zero removal', () => {
		expect(secondsToHumanDuration(61, true)).toBe('1:01');
		expect(secondsToHumanDuration(3599, true)).toBe('59:59');
		expect(secondsToHumanDuration(3601, true)).toBe('1:00:01');
	});

	test('handles edge cases', () => {
		expect(secondsToHumanDuration(null)).toBe('');
		expect(secondsToHumanDuration()).toBe('');
		expect(secondsToHumanDuration(undefined)).toBe('');
		expect(secondsToHumanDuration(0)).toBe('0');
		expect(secondsToHumanDuration(1)).toBe('1');
		expect(secondsToHumanDuration(60)).toBe('1:00');
		expect(secondsToHumanDuration(3601)).toBe('1:00:01');
	});

	test('handles large numbers', () => {
		expect(secondsToHumanDuration(86400)).toBe('24:00:00');
		expect(secondsToHumanDuration(90061)).toBe('25:01:01');
		expect(secondsToHumanDuration(90061.1)).toBe('25:01:01.1');
	});
});
