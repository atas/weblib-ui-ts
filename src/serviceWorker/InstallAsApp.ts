import { IPopupActions } from '../popups/IPopupActions';

const ShowPopupInterval = 60 * 60 * 24 * 7; // Weekly

export default class InstallAsApp {
	private installPromptEvent?: BeforeInstallPromptEvent;

	// Instance variable to know when the install-as-app was shown instead of browserStorage calculation, to save processing.
	private installAsAppPopupShown = false;

	private _siteName: string;
	private _popupActions: IPopupActions;
	private _isLoggedIn: () => boolean | null;

	constructor(popupActions: IPopupActions, siteName: string, isLoggedIn: () => boolean | null) {
		this._popupActions = popupActions;
		this._siteName = siteName;
		this._isLoggedIn = isLoggedIn;
	}

	captureEvent(e: BeforeInstallPromptEvent) {
		this.installPromptEvent = e;
	}

	hasEvent() {
		return !!this.installPromptEvent;
	}

	shouldShowInstallPopup() {
		// Skip showing the install-as-app popup on these criteria
		if (this.installAsAppPopupShown || !this.hasEvent() || !this._isLoggedIn()) return;

		const shownTime = localStorage.getItem('installAsAppShownTime');
		this.installAsAppPopupShown = true;

		// If the popup has shown before
		if (shownTime && new Date().getTime() / 1000 - parseInt(shownTime) < ShowPopupInterval)
			return;

		this.showInstallPopup();
	}

	showInstallPopup() {
		localStorage.setItem(
			'installAsAppShownTime',
			Math.floor(new Date().getTime() / 1000).toString(),
		);

		this._popupActions.popupMsg({
			title: 'Install me as an App?',
			content: `You can add ${this._siteName} to your home screen like an app. It's handy. Would you like to?`,
			okayBtnClick: async () => this.promptDirectly(),
			okayBtn: 'Yes',
		});
	}

	async promptDirectly() {
		return this.installPromptEvent ? this.installPromptEvent.prompt() : null;
	}
}

export function registerBeforeInstallPromptEvent(installAsApp: InstallAsApp) {
	window.addEventListener('beforeinstallprompt', (e: any) => {
		e.preventDefault();
		installAsApp.captureEvent(e as BeforeInstallPromptEvent);
	});
}

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * Only supported on Chrome and Android Webview.
 */
export interface BeforeInstallPromptEvent extends EventListener {
	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: string[];

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;

	/**
	 * Allows a developer to show the install-prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;
}
