export const geolocationUtils = {
	async checkLocationState(): Promise<LocationState> {
		try {
			if (!navigator.permissions) {
				console.log('Permissions API is not supported by your browser.');
				return 'unsupported';
			}

			const result = await navigator.permissions.query({ name: 'geolocation' });
			return result.state ? result.state : 'unknown';
		} catch (error) {
			console.error('Error occurred while checking location permission:', error);
			return 'unknown';
		}
	},

	async getLocation(): Promise<GeoCoordinates> {
		return new Promise((resolve, reject) => {
			if (!('geolocation' in navigator)) {
				reject(new Error('Geolocation is not supported by this browser.'));
				return;
			}

			navigator.geolocation.getCurrentPosition(
				position => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
					resolve({ latitude, longitude });
				},
				error => {
					console.log('Location Error:', error.message);
					reject(error);
				},
			);
		});
	},
};

export type GeoCoordinates = { latitude: number; longitude: number };
export type LocationState = 'unknown' | 'granted' | 'denied' | 'prompt' | 'unsupported';
