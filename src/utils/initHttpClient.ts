import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HttpError } from '../customTypes';
import ILogger from '../logging/ILogger';
import { IPopupActions } from '../popups/IPopupActions';
import { SimpleSnackbarVariant } from '../popups';

let _loadingFn: (status: boolean) => void;
let _popupActions: IPopupActions;
let _logger: ILogger;

const httpClient = Axios.create({
	timeout: 20000,
});

export const HttpClientFileUploadHeaders = {
	'Content-Type': 'multipart/form-data',
};

httpClient.interceptors.request.use(
	(request: InternalAxiosRequestConfig) => {
		_logger.verbose('httpClient request onFulfilled() called');
		_loadingFn(true);
		return request;
	},
	async function onRejected(error) {
		_logger.verbose('httpClient request onRejected() called');
		return Promise.reject(error);
	},
);

httpClient.interceptors.response.use(
	function onFulfilled(response: AxiosResponse) {
		_logger.verbose('httpClient response onFulfilled() called');
		_loadingFn(false);
		return response;
	},
	async function onRejected(error: AxiosError<{ error?: HttpError; errors?: HttpError[] }>) {
		_logger.verbose('httpClient response onRejected() called');
		_loadingFn(false);

		// Custom .NET HttpJsonError
		if (error.response?.data?.error) {
			const err: HttpError = error.response.data.error;
			_popupActions.snackbarMsg(err.message, SimpleSnackbarVariant.error);
			error.message = 'handled';
		}
		// .NET Validation errors
		else if (error.response?.data?.errors) {
			const err: HttpError = new HttpError(
				Object.values(error.response.data.errors)
					.map((v: any) => (Array.isArray(v) ? v[0] : v?.toString()))
					.join(','),
			);
			_popupActions.snackbarMsg(err.message, SimpleSnackbarVariant.error);
			error.message = 'handled';
		} else if (error.code === 'ECONNABORTED') {
			_popupActions.snackbarMsg(
				'Connectivity issue, please check your internet.',
				SimpleSnackbarVariant.error,
			);
		} else {
			_popupActions.snackbarMsg('Unknown error happened.', SimpleSnackbarVariant.error);
		}

		return Promise.reject(error);
	},
);

export function initHttpClient(
	loadingFn: (status: boolean) => void,
	popupActions: IPopupActions,
	logger: ILogger,
) {
	_loadingFn = loadingFn;
	_popupActions = popupActions;
	_logger = logger;

	return httpClient;
}
