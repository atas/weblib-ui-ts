import * as React from 'react';
import { Action, Store } from 'redux';
import {
	FullScreenPopupProps,
	GlobalAlertPopupProps,
	GlobalSlidingPopupProps,
	PopupsActionType,
	SimpleSnackbarVariant,
} from './';
import { IPopupActions } from './IPopupActions';
import {
	GlobalAlertPopupAction,
	GlobalPopupBaseAction,
	GlobalSlidingPopupAction,
	PopupsFullScreenAction,
	PopupsSnackbarMsgAction,
} from './popupsReducer';

export abstract class PopupActionsBase implements IPopupActions {
	private _store: Store;

	protected constructor(store: Store) {
		this._store = store;
	}

	/**
	 * Shows a snackbar message to the user
	 * https://material-ui.com/demos/snackbars/
	 * @param msg
	 * @param variant
	 */
	snackbarMsg(
		msg?: string,
		variant: SimpleSnackbarVariant = SimpleSnackbarVariant.success,
		timeout?: number,
	) {
		const a: PopupsSnackbarMsgAction = {
			type: PopupsActionType.POPUPS_SNACKBAR,
			variant,
			msg,
			timeout,
		};
		this._store.dispatch<Action>(a);
	}

	/**
	 * Shows a popup dialog to the user
	 * https://material-ui.com/demos/dialogs/
	 * @param props
	 */
	popupMsg(props: Partial<GlobalAlertPopupProps>) {
		if (props.isOpen === undefined && Object.keys(props).length > 0) {
			props.isOpen = true;
		}

		// If this is a new popup, we reset the values.
		// Because we need values to stay there when a popup is closing for animations.
		if (props.isOpen === true) {
			props.resetValues = true;
		}

		// If the popup is already open, close it first and then open it again.
		// Probably don't need as we are overriding the previous popup.
		/*if (this._store.getState().popups.globalAlertPopupProps?.isOpen && props.isOpen) {
			this.popupMsg({ isOpen: false });
			setTimeout(() => this.popupMsg(props), 200);
			return;
		}*/

		const a: GlobalAlertPopupAction = {
			globalAlertPopupProps: props,
			type: PopupsActionType.POPUPS_MSG,
		};
		this._store.dispatch<Action>(a);
	}

	resetPopupMsg() {
		const a: GlobalAlertPopupAction = {
			globalAlertPopupProps: {
				isOpen: false,
				okayBtnClick: undefined,
				title: undefined,
				cancelBtn: undefined,
				cancelBtnClick: undefined,
				content: undefined,
				okayBtn: undefined,
				hideTopCloseButton: undefined,
				actionCountdownSeconds: undefined,
			},
			type: PopupsActionType.POPUPS_MSG,
		};
		this._store.dispatch<Action>(a);
	}

	slidingPopup(props: Partial<GlobalSlidingPopupProps>) {
		const a: GlobalSlidingPopupAction = {
			props,
			type: PopupsActionType.POPUPS_GLOBAL_SLIDING_POPUP,
		};
		this._store.dispatch<Action>(a);
	}

	hideGlobalPopupComponent() {
		const a: GlobalPopupBaseAction = {
			isOpen: false,
			type: PopupsActionType.POPUPS_GLOBAL_POPUP_BASE,
		};
		this._store.dispatch<Action>(a);
	}

	showGlobalPopupComponent(componentFn: () => React.ReactElement | null) {
		const a: GlobalPopupBaseAction = {
			componentFn,
			isOpen: true,
			type: PopupsActionType.POPUPS_GLOBAL_POPUP_BASE,
		};
		this._store.dispatch<Action>(a);
	}

	fullScreenPopup(props: Partial<FullScreenPopupProps>) {
		const a: PopupsFullScreenAction = {
			props,
			type: PopupsActionType.POPUPS_FULLSCREEN,
		};
		this._store.dispatch<Action>(a);
	}
}
