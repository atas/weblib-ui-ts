import React, { useEffect, useState } from 'react';
import * as detectBrowser from '../utils/detectBrowser';

export interface DelayedButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	delay?: number;
	onDelayedClick: (e: React.MouseEvent<{}>) => void;
	loggedInOnly?: boolean;
	loginRedirUrl?: string;
	isLoggedIn?: boolean | null;
	showLoginPopupFn?: (redirUrl?: string) => void;
}

/**
 * Mobile friendly button that creates a delay on mobile devices for click/tap feedback.
 */
const DelayedButtonBase: React.FC<DelayedButtonBaseProps> = ({
	delay = detectBrowser.isTouchDevice() ? 150 : 0,
	onDelayedClick,
	loggedInOnly,
	loginRedirUrl,
	isLoggedIn,
	onClick,
	showLoginPopupFn,
	...restProps
}) => {
	const [timeoutId, setTimeoutId] = useState<any>(null);
	const [isActiveCss, setIsActiveCss] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		onClick && onClick(e);
		if (e.defaultPrevented) {
			return;
		}
		e.preventDefault();

		setIsActiveCss(true);

		const newTimeoutId = setTimeout(() => {
			setTimeout(() => setIsActiveCss(false), 50);
			if (loggedInOnly && isLoggedIn === false) {
				showLoginPopupFn && showLoginPopupFn(loginRedirUrl);
				return;
			}
			onDelayedClick(e);
		}, delay);

		setTimeoutId(newTimeoutId);
	};

	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	let css = restProps.className || '';
	if (isActiveCss) css += ' active';

	return <button {...restProps} onClick={handleClick} className={css} />;
};

export default DelayedButtonBase;
