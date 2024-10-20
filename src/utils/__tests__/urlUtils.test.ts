import { convertToSlug, getUrlWithQuery } from '../urlUtils';

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

describe('getUrlWithQuery', () => {
	test('should add query parameters to the URL', () => {
		const url = 'https://example.com';
		const query = { foo: 'bar', baz: 'qux' };
		const result = getUrlWithQuery(url, query);
		expect(result).toBe('https://example.com/?baz=qux&foo=bar');
	});

	test('should add query parameters to the URL', () => {
		const url = '/';
		const query = { foo: 'bar', baz: 'qux' };
		const result = getUrlWithQuery(url, query);
		expect(result).toBe('/?baz=qux&foo=bar');
	});

	test('should overwrite existing query parameters', () => {
		const url = '';
		const query = { foo: 'new', baz: 'qux' };
		const result = getUrlWithQuery(url, query);
		expect(result).toBe('/?baz=qux&foo=new');
	});

	test('should handle empty query object', () => {
		const url = 'https://example.com';
		const query = {};
		const result = getUrlWithQuery(url, query);
		expect(result).toBe('https://example.com/');
	});

	test('should handle URL with existing query parameters', () => {
		const url = '/';
		const query = { foo: 'bar' };
		const result = getUrlWithQuery(url, query);
		expect(result).toBe('/?foo=bar');
	});
	
	test('should ignore nulls', () => {
		const url = '/';
		const query = { 'foo': null, 'bar': undefined };
		const result = getUrlWithQuery(url, query);
		expect(result).toBe('/');
	});
});