import * as React from 'react';

import { SimpleSnackbarVariant } from './SimpleSnackbar';
import { FullScreenPopupProps } from './FullScreenPopup';
import { GlobalSlidingPopupProps } from './GlobalSlidingPopup';
import { GlobalAlertPopupProps } from './GlobalAlertPopupBase';

export interface IPopupActions {
	/**
	 * Shows a snackbar message to the user
	 * https://material-ui.com/demos/snackbars/
	 * @param msg
	 * @param variant
	 */
	snackbarMsg(msg?: string, variant?: SimpleSnackbarVariant): void;

	/**
	 * Shows a popup dialog to the user
	 * https://material-ui.com/demos/dialogs/
	 * @param props
	 */
	popupMsg(props: Partial<GlobalAlertPopupProps>): void;

	resetPopupMsg(): void;

	slidingPopup(props: Partial<GlobalSlidingPopupProps>): void;

	hideGlobalPopupComponent(): void;

	showGlobalPopupComponent(componentFn: () => React.ReactElement | null): void;

	fullScreenPopup(props: Partial<FullScreenPopupProps>): void;
}
