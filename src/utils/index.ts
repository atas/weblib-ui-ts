export * from './initHttpClient';
export { default as LocalStorageVar } from './LocalStorageVar';
export * from './mobileUtils';
export * from './object';
export { default as PhotoUtilsBase } from './PhotoUtilsBase';
export * from './string';
export * from './timeUtils';
export * from './urlUtils';
export { default as setViewportHeight } from './setViewportHeight';
export * from './geolocationUtils';

import * as string from './string';
import * as url from './urlUtils';
import * as detectBrowser from './detectBrowser';
import * as ratingUtils from './ratingUtils';

// export { default as entity } from './dto';
export { url, string, detectBrowser, ratingUtils };
