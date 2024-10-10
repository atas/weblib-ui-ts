/**
 * Overwrites the types in T1 with T2
 */
export type Overwrite<T1, T2> = {
	[P in Exclude<keyof T1, keyof T2>]: T1[P];
} & T2;

/**
 * Make one property partial of a type
 *
 * @example
 * PartialBy<Person, 'nickname'>
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


/**
 * Exclude properties of K from T
 */
export type Subtract<T extends K, K> = Omit<T, keyof K>;