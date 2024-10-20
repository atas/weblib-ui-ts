import qs from 'query-string';

export function getFullUrl(includeHash = false) {
	return (
		`${window.location.protocol}//` +
		window.location.host +
		window.location.pathname +
		window.location.search +
		(includeHash ? window.location.hash : '')
	);
}

// Returns the bare hostname from a given full url
function getHostname(url: string) {
	const matches = /^https?:\/\/([a-zA-Z0-9-.]+)./g.exec(url);
	return matches && matches?.length > 1 ? matches[1] : null;
}

/**
 * Converts given text to url-friendly text
 */
export function convertToSlug(text: string | null): string | null {
	if (!text || text.trim() === '') return null;

	return (text || '')
		.toLowerCase()
		.replace(/[^a-z0-9- ]+/g, '')
		.replace(/ +/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function openPopup(url: string, title: string, w: number, h: number) {
	// Fixes dual-screen position, Most browsers - Firefox
	const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
	const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

	const width = window.innerWidth
		? window.innerWidth
		: document.documentElement!.clientWidth
			? document.documentElement!.clientWidth
			: screen.width;

	const height = window.innerHeight
		? window.innerHeight
		: document.documentElement!.clientHeight
			? document.documentElement!.clientHeight
			: screen.height;

	const left = width / 2 - w / 2 + dualScreenLeft;
	const top = height / 2 - h / 2 + dualScreenTop;
	const newWindow = window.open(
		url,
		title,
		'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left,
	);

	// Puts focus on the newWindow
	// @ts-ignore:2774
	if (window.focus && newWindow) {
		newWindow.focus();
	}
}

export function copyToClipboard(text: string) {
	const txt = document.createTextNode(text);
	const m = document;
	const w = window;
	const b = m.body as any;
	b.appendChild(txt);
	if (b.createTextRange) {
		const d = b.createTextRange();
		d.moveToElementText(txt);
		d.select();
		m.execCommand('copy');
	} else {
		const d = m.createRange();
		const g: any = w.getSelection;
		d.selectNodeContents(txt);
		g().removeAllRanges();
		g().addRange(d);
		m.execCommand('copy');
		g().removeAllRanges();
	}
	txt.remove();
}

/**
 * Get a redirection URL from query if there's one carried around, or gets the current page as redirection.
 */
export function getUrlToRedirectOrCurrentUrl(locationSearch?: string) {
	// If we don't have redir query param, current url is to be redirected.
	return getRedirUrlIfExists(locationSearch) || `${location.pathname}${location.search}`;
}

/**
 * Gets the ?redir queyr param if it's set, or null if not set.
 * @param locationSearch Risky to set as it's more reliable to read it from window.location.search every time. BrowserHistory does not always update.
 */
export function getRedirUrlIfExists(locationSearch?: string) {
	const queryMap = qs.parse(locationSearch || window.location.search);
	const redir = queryMap.redir?.toString();

	// redir should be a valid domestic url and exists, otherwise return null
	return redir && redir.match('^[a-zA-Z0-9-_/]*$') ? redir : null;
}

/**
 * Gets the full Login URL with redir query param in it.
 */
export function getLoginUrlWithRedir() {
	return `/login?redir=${getUrlToRedirectOrCurrentUrl() || '/'}`;
}

export function isHttpsUrl(url: string) {
	const regex =
		/^https:\/\/[a-zAz0-9-]+(\.[a-zA-Z0-9-]+)*(\:[0-9]+)?(\/[^?\s]*)?(\?[^#\s]*)?(#[^\s]*)?$/;
	return typeof url === 'string' && regex.test(url);
}

export function getUrlWithQuery(url: string, query: { [key: string]: any }) {
	let q = qs.stringify(query, {skipNull: true, skipEmptyString: true});
	q = q ? `?${q}` : '';

	if (!url.endsWith('/')) {
		url += '/';
	}

	return url + q;
}