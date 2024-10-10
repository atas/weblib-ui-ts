import { AxiosInstance } from 'axios';
import { FcmBase } from '../firebase';
import ILogger from '../logging/ILogger';
import { IPopupActions } from '../popups/IPopupActions';
import { SimpleSnackbarVariant } from '../popups';

export default abstract class PushNotifPermBase {
	private tryAskPopup = true;
	private showUnsupportedPopup = false;
	private forceShowDeniedPopup = false;

	protected _logger: ILogger;
	private _fcm: FcmBase;
	private _httpClient: AxiosInstance;
	private _popupActions: IPopupActions;

	protected constructor(
		fcm: FcmBase,
		httpClient: AxiosInstance,
		popupActions: IPopupActions,
		logger: ILogger,
	) {
		this._fcm = fcm;
		this._httpClient = httpClient;
		this._popupActions = popupActions;
		this._logger = logger;
	}

	async request(showUnsupportedPopup = false, forceShowDeniedPopup = false, tryAskPopup = true) {
		this.showUnsupportedPopup = showUnsupportedPopup;
		this.forceShowDeniedPopup = forceShowDeniedPopup;
		this.tryAskPopup = tryAskPopup;

		if (!this.checkSupport()) return false;

		if (this.tryAskPopup) {
			this._logger.info('Asking for Web Push perms with popup');
			return this._tryAskPopup();
		} else {
			this._logger.info('Requesting Web Push perms WITHOUT popup');
			return await this._initiatePermRequest();
		}
	}

	async requestSilentlyIfGranted() {
		if (this._fcm.isGranted()) {
			return this.request(false, false, false);
		}
		return false;
	}

	requestWithAskPopupRandomly() {
		const askPopupShownAt = this.askPopupShownAt();
		// If the popup was shown within the last week, don't show again.
		if (askPopupShownAt && +new Date() / 1000 - askPopupShownAt < 60 * 60 * 24 * 7) return;

		this.tryAskPopup = true; //!this.askPopupShownAt() || Math.floor(Math.random() * 5) == 3;

		return this.request(false, false);
	}

	/**
	 * Checks if this browser supports push notifications
	 */
	private checkSupport() {
		const unsupportedPopup = () => {
			if (this.showUnsupportedPopup) {
				this._popupActions.popupMsg({
					okayBtn: 'Okay',
					content:
						'Notifications are only supported on latest desktop web browsers and Android Chrome. Unforunately, iPhone and iPad do not support notifications, unfortunately.',
					title: 'Not Supported!',
				});
			}
			return false;
		};

		return this._fcm.isSupported() ? true : unsupportedPopup();
	}

	/**
	 * Should we show a popup asking for notifications before requesting them from the browser
	 */
	private async _tryAskPopup() {
		// If permissions are given before on this browser, we don't show the popup again.
		if (this._isPermGivenBefore() || this._fcm.isGranted()) {
			return this._initiatePermRequest();
		} else {
			this.setAskPopupShownAt();
			return new Promise((resolve, reject) => {
				this._popupActions.popupMsg({
					title: 'Push Notifications',
					content:
						'Would you like to get brief push notifications on this device for replies? Max 1 per hour.',
					okayBtn: 'Get notifications',
					okayBtnClick: async () => {
						const result = await this._initiatePermRequest();
						resolve(result);
					},
					cancelBtn: 'No',
					cancelBtnClick: () => reject('Cancel button clicked on PushNotif TryAskPopup.'),
				});
			});
		}
	}

	private async _initiatePermRequest() {
		const result = await this._fcm.requestNotifPermFromBrowser();

		this.onPushNotifPermResult(result === 'granted');

		if (result === 'denied') {
			this._logger.warn('PUSH: Permission request is denied.');
			// We always show denied popup when ask popup was shown
			if (this.tryAskPopup || this.forceShowDeniedPopup) {
				return this._popupActions.popupMsg({
					title: 'Notifications Blocked!',
					content:
						'Notifications are blocked on your device at the moment. Please enabled them.',
					okayBtnClick: this.showPushNotifAllowTutorial,
					okayBtn: 'Show Me How',
					cancelBtn: 'Leave Blocked',
				});
			}
		} else if (result === 'granted') {
			this._logger.info('PUSH: Notifications permissions granted');
			this._setPermGiven();

			let currentToken = '';

			this._logger.info('Trying to obtain WebPush Token with options');

			try {
				currentToken = await this._fcm.getMessagingToken();
			} catch (e) {
				this._popupActions.snackbarMsg(
					'Could not obtain WebPush msg token.',
					SimpleSnackbarVariant.error,
				);
				throw e;
			}

			await this._registerToken(currentToken);
		} else if (result == 'default')
			this._logger.warn('PUSH: User cancelled the browser notification popup', result);

		return result;
	}

	public abstract onPushNotifPermResult(isGranted: boolean): void;
	public abstract showPushNotifAllowTutorial(): void;

	/**
	 * Send the push notification token to our server
	 * @param currentToken
	 */
	private async _registerToken(currentToken: string) {
		if (currentToken) {
			this._logger.info('PUSH: Registering device token');
			await this._httpClient.post('/api/notifs/register-push-device', {
				token: currentToken,
			});
		} else {
			this._logger.error(
				'PUSH: No Instance ID token available. Need permission first to generate one.',
			);
		}
	}

	private _isPermGivenBefore() {
		return !!window.localStorage.getItem('pushPermGiven');
	}

	private _setPermGiven() {
		window.localStorage.setItem('pushPermGiven', Math.round(+new Date() / 1000).toString());
	}

	private askPopupShownAt() {
		const pushAskPopupShown = window.localStorage.getItem('pushAskPopupShown');
		return pushAskPopupShown ? parseInt(pushAskPopupShown) : null;
	}

	private setAskPopupShownAt() {
		window.localStorage.setItem('pushAskPopupShown', Math.round(+new Date() / 1000).toString());
	}
}
