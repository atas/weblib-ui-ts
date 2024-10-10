import * as React from 'react';
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { DelayedButtonBaseProps } from '../components';
import ILogger from '../logging/ILogger';
import { IPopupActions } from './IPopupActions';

let _popupActions: IPopupActions;
let _navigate: NavigateFunction;
let getDelayedButton: () => React.ComponentType<DelayedButtonBaseProps>;
let _logger: ILogger;

export interface PopupWrapperProps {
	title: string;
	okayBtnDisabled?: boolean;

	okayBtnClick(): void;

	okayBtnLabel?: string;
	cancelBtnLabel?: string;
	children: React.ReactElement;

	isOpen: boolean;
}

export function initPopupWrapper(
	popupActions: IPopupActions,
	navigate: NavigateFunction,
	getDelayedButtonFn: () => React.ComponentType<DelayedButtonBaseProps>,
	logger: ILogger,
) {
	_popupActions = popupActions;
	_navigate = navigate;
	getDelayedButton = getDelayedButtonFn;
	_logger = logger;
}

export function PopupWrapperBase(props: PopupWrapperProps) {
	const popupBackdropRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onEscPress = (e: KeyboardEvent) =>
			e.key === 'Escape' && _popupActions.hideGlobalPopupComponent();
		const onHashChange = () => _popupActions.hideGlobalPopupComponent();

		if (props.isOpen) {
			// Add root level ESC key event handler
			document.addEventListener<'keydown'>('keydown', onEscPress);
			location.hash = 'popup';
			setTimeout(() => {
				window.addEventListener('hashchange', onHashChange, { once: true });
				console.log('hashchange is called');
			}, 50);
		}

		const removeListeners = () => {
			// Remove root-level ESC key event handler
			_logger.verbose('Removing listeners');
			document.removeEventListener<'keydown'>('keydown', onEscPress);
			window.removeEventListener('hashchange', onHashChange, false);
			_navigate(window.location.pathname + window.location.search, {
				replace: true,
			});
		};

		if (!props.isOpen) {
			removeListeners();
		}

		return removeListeners;
	}, [props.isOpen]); // Only re-run the effect if count changes

	const DelayedButton = getDelayedButton();

	return (
		<CSSTransition nodeRef={popupBackdropRef} in={props.isOpen} timeout={200} unmountOnExit>
			<div ref={popupBackdropRef} className="popupBackdrop">
				<div className="standardPopupContents">
					<div className="toolBar">
						<DelayedButton
							onDelayedClick={() => _popupActions.hideGlobalPopupComponent()}
							className="close">
							<span className="material-icons-outlined">close</span>
						</DelayedButton>
						<div className="text">{props.title}</div>
					</div>

					<div className="child">{props.children}</div>

					<div className="actions">
						{props.cancelBtnLabel && (
							<DelayedButton
								onDelayedClick={() => _popupActions.hideGlobalPopupComponent()}
								className="main grey">
								{props.cancelBtnLabel}
							</DelayedButton>
						)}
						{props.okayBtnClick && (
							<DelayedButton
								onDelayedClick={() => props.okayBtnClick()}
								className={
									'main ' + (props.okayBtnDisabled === true ? 'disabled' : '')
								}
								autoFocus
								disabled={props.okayBtnDisabled === true}>
								{props.okayBtnLabel || 'Okay'}
							</DelayedButton>
						)}
					</div>
				</div>
			</div>
		</CSSTransition>
	);
}
