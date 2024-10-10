import { convertToSlug } from '../urlUtils';

describe('convertToSlug', () => {
	test('should return null for null input', () => {
		expect(convertToSlug(null)).toBeNull();
	});

	test('should return empty string for empty input', () => {
		expect(convertToSlug('')).toBe(null);
	});

	test('should convert spaces to hyphens', () => {
		expect(convertToSlug('hello world')).toBe('hello-world');
	});

	test('should remove special characters', () => {
		expect(convertToSlug('hello@world!')).toBe('helloworld');
	});

	test('should convert to lowercase', () => {
		expect(convertToSlug('HelloWorld')).toBe('helloworld');
	});

	test('should handle mixed cases and special characters', () => {
		expect(convertToSlug('Hello World! 123')).toBe('hello-world-123');
	});

	test('should handle spaces around', () => {
		expect(convertToSlug(' Hello World! 123 ')).toBe('hello-world-123');
	});
});
