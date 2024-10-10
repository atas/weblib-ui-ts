import * as React from 'react';
import { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { DelayedButtonBaseProps } from '../components';
import { IPopupActions } from './IPopupActions';
import { Logger, LogLevels } from '../logging';

let _popupActions: IPopupActions;
let getDelayedButton: () => React.ComponentType<DelayedButtonBaseProps>;

export interface GlobalAlertPopupProps {
	title?: string;
	content?: string | (() => React.ReactElement);
	okayBtn?: string;
	okayBtnClick?: () => void;
	cancelBtn?: string | null;
	cancelBtnClick?: () => void;
	hideTopCloseButton?: boolean;
	isOpen?: boolean;
	actionCountdownSeconds?: number;
	resetValues?: boolean;
}

interface State {
	actionCountdown?: number;
	actionCountdownTimer?: NodeJS.Timeout | number;
}

export function initGlobalAlertPopupBase(
	popupActions: IPopupActions,
	getDelayedButtonFn: () => React.ComponentType<DelayedButtonBaseProps>,
) {
	_popupActions = popupActions;
	getDelayedButton = getDelayedButtonFn;

	return GlobalAlertPopupBase;
}

/**
 * Global Alert Popup is controlled by Redux and there is only one instance can be available.
 */
const GlobalAlertPopupBase = (props: GlobalAlertPopupProps) => {
	const [state, setState] = React.useState<State>({});
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const prevProps = useRef({ isOpen: props.isOpen, content: props.content });

	const logger = new Logger(GlobalAlertPopupBase, LogLevels.Info);

	const cancelBtnClick = () => {
		_popupActions.popupMsg({ isOpen: false });

		// If there is a subscriber for cancel button click event
		if (props.cancelBtnClick) {
			props.cancelBtnClick();
		}
	};

	const okayBtnClick = () => {
		_popupActions.popupMsg({ isOpen: false });

		if (props.okayBtnClick) {
			props.okayBtnClick();
		}
	};

	const onExited = () => {
		_popupActions.resetPopupMsg();
		setState(prevState => ({ ...prevState, actionCountdown: undefined }));
	};

	const onEnter = () => {
		logger.info('GlobalAlertPopupBase onEnter');
		manageCountdown();
	};

	const manageCountdown = () => {
		logger.info('manageCountdown()');
		if (props.actionCountdownSeconds) {
			logger.info('Action countdown will be set:', props.actionCountdownSeconds);
			const actionCountdownTimer = setInterval(() => {
				setState(prevState => {
					if (prevState.actionCountdown && prevState.actionCountdown > 0) {
						logger.info('Action countdown:', prevState.actionCountdown);
						return {
							...prevState,
							actionCountdown: prevState.actionCountdown - 1,
						};
					} else {
						logger.info('Action countdown is over.');
						clearInterval(prevState.actionCountdownTimer);
						return prevState;
					}
				});
			}, 1000);

			setState(prevState => ({
				...prevState,
				actionCountdown: props.actionCountdownSeconds,
				actionCountdownTimer,
			}));
		}
	};

	// Check conditions for initializing or reinitializing the countdown when contents change
	useEffect(() => {
		if (
			prevProps.current.isOpen &&
			props.isOpen &&
			prevProps.current.content !== props.content
		) {
			manageCountdown();
		}

		prevProps.current = { isOpen: props.isOpen, content: props.content };
	}, [props.isOpen, props.content, props.actionCountdownSeconds]);

	const DelayedButton = getDelayedButton();

	return (
		<CSSTransition
			nodeRef={wrapperRef}
			in={props.isOpen || false}
			timeout={200}
			unmountOnExit
			onEnter={() => onEnter()}
			onExited={() => onExited()}>
			<div ref={wrapperRef} className="popupBackdrop">
				<div className="standardPopupContents">
					<div className="toolBar">
						{!props.hideTopCloseButton && (
							<DelayedButton onDelayedClick={cancelBtnClick} className="close">
								<span className="material-icons-outlined">close</span>
							</DelayedButton>
						)}
						<div className="text">{props.title}</div>
					</div>

					<div className="child">
						{typeof props.content === 'string' && props.content}
						{typeof props.content === 'function' && props.content()}
					</div>

					<div className="actions">
						{props.cancelBtn !== null && (
							<DelayedButton onDelayedClick={cancelBtnClick} className="main grey">
								{props.cancelBtn || 'Cancel'}
							</DelayedButton>
						)}
						<DelayedButton
							onDelayedClick={okayBtnClick}
							disabled={!!state.actionCountdown && state.actionCountdown > 0}
							className="main"
							autoFocus>
							{props.okayBtn || 'Okay'}{' '}
							{!!state.actionCountdown &&
								state.actionCountdown > 0 &&
								`(${state.actionCountdown})`}
						</DelayedButton>
					</div>
				</div>
			</div>
		</CSSTransition>
	);
};
