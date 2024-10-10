import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import ILogger from '../logging/ILogger';

export interface FcmConfigObject {
	appId: string;
	apiKey: string;
	projectId: string;
	authDomain: string;
	storageBucket: string;
	messagingSenderId: string;
	vapidKey: string;
}

export class FcmBase {
	private _firebaseConfig: FcmConfigObject;
	private _logger: ILogger;
	swRegistration?: ServiceWorkerRegistration;

	// Does this browser support Web Push
	private _isSupported = firebase.messaging.isSupported;
	get isSupported(): () => boolean {
		return this._isSupported;
	}

	private _app?: firebase.app.App;

	getMessagingToken() {
		this._logger.info('WebPush: Getting messaging token');
		return firebase.messaging().getToken({
			serviceWorkerRegistration: this.swRegistration,
			vapidKey: this._firebaseConfig.vapidKey,
		});
	}

	constructor(firebaseConfig: FcmConfigObject, logger: ILogger) {
		this._firebaseConfig = firebaseConfig;
		this._logger = logger;
	}

	isGranted() {
		return 'Notification' in window && Notification.permission === 'granted';
	}

	async init() {
		// If already registered, in development mode it happens during hot reloading.
		if (firebase.apps.filter(a => a.name == '[DEFAULT]').length > 0) return;

		if ('serviceWorker' in navigator && navigator.serviceWorker) {
			this.swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
		}

		if (this._firebaseConfig) {
			this._logger.info('Initialising Firebase with', this._firebaseConfig);
			this._app = firebase.initializeApp(this._firebaseConfig);
		}

		return this.swRegistration;
	}

	/**
	 * Prompt user for push notification permission
	 */
	async requestNotifPermFromBrowser() {
		if (!this._isSupported() || !('Notification' in window))
			return this._logger.error('Notifications are not supported, not requesting.');

		this._logger.info('PUSH: Requesting notification permissions.');
		const result = await Notification.requestPermission();
		this._logger.info('PUSH: Permissions result', result);

		return result;
	}
}
