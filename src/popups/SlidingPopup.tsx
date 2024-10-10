import * as React from 'react';
import { useRef } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { DelayedButtonBaseProps } from '../components';
import ILogger from '../logging/ILogger';
import * as detectBrowser from '../utils/detectBrowser';

let DelayedButton: React.FC<DelayedButtonBaseProps>;
let _navigate: NavigateFunction;
let _logger: ILogger;

export interface SlidingPopupProps {
	isOpen: boolean;
	title?: string;
	onPopupClosed?: () => void;
	children: () => React.ReactNode;
	disableClosing?: boolean;
}

let dragState = {
	toolbarDragStartY: 0,
	toolbarDragExcessY: 0,
};

function setDragState(state: typeof dragState, ref: React.RefObject<HTMLDivElement>) {
	dragState = state;

	if (ref.current) {
		ref.current.style.bottom = state.toolbarDragStartY - state.toolbarDragExcessY + 'px';
	}
}

/**
 * Sliding Popup is outputted where it is called
 * @param props
 * @constructor
 */
function SlidingPopup(props: SlidingPopupProps) {
	const [state, setState] = React.useState({
		isTouchDevice: detectBrowser.isTouchDevice(),
	});
	const popupBackdropRef = useRef<HTMLDivElement>(null);
	const contentsDivRef = useRef<HTMLDivElement>(null);

	const toolbarRef = useRef<HTMLDivElement>(null);

	function init() {
		_logger.info('Opening sliding popup, attaching event listeners etc.');
		// Add root level ESC key event handler
		document.addEventListener<'keydown'>('keydown', onEscPress);
		location.hash = 'popup';
		setDragState({ toolbarDragStartY: 0, toolbarDragExcessY: 0 }, contentsDivRef);

		setTimeout(() => {
			_logger.verbose('Attaching hashchange event listener with a delay');
			// window.addEventListener('hashchange', onHashChange, { once: true });
			window.onhashchange = onHashChange;
		}, 50);

		if (state.isTouchDevice && props.disableClosing !== true) {
			_logger.info('Adding touch events');
			toolbarRef.current?.addEventListener('touchstart', e => onToolbarTouchStart(e), {
				passive: false,
			});
			toolbarRef.current?.addEventListener('touchmove', e => onToolbarTouchMove(e), {
				passive: true,
			});
			toolbarRef.current?.addEventListener('touchend', e => onToolbarTouchEnd(e), {
				passive: false,
			});
		}
	}

	function closeBtnClick() {
		_logger.info('Sliding popup closeBtnClick()');
		closePopup();
	}

	const onEscPress = (e: KeyboardEvent) => {
		_logger.info('OnEscPress captured.');
		e.key === 'Escape' && closePopup();
	};

	const onHashChange = (e: HashChangeEvent) => {
		e.stopPropagation();
		_logger.info('Closing sliding popup on hashchange.');
		closePopup();
	};

	/**
	 * Closes the opened menu popup
	 * @param isInstant Close the popup instantly or not
	 * @returns
	 */
	function closePopup() {
		_logger.info('Closing sliding popup removing event listeners.');
		// Remove root-level ESC key event handler
		document.removeEventListener<'keydown'>('keydown', onEscPress);
		// window.removeEventListener<'hashchange'>('hashchange', onHashChange, false);
		window.onhashchange = null;
		_logger.info('Removed hashchange event listener.');

		_navigate(window.location.pathname + window.location.search, {
			replace: true,
		});

		// location.hash = ''; // use browserHistory.replace to not to scroll the page up

		props.onPopupClosed && props.onPopupClosed();
	}

	// run init() when props.isOpen changed to true and run closePopup() when props.isOpen changed to false
	React.useEffect(() => {
		_logger.verbose('Running Sliding popup useEffect on change of props.isOpen:', props.isOpen);
		if (props.isOpen) {
			_logger.verbose('Opening sliding popup as props.isOpen is true.');
			init();
		} else {
			_logger.info('Closing sliding popup as props.isOpen is false.');
			closePopup();
		}
	}, [props.isOpen]);

	// convert below componentWillUnmount to React.useEffect
	React.useEffect(
		() => () => {
			_logger.info('Unmounting sliding popup, removing event listeners.');
			closePopup(); //just in case we are getting unmounted without the regular closePopup flow, like a page change.
		},
		[],
	);

	function onToolbarTouchStart(e: TouchEvent) {
		// e.stopPropagation();
		// e.preventDefault();
		_logger.verbose('onTouchStart()');
		const y = e.touches[0].clientY;
		setDragState({ toolbarDragStartY: y, toolbarDragExcessY: y }, contentsDivRef);
	}

	function onToolbarTouchMove(e: TouchEvent) {
		e.stopPropagation();
		_logger.verbose('onTouchMove()');
		const y = e.touches[0].clientY;

		setDragState(
			{
				...dragState,
				toolbarDragExcessY:
					y > dragState.toolbarDragStartY ? y : dragState.toolbarDragStartY,
			},
			contentsDivRef,
		);
	}

	function onToolbarTouchEnd(e: TouchEvent) {
		_logger.verbose('onTouchEnd()');

		if (dragState.toolbarDragExcessY - dragState.toolbarDragStartY > 50) {
			e.stopPropagation();
			e.preventDefault();
			closePopup();
			return;
		}

		setDragState({ toolbarDragStartY: 0, toolbarDragExcessY: 0 }, contentsDivRef);
	}

	function getTitlesArr() {
		return !Array.isArray(props.title) ? [props.title] : props.title;
	}

	return (
		<CSSTransition
			nodeRef={popupBackdropRef}
			in={props.isOpen}
			timeout={300}
			unmountOnExit
			mountOnEnter>
			<div ref={popupBackdropRef} className={'popupBackdrop'}>
				<div ref={contentsDivRef} className="slidingPopupContents">
					{props.disableClosing != true && (
						<DelayedButton
							onDelayedClick={() => {
								_logger.info('running onDelayedClick');
								closeBtnClick();
							}}
							className="close">
							<span className="material-icons-outlined">close</span>
						</DelayedButton>
					)}

					<div ref={toolbarRef} className="toolBar">
						{state.isTouchDevice && props.disableClosing !== true && (
							<div className="dragBar"></div>
						)}

						<div className="popupTitles">
							<div className={`title active`}>{props.title}</div>
						</div>

						<div className="clear"></div>
					</div>

					<div className="child">{props.children()}</div>
				</div>
			</div>
		</CSSTransition>
	);
}

/**
 * Sliding Popup is outputted where it is called
 * @param navigate
 * @param delayedButton
 * @param logger
 */
export function initSlidingPopup(
	navigate: NavigateFunction,
	delayedButton: React.FC<DelayedButtonBaseProps>,
	logger: ILogger,
) {
	DelayedButton = delayedButton;
	_navigate = navigate;
	_logger = logger;
	return SlidingPopup;
}
