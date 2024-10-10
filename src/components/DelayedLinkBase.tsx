import React, { useEffect, useState } from 'react';
import { Link, LinkProps, NavigateFunction } from 'react-router-dom';
import ILogger from '../logging/ILogger';
import { IPopupActions } from '../popups/IPopupActions';
import * as detectBrowser from '../utils/detectBrowser';

export interface DelayedLinkBaseProps extends LinkProps {
	onDelayStart?: (e: any, to: string) => void;
	onDelayEnd?: (e: any, to: string) => void;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => boolean | void;
	loggedInOnly?: boolean;
	replace?: boolean;
	to: string;
	onInstantMobileClick?: (e?: any) => void; // Only on mobile
	isLoggedIn?: boolean | null;
}

type LoginPopupFn = (redirUrl?: string) => void;

let _popupActions: IPopupActions;
let _navigate: NavigateFunction;
let _logger: ILogger;
let _showLoginPopupFn: LoginPopupFn;
let _delay: number;
let LinkComponent: typeof Link;

function DelayedLinkBase({
	onDelayStart,
	onDelayEnd,
	onClick,
	loggedInOnly,
	replace,
	onInstantMobileClick,
	isLoggedIn,
	...linkProps
}: DelayedLinkBaseProps) {
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
	const [isActiveCss, setIsActiveCss] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		// Hide any popups on regular in-app link clicks
		_popupActions.slidingPopup({ isOpen: false });
		_popupActions.hideGlobalPopupComponent();

		if (onInstantMobileClick && detectBrowser.isTouchDevice()) {
			_logger.info('onInstantMobileClick() is running on touch device.');
			onInstantMobileClick(e);
		}

		onDelayStart && onDelayStart(e, linkProps.to);

		if (e.defaultPrevented) return;
		e.preventDefault();

		setIsActiveCss(true);

		const newTimeoutId = setTimeout(() => {
			let shouldPushNewUrl = true;
			setTimeout(() => setIsActiveCss(false), 50);

			// If onClick returns false, don't push the new URL.
			if (onClick) {
				_logger.info('onClick() will run');
				const onClickRes = onClick(e);
				if (onClickRes === false) {
					_logger.info('onClick() returned false, so not pushing new URL.');
					shouldPushNewUrl = false;
				}
			}

			onDelayEnd && onDelayEnd(e, linkProps.to);

			// If we require the user to be logged in to use this link, otherwise, show the login popup.
			if (loggedInOnly && isLoggedIn === false) {
				// Replace with your actual implementation
				return _showLoginPopupFn(linkProps.to);
			}

			if (shouldPushNewUrl) _navigate(linkProps.to, { replace });
		}, _delay);

		setTimeoutId(newTimeoutId);
	};

	// Clear timeout on unmount
	useEffect(
		() => () => {
			timeoutId && clearTimeout(timeoutId);
		},
		[timeoutId],
	);

	let css = linkProps.className || '';
	if (isActiveCss) css += ' active';

	return <LinkComponent {...linkProps} onClick={handleClick} className={css} />;
}

export default function initDelayedLink(
	popupActions: IPopupActions,
	navigate: NavigateFunction,
	linkComponent: typeof Link,
	logger: ILogger,
	showLoginPopupFn: LoginPopupFn,
	delay = 150,
) {
	_popupActions = popupActions;
	_navigate = navigate;
	LinkComponent = linkComponent;
	_logger = logger;
	_showLoginPopupFn = showLoginPopupFn;
	_delay = detectBrowser.isTouchDevice() ? delay : 0;

	return DelayedLinkBase;
}
