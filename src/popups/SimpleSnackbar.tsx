import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IPopupActions } from './IPopupActions';

interface SharedSimpleSnackbarProps {
	snackbarMsg?: string;
	snackbarVariant?: SimpleSnackbarVariant;
	snackbarTimeout?: number;
	popupActions: IPopupActions;
}

export enum SimpleSnackbarVariant {
	error = 'error',
	info = 'info',
	success = 'success',
	warning = 'warning',
}

export const initSimpleSnackbar: React.FC<SharedSimpleSnackbarProps> = ({
	snackbarMsg,
	snackbarVariant,
	snackbarTimeout,
	popupActions,
}) => {
	const snackbarRef = useRef<SimpleSnackbarMethods>(null);

	useEffect(() => {
		if (snackbarMsg && snackbarRef.current) {
			snackbarRef.current.show(snackbarMsg, snackbarVariant, snackbarTimeout);
			popupActions.snackbarMsg();
		}
	}, [snackbarMsg]);

	return <SimpleSnackbar ref={snackbarRef} />;
};

interface SimpleSnackbarState {
	isOpen: boolean;
	message?: string;
	variant?: SimpleSnackbarVariant;
}

export interface SimpleSnackbarMethods {
	show: ShowFnType;
}

type ShowFnType = (msg: string, variant?: SimpleSnackbarVariant, timeout?: number) => void;

export const SimpleSnackbar = forwardRef((props: {}, ref: React.Ref<SimpleSnackbarMethods>) => {
	const [state, setState] = useState<SimpleSnackbarState>({ isOpen: false });
	const timeoutRef = useRef<number | null>(null);

	const show: ShowFnType = (msg, variant, timeout) => {
		setState({
			...state,
			message: msg,
			variant: variant,
			isOpen: true,
		});

		if (!timeout && timeout !== 0 && timeout !== -1) {
			timeoutRef.current = window.setTimeout(() => closeSnackbar(), timeout ?? 8000);
		}
	};

	useImperativeHandle(ref, () => ({ show }));

	const closeSnackbar = (event?: React.SyntheticEvent<any>, reason?: string) => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		if (reason !== 'clickaway') {
			setState({ ...state, isOpen: false });
		}
	};

	const getVariantIcon = () => {
		if (state.variant === SimpleSnackbarVariant.success) return 'check';
		return state.variant?.toString();
	};

	if (!state.isOpen) return null;

	return (
		<div className={`simpleSnackbar ${state.variant}`} onClick={e => closeSnackbar(e)}>
			<div className="icon material-icons-outlined">{getVariantIcon()}</div>
			<div className="text">{state.message}</div>
			<button key="close" onClick={closeSnackbar} className="close">
				<span className="material-icons-outlined">close </span>
			</button>
		</div>
	);
});
