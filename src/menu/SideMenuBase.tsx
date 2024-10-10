import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Logger, LogLevels } from '../logging';
import { detectBrowser } from '../utils';

let slidingState = {
	contentsDivMoveXAxis: 0,
	touchExcessX: 0,
	touchStartX: 0,
};

interface Props {
	children: React.ReactNode;
	logLevel: LogLevels;
	closeMenuFn(): void;
	showSideMenu: boolean;
}

export function SideMenuBase(props: Props) {
	const contentsRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);

	const logger = new Logger('SideMenu', props.logLevel);

	const onEnter = () => {
		document.addEventListener<'keydown'>('keydown', onEscPress);

		if (detectBrowser.isTouchDevice()) {
			backdropRef.current?.addEventListener('touchstart', handleTouchStart, {
				passive: false,
			});
			backdropRef.current?.addEventListener('touchmove', handleTouchMove, {
				passive: true,
			});
			backdropRef.current?.addEventListener('touchend', handleTouchEnd, {
				passive: false,
			});
		}
	};

	const handleTouchStart = (e: TouchEvent) => {
		const x = e.touches[0].clientX;
		logger.verbose('TouchStart event fired. at', x);

		slidingState = {
			touchStartX: x,
			touchExcessX: x,
			contentsDivMoveXAxis: 0,
		};
	};

	const handleTouchMove = (e: TouchEvent) => {
		e.stopPropagation();
		const x = e.touches[0].clientX;

		const contentsDivMoveXAxis = slidingState.touchStartX - x;
		logger.verbose('x, state.touchStartX', x, slidingState.touchStartX);

		slidingState = {
			...slidingState,
			touchExcessX: x,
			contentsDivMoveXAxis: contentsDivMoveXAxis < 0 ? contentsDivMoveXAxis : 0,
		};

		if (contentsRef.current) {
			contentsRef.current.style.right =
				contentsDivMoveXAxis < 0 ? `${contentsDivMoveXAxis}px` : '0px';
		}
	};

	const handleTouchEnd = (e: TouchEvent) => {
		logger.verbose(
			'TouchEnd event fired. touchStartX, touchExcessX',
			slidingState.touchStartX,
			slidingState.touchExcessX,
		);

		if (slidingState.touchExcessX - slidingState.touchStartX > 100) {
			e.stopPropagation();
			e.preventDefault();
			props.closeMenuFn();
		} else {
			slidingState = {
				...slidingState,
				contentsDivMoveXAxis: 0,
			};
			if (contentsRef.current) {
				contentsRef.current.style.right = '0';
			}
		}
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		props.closeMenuFn();
	};

	const onExit = () => {
		document.removeEventListener<'keydown'>('keydown', onEscPress);
	};

	const onExited = () => {
		logger.info("SideMenu's onExited fired.");
		slidingState = {
			contentsDivMoveXAxis: 0,
			touchExcessX: 0,
			touchStartX: 0,
		};
	};

	const onEscPress = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			props.closeMenuFn();
		}
	};

	return (
		<CSSTransition
			in={props.showSideMenu}
			nodeRef={backdropRef}
			timeout={200}
			unmountOnExit
			mountOnEnter
			onEnter={onEnter}
			onExit={onExit}
			onExited={onExited}>
			<div
				ref={backdropRef}
				onClick={handleBackdropClick}
				className={`popupBackdrop sideMenu`}>
				<div
					ref={contentsRef}
					onClick={e => e.stopPropagation()}
					style={{ right: slidingState.contentsDivMoveXAxis + 'px' }}
					className="contents">
					{props.children}
				</div>
			</div>
		</CSSTransition>
	);
}
