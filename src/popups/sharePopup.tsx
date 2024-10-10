import React from 'react';
import * as detectBrowser from '../utils/detectBrowser';
import { copyToClipboard, openPopup } from '../utils';
import { IPopupActions } from './IPopupActions';
import { SimpleSnackbarVariant } from './SimpleSnackbar';

let _popupActions: IPopupActions;
let _siteName: string;

export interface ShareDialogProps {
	link: string;
}

const ShareDialog: React.FC<ShareDialogProps> = props => {
	const whatsappShare = () => {
		location.href = `whatsapp://send?text=${props.link}`;
		return false;
	};

	const messengerShareUrl = () => {
		return 'fb-messenger://share?link=' + props.link;
	};

	const facebookShare = () => {
		const fbUrl = `http://www.facebook.com/sharer.php?u=${props.link}`;
		openPopup(fbUrl, 'fb-share-dialog', 626, 436);
	};

	const twitterShare = () => {
		const ttUrl = `https://twitter.com/intent/tweet?url=${props.link}`;
		openPopup(ttUrl, 'tt-share-dialog', 626, 350);
	};

	const emailShareLink = (subject?: string) => {
		subject = subject || `${_siteName} Post`;
		let body = 'Hey, \n\nCheck out this post\n\n';

		subject = encodeURIComponent(subject);
		body = encodeURIComponent(body);
		body += props.link;

		return `mailto:?subject=${subject}&body=${body}`;
	};

	const navigatorShare = () => {
		if (navigator.share) {
			navigator.share({
				title: _siteName,
				text: `Interesting post on ${_siteName}`,
				url: props.link,
			});
		}
	};

	const copyLink = () => {
		copyToClipboard(props.link);
		_popupActions.snackbarMsg(
			'Post url is copied to clipboard.',
			SimpleSnackbarVariant.success,
		);
		close();
	};

	const close = () => {
		_popupActions.fullScreenPopup({ isOpen: false });
	};

	return (
		<div className="shareDialog popupMenu">
			<a href="#" onClick={whatsappShare}>
				<img src="/public/images/whatsapp.svg" className="menuIcon" /> Whatsapp
			</a>

			{detectBrowser.isTouchDevice() && (
				<a href={messengerShareUrl()}>
					<img src="/public/images/fb-messenger.svg" className="menuIcon" /> Facebook
					Messenger
				</a>
			)}

			<a href="#" onClick={facebookShare}>
				<img src="/public/images/facebook.svg" className="menuIcon" /> Facebook
			</a>

			<a href="#" onClick={twitterShare}>
				<img src="/public/images/twitter.svg" className="menuIcon" /> Twitter
			</a>

			<a href={emailShareLink()} rel="noopener noreferrer" target="_blank">
				<span className="material-icons-outlined menuIcon">email </span> Email
			</a>

			<a href="#" onClick={copyLink}>
				<span className="material-icons-outlined menuIcon">link </span> Copy Link
			</a>

			{detectBrowser.isTouchDevice() && navigator.share! && (
				<a href="#" onClick={navigatorShare}>
					<span className="material-icons-outlined menuIcon">share</span> Device's share
					menu
				</a>
			)}
		</div>
	);
};

export function shareDialog(popupActions: IPopupActions, siteName: string) {
	_popupActions = popupActions;
	_siteName = siteName;

	return ShareDialog;
}
