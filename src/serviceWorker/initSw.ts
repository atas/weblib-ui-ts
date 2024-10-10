import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { SWMsgTypes } from './SWMsgTypes';

// Set the correct type for self object
// declare const s: typeof self & ServiceWorkerGlobalScope; OR WorkerGlobalScope
// const s: typeof self & ServiceWorkerGlobalScope = self as any;
// declare var self: WorkerGlobalScope & typeof globalThis;
declare let self: ServiceWorkerGlobalScope & typeof globalThis;

export default function (): any {
	(self as any).__WB_MANIFEST;

	registerRoute(/^\/public[0-9]+\//, new CacheFirst());

	self.addEventListener('install', event => {
		event.waitUntil(self.skipWaiting()); // Forces the waiting service worker to become the active service worker
	});

	self.addEventListener('activate', event => {
		event.waitUntil(self.clients.claim()); // Takes control of all available clients under its scope
	});

	self.addEventListener('push', function (event: any) {
		console.log('PUSH', JSON.stringify(event), event, JSON.stringify(event.data), event.data);
		if (!self.Notification || self.Notification.permission !== 'granted') {
			return;
		}

		console.log('SW: Notification Received:', event.data);
		console.log('SW: Notification Received:', JSON.stringify(event.data));

		let data: any = null;
		if (event.data) {
			try {
				data = event.data.json ? event.data.json() : event.data;
			} finally {
				if (data == null) data = event.data || {};
			}
		}

		console.log('SW: Notification Event:', { ...event });
		console.log('SW: data:', { ...data });
		console.log('SW: data.notification:', { ...data.notification });

		const title = data?.title || data?.notification?.title;

		event.waitUntil(
			self.registration.showNotification(title, {
				body: data?.message || data?.notification?.body,
				icon: data?.icon || data?.notification?.icon,
				badge: data?.icon || data?.notification?.icon,
				tag: data?.tag || data?.notification?.tag,
				data: {
					...data.notification.data,
				},
			}),
		);
	});

	self.addEventListener('notificationclick', function (event: NotificationEvent) {
		event.notification.close(); // Android needs explicit close.
		console.log('SW: NotificationClick event', event);

		const target = event.currentTarget as ServiceWorkerGlobalScope;

		// target.origin can be used for the protocol://hostname
		const url = event.notification.data.url;

		event.waitUntil(
			target.clients.matchAll({ type: 'window' }).then(function (clients) {
				if (event.notification.tag === 'RevealMediaByNotif') {
					clients.forEach(c =>
						c.postMessage({
							type: SWMsgTypes.REVEAL,
							mediaId: event.notification.data.mediaId,
						}),
					);

					for (const c of clients) {
						const clientUrl = new URL(c.url);
						console.log(
							'SW: clientUrl.pathname.startsWith(url)',
							clientUrl.pathname,
							url,
						);
						if (clientUrl.pathname.startsWith(url) && 'focus' in c && !c.focused) {
							console.log('SW: Focusing on existing window to reveal notif', url);
							return c.focus();
						}
					}
					return;
				}

				// If this page is already open, focus on it
				for (const c of clients) {
					if (c.url === new URL(url, target.origin).href && 'focus' in c && !c.focused) {
						console.log('SW: Focusing on existing window for notification url', url);
						return c.focus();
					}
				}

				// If there is a page on the same site, navigate that one
				for (const c of clients) {
					if (
						c.url.startsWith(target.origin) &&
						!/^\/(api|admin)/.test(c.url.substr(target.origin.length))
					) {
						console.log(
							`SW: Navigating on existing window with URL ${c.url} for notification url`,
							url,
						);
						// Send a message to the client to redirect
						c.postMessage({
							type: SWMsgTypes.REDIRECT,
							url: url,
						});

						return c.focus();
					}
				}

				// If not, then open the target URL in a new window/tab.
				if (target.clients.openWindow) {
					console.log('SW: Opening notification URL', url);
					return target.clients.openWindow(url);
				}

				throw new Error(
					"SW: Cannot open a window/tab to navigate to the given notification's url",
				);
			}),
		);
	});
}
