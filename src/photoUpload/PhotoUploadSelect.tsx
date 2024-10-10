import * as React from 'react';
import PhotoUploadContext from './PhotoUploadContext';

interface Props {
	context: PhotoUploadContext;
	name?: string;
	multi?: boolean;
}

export default function PhotoUploadSelect(props: Props) {
	const [dragging, setDragging] = React.useState(false);

	function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
		const fileList: FileList | null = e.target.files;
		if (!fileList) return;

		if (!props.multi) {
			props.context.clear();
		}

		const files: File[] = [];
		Object.keys(fileList).map((value: string, index: number) => {
			files.push(fileList[index]);
		});

		props.context.addFiles(files);

		setDragging(false);
	}

	/* onDragEnter = () => {
		if (!this.state.dragging) {
			this.setState({ ...this.state, dragging: true });
		}
	};

	onDragLeave = () => {
		this.setState({ ...this.state, dragging: false });
	}; 

	removeFile = (e: React.MouseEvent<HTMLAnchorElement>, file: File) => {
		e.preventDefault();
		this.props.context.removeFile(file);
	};*/

	return (
		<div className="postPhotoFromDeviceContainer">
			<label htmlFor="postPhotoFiles" className="btn iconText">
				<div className="icon material-icons-outlined">add_photo_alternate</div>
				<div className="text" style={{ marginTop: '5px' }}>
					{props.name ?? 'Add Photos'}
				</div>
			</label>

			<input
				type="file"
				id="postPhotoFiles"
				name="postPhotoFiles"
				multiple={!!props.multi}
				accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
				onChange={onFilesChange}
			/>
		</div>
	);
}
