import * as React from 'react';
import { Action } from 'redux';
import { PopupsActionType } from './PopupsActionType';
import { SimpleSnackbarVariant } from './SimpleSnackbar';
import { GlobalAlertPopupProps } from './GlobalAlertPopupBase';
import { FullScreenPopupProps } from './FullScreenPopup';
import { GlobalSlidingPopupProps } from './GlobalSlidingPopup';

export interface PopupsState {
	snackbarMsg?: string;
	snackbarVariant?: SimpleSnackbarVariant;
	snackbarTimeout?: number;
	globalAlertPopupProps?: GlobalAlertPopupProps;
	fullScreenPopup: FullScreenPopupProps;
	globalSlidingPopupProps?: GlobalSlidingPopupProps;
	globalPopup: {
		componentFn?: () => React.ReactElement | null;
		isOpen: boolean;
	};
}

const initialState: PopupsState = {
	fullScreenPopup: {
		isOpen: false,
	},
	globalPopup: {
		isOpen: false,
	},
};

export function popupsReducer(state = initialState, action: any): PopupsState {
	if (action.type === PopupsActionType.POPUPS_SNACKBAR) {
		const a = action as PopupsSnackbarMsgAction;
		return {
			...state,
			snackbarMsg: a.msg,
			snackbarVariant: a.variant,
			snackbarTimeout: a.timeout,
		};
	}
	if (action.type === PopupsActionType.POPUPS_MSG) {
		const a = action as GlobalAlertPopupAction;
		// TODO implement a new state variable to isOpen/isClose rather than having that in the big config object
		const globalAlertPopupProps = a.globalAlertPopupProps.resetValues
			? a.globalAlertPopupProps
			: { ...state.globalAlertPopupProps, ...a.globalAlertPopupProps };
		return {
			...state,
			globalAlertPopupProps,
		};
	}
	if (action.type === PopupsActionType.POPUPS_FULLSCREEN) {
		const a = action as PopupsFullScreenAction;
		return { ...state, fullScreenPopup: { ...state.fullScreenPopup, ...a.props } };
	}
	if (action.type === PopupsActionType.POPUPS_GLOBAL_SLIDING_POPUP) {
		const a = action as GlobalSlidingPopupAction;
		return {
			...state,
			globalSlidingPopupProps: { ...state.globalSlidingPopupProps, ...a.props },
		};
	}
	if (action.type === PopupsActionType.POPUPS_GLOBAL_POPUP_BASE) {
		const a = action as GlobalPopupBaseAction;
		return { ...state, globalPopup: { ...state.globalPopup, ...a } };
	}
	return state;
}

export interface PopupsSnackbarMsgAction extends Action<PopupsActionType.POPUPS_SNACKBAR> {
	msg?: string;
	variant?: SimpleSnackbarVariant;
	timeout?: number;
}

export interface GlobalAlertPopupAction extends Action<PopupsActionType.POPUPS_MSG> {
	globalAlertPopupProps: Partial<GlobalAlertPopupProps>;
}

export interface PopupsFullScreenAction extends Action<PopupsActionType.POPUPS_FULLSCREEN> {
	props: Partial<FullScreenPopupProps>;
}

export interface GlobalSlidingPopupAction
	extends Action<PopupsActionType.POPUPS_GLOBAL_SLIDING_POPUP> {
	props: Partial<GlobalSlidingPopupProps>;
}

export interface GlobalPopupBaseAction extends Action<PopupsActionType.POPUPS_GLOBAL_POPUP_BASE> {
	isOpen: boolean;
	componentFn?: () => React.ReactElement | null;
}
