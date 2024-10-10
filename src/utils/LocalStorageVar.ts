export default class LocalStorageVar {
	private key: string;

	constructor(key: string) {
		this.key = key;
	}

	get(): string | null {
		return localStorage.getItem(this.key);
	}

	set(val: string) {
		localStorage.setItem(this.key, val);
	}

	remove() {
		localStorage.removeItem(this.key);
	}
}
