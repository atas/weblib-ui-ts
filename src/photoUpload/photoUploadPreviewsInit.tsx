import { AxiosInstance } from 'axios';
import React, { useEffect, useState } from 'react';
import { Dictionary } from 'ts-essentials';
import { IPhotoDto } from '../customTypes/commonInterfaces';
import PhotoUtilsBase from '../utils/PhotoUtilsBase';
import PhotoUploadContext from './PhotoUploadContext';

interface Props {
	context: PhotoUploadContext;
	uploadedPhotos?: IPhotoDto[];
}

interface State {
	deletedUploadedPhotoIds: Dictionary<true>;
}

let _httpClient: AxiosInstance;
let _photoUtils: PhotoUtilsBase;

export default function photoUploadPreviewsInit(
	httpClient: AxiosInstance,
	photoUtils: PhotoUtilsBase,
) {
	_httpClient = httpClient;
	_photoUtils = photoUtils;

	return PhotoUploadPreviews;
}

const PhotoUploadPreviews: React.FC<Props> = ({ context, uploadedPhotos }) => {
	const [deletedUploadedPhotoIds, setDeletedUploadedPhotoIds] = useState<Dictionary<true>>({});

	useEffect(() => context.attach(onUpdate), []);

	const onUpdate = (files: File[]) => setDeletedUploadedPhotoIds({});

	const getUploadedPhotosWithoutDeleted = () =>
		uploadedPhotos?.filter(p => !deletedUploadedPhotoIds[p.id]);

	const apiUrl = '/api/photos/';

	const onUploadedPhotoDelete = async (p: IPhotoDto) => {
		await _httpClient.delete(`${apiUrl}${p.id}`);
		setDeletedUploadedPhotoIds(prevIds => ({ ...prevIds, [p.id]: true }));
	};

	return (
		<div className="photoThumbnails">
			{getUploadedPhotosWithoutDeleted()?.map(p => (
				<div
					key={p.id}
					style={{ backgroundImage: `url(${_photoUtils.getSrcByPhoto(p, 64)})` }}>
					<a
						href="#"
						onClick={e => {
							e.preventDefault();
							onUploadedPhotoDelete(p);
						}}
						className="deleteIcon">
						<span className="material-icons-outlined">delete </span>
					</a>
				</div>
			))}

			{context.files.map(f => (
				<div key={f.name} style={{ backgroundImage: `url(${URL.createObjectURL(f)})` }}>
					<a
						href="#"
						onClick={e => {
							e.preventDefault();
							context.removeFile(f);
						}}
						className="deleteIcon">
						<span className="material-icons-outlined">delete </span>
					</a>
				</div>
			))}
		</div>
	);
};
