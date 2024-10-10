/**
 * Helper to construct the URL for a resource kept in the cloud storage.
 */
export default class StorageBucketBase {
	private _bucketNamePrefix: string;
	private _bucketNameSuffix: string;

	public readonly photos: string;
	public readonly videos: string;

	constructor(bucketNamePrefix: string, bucketNameSuffix: string) {
		this._bucketNamePrefix = bucketNamePrefix ?? '';
		this._bucketNameSuffix = bucketNameSuffix ?? '';

		this.photos = this._getBucketName('photos');
		Object.freeze(this.photos);

		this.videos = this._getBucketName('videos');
		Object.freeze(this.videos);
	}

	protected _getBucketName(rawName: string) {
		return `${this._bucketNamePrefix}${rawName}${this._bucketNameSuffix}`;
	}
}
