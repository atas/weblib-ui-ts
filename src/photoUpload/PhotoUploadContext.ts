export default class PhotoUploadContext {
	private _files: File[] = [];
	private observers: ((files: File[]) => any)[] = [];

	get files(): File[] {
		return this._files;
	}

	addFiles(files: File[]) {
		this._files = [...this._files, ...files];
		this.notify();
	}

	removeFile(file: File) {
		this._files = [...this._files.filter(f => f !== file)];
		this.notify();
	}

	clear() {
		this._files = [];
		this.notify();
	}

	attach(func: (files: File[]) => any) {
		this.observers.push(func);
	}

	private notify() {
		this.observers.map(o => o(this._files));
	}
}
