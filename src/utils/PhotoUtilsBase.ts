import { IPhotoDto } from '../customTypes/commonInterfaces';
import StorageBucketBase from '../storage/StorageBucketBase';

export default class PhotoUtilsBase {
	private _mediaHost: string;
	private _storageBucket: StorageBucketBase;

	constructor(mediaHost: string, storageBucket: StorageBucketBase) {
		this._mediaHost = mediaHost;
		this._storageBucket = storageBucket;
	}

	getSrcByPhotoArr(
		photos: IPhotoDto[] | null | undefined,
		wantedSize: number,
		isUserPhoto = false,
	): string {
		if (!photos || photos.length === 0) {
			return this.getSrc(undefined, undefined, undefined, wantedSize);
		}

		return this.getSrc(photos[0].id, photos[0].ext, photos[0].sizes, wantedSize);
	}

	getSrcByPhoto(photo?: IPhotoDto | null, wantedSize?: number, isUserPhoto = false): string {
		if (!photo) {
			return this.getSrc(undefined, undefined, undefined, wantedSize, isUserPhoto);
		}

		return this.getSrc(photo.id, photo.ext, photo.sizes, wantedSize);
	}

	getSrcByPhotoOrNull(
		photo?: IPhotoDto | null,
		wantedSize?: number,
		isUserPhoto = false,
	): string | null {
		if (!photo) return null;
		return this.getSrc(photo.id, photo.ext, photo.sizes, wantedSize);
	}

	getSrc(
		photoId?: string | any,
		photoExt?: string | null,
		sizes?: number[],
		wantedSize?: number,
		isUserPhoto = false,
	): string {
		if (!photoId)
			return `/public/images/nophoto/${isUserPhoto ? 'person' : 'landscape'}-gray.svg`;

		// TODO get this from a static config store with assertion config is loaded, or error out.
		const photosDomain = this._mediaHost;

		if (!wantedSize) {
			return `https://${photosDomain}/${this._storageBucket.photos}/${photoId}.${photoExt}`;
		} else if (sizes && sizes.includes(parseInt(wantedSize as any))) {
			return `https://${photosDomain}/${this._storageBucket.photos}/${photoId}-${wantedSize}.${photoExt}`;
		} else {
			return `/api/photos/${photoId}/sizes/${wantedSize}`;
		}
	}
}
