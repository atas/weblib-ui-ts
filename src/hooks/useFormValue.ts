import { useState } from 'react';

type useFormValueType = <T = string>(
	initial?: T,
	onChangeSelector?: (v: any) => T,
) => { value: T; onChange: (value: any) => void };
/**
 * Allows to use a stateful value with onChange handler to quickly spread over input elements like <input {...username} />
 * Example usage:
 * const loginCode = useFormValue('');
 * ...
 * <input type="text" placeholder=" " {...loginCode} />
 * @param initial
 * @param s
 */
export const useFormValue: useFormValueType = function <T>(
	initial: T = '' as T,
	s = (e: { target: { value: T } }) => e.target.value,
) {
	const [value, setValue] = useState(initial);

	return {
		value: value,
		onChange: (value: any) => setValue(s(value)),
	};
};
