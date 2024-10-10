import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useMatomoPageView = () => {
	const location = useLocation();
	const [isInitialPageLoad, setIsInitialPageLoad] = useState(true);

	useEffect(() => {
		if (isInitialPageLoad) return setIsInitialPageLoad(false); //Skip the first run as it already runs

		// Track the page view with Matomo
		const _paq = (window as any)._paq;

		if (typeof _paq !== 'undefined') {
			_paq.push(['setCustomUrl', window.location.href]);
			_paq.push(['trackPageView']);
		}
	}, [location]);
};

/**
 * Tracks page views using Google Analytics.
 *
 * @returns {void} This function does not return a value.
 */
export const useGooglePageViewTracking = () => {
	const location = useLocation();

	const gtag = (window as any).gtag;

	useEffect(() => {
		if (typeof gtag !== 'undefined') {
			gtag('set', 'page_path', window.location.href);
			gtag('event', 'page_view');
		}
	}, [location]);
};
