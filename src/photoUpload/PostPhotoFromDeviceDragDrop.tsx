import React, { useState } from 'react';

interface PostPhotoFromDeviceState {
	open: boolean;
	files: File[];
	dragging: boolean;
}

const PostPhotoFromDeviceDragDrop: React.FC = () => {
	const [state, setState] = useState<PostPhotoFromDeviceState>({
		open: false,
		files: [],
		dragging: false,
	});

	const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileList: FileList | null = e.target.files;
		const files: File[] = [];
		if (fileList) {
			Object.keys(fileList).forEach((value: string, index: number) => {
				files.push(fileList[index]);
			});

			setState({
				...state,
				files: [...state.files, ...files],
				dragging: false,
			});
		}
	};

	const onDragEnter = () => {
		if (!state.dragging) {
			setState({ ...state, dragging: true });
		}
	};

	const onDragLeave = () => {
		setState({ ...state, dragging: false });
	};

	const removeFile = (e: React.MouseEvent<HTMLAnchorElement>, file: File) => {
		e.preventDefault();
		setState({ ...state, files: [...state.files.filter(f => f !== file)] });
	};

	return (
		<div className="postPhotoFromDeviceContainer">
			<div
				className={'dragDropDiv ' + (state.dragging ? 'dragging' : '')}
				onDragEnter={onDragEnter}
				onDragOver={onDragEnter}
				onDragLeave={onDragLeave}>
				<label htmlFor="postPhotoFiles" className="mainBtn">
					<div>
						<span className="material-icons-outlined">add_photo_alternate</span> Add
						Photos
					</div>
					<input
						type="file"
						id="postPhotoFiles"
						name="postPhotoFiles"
						multiple
						accept="image/png, image/jpeg, image/jpg, image/gif"
						onChange={onFilesChange}
					/>
				</label>
				<div className="clear"></div>
			</div>
			<div className="previews">
				{state.files.map(f => (
					<div key={f.name} style={{ backgroundImage: `url(${URL.createObjectURL(f)})` }}>
						<a
							href="src/components/photoUpload/PostPhotoFromDeviceDragDrop#"
							onClick={e => removeFile(e, f)}
							className="deleteIcon">
							<span className="material-icons-outlined">delete</span>
						</a>
					</div>
				))}
			</div>
		</div>
	);
};

export default PostPhotoFromDeviceDragDrop;
