import * as React from 'react';

export interface DomTreeGlobalPopupBaseProps {
	componentFn?: () => React.ReactElement | null;
}

/**
 * These components need to be added onto the dom tree.
 * @param props
 * @constructor
 */
export function DomTreeGlobalPopupBase(props: DomTreeGlobalPopupBaseProps) {
	return props.componentFn ? props.componentFn() : null;
}
