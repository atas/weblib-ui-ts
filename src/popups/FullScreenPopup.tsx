import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { DelayedButtonBaseProps } from '../components';
import { IPopupActions } from './IPopupActions';

export interface FullScreenPopupProps {
	isOpen: boolean;
	title?: string;
	children?: () => React.ReactNode;
	onClose?: () => void;
}

let _popupActions: IPopupActions;
let getDelayedButton: () => React.FC<DelayedButtonBaseProps>;

/**
 * Renders a full-screen popup from a given any child component.
 *
 * @param {FullScreenPopupProps} props - The props for the component.
 * @return {React.ReactElement} The rendered full-screen popup.
 */
const FullScreenPopupBase = (props: FullScreenPopupProps): React.ReactElement | null => {
	const popupBackdropRef = React.useRef<HTMLDivElement>(null);
	const handleClose = () => {
		_popupActions.fullScreenPopup({ isOpen: false });

		location.hash = '';
		window.removeEventListener('hashchange', onHashChange, false);
		document.removeEventListener<'keydown'>('keydown', onEscPress);

		if (props.onClose) props.onClose();
	};

	const getOverlayClass = () => {
		const cls = [];

		if (props.isOpen) cls.push('show');

		return cls.join(' ');
	};

	const onEscPress = (e: KeyboardEvent) => {
		e.key === 'Escape' && handleClose();
	};

	const onHashChange = () => {
		handleClose();
	};

	const DelayedButton = getDelayedButton();

	React.useEffect(() => {
		if (props.isOpen) {
			document.addEventListener<'keydown'>('keydown', onEscPress, { once: true });

			location.hash = 'popup';
			setTimeout(
				() => window.addEventListener('hashchange', onHashChange, { once: true }),
				50,
			);
		}

		return () => {
			props.isOpen && handleClose();
		};
	}, [props.isOpen]);

	return (
		<CSSTransition
			nodeRef={popupBackdropRef}
			in={props.isOpen}
			timeout={200}
			unmountOnExit
			mountOnEnter>
			<div ref={popupBackdropRef} className="popupBackdrop">
				<div className={`standardPopupContents`}>
					<div className="toolBar">
						<DelayedButton onDelayedClick={handleClose} className="close">
							<span className="material-icons-outlined">close</span>
						</DelayedButton>
						<div className="text">{props.title}</div>
					</div>

					<div className="child">{props.children && props.children()}</div>
				</div>
			</div>
		</CSSTransition>
	);
};

export function initFullScreenPopup(
	popupActions: IPopupActions,
	getDelayedButtonFn: () => React.FC<DelayedButtonBaseProps>,
) {
	_popupActions = popupActions;
	getDelayedButton = getDelayedButtonFn;

	return FullScreenPopupBase;
}
