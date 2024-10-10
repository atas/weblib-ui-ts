module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest', // Use babel-jest to transform JS/TS files
	},
	transformIgnorePatterns: [
		'/node_modules/(?!query-string|decode-uri-component|split-on-first|filter-obj)', // Include query-string and decode-uri-component in transformation
	],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy', // For mocking style imports if necessary
	},
};
