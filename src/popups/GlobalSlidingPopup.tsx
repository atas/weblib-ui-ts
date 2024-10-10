import * as React from 'react';
import { IPopupActions } from './IPopupActions';
import { SlidingPopupProps } from './SlidingPopup';

let _popupActions: IPopupActions;
let SlidingPopup: React.FC<SlidingPopupProps>;

export interface GlobalSlidingPopupProps {
	isOpen?: boolean;
	title?: string;
	children?: () => React.ReactNode;
	disableClosing?: boolean;
}

/**
 * Global Sliding Popup is outputted at the top of the DOM
 * @param props
 * @constructor
 */
export function GlobalSlidingPopupBase(props: GlobalSlidingPopupProps) {
	return (
		<SlidingPopup
			title={props.title || ''}
			onPopupClosed={() => _popupActions.slidingPopup({ isOpen: false })}
			disableClosing={props.disableClosing}
			isOpen={!!props.isOpen}>
			{props.children || (() => <></>)}
		</SlidingPopup>
	);
}

export function initGlobalSlidingPopup(
	popupActions: IPopupActions,
	slidingPopupFn: () => React.FC<SlidingPopupProps>,
) {
	_popupActions = popupActions;
	SlidingPopup = slidingPopupFn();
	return GlobalSlidingPopupBase;
}
