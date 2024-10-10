import ILogger, { LogLevels } from './ILogger';

export default class Logger implements ILogger {
	private readonly prepend?: string | (() => string);
	private readonly append?: string | (() => any);
	private readonly type: { new (...args: any[]): any } | Function | { name: string };
	private readonly logLevel: LogLevels;

	public verboseStyle = 'background: #FFF; color: #999';
	public infoStyle = 'background: #c9e1ff; color: #000';
	public warnStyle = 'background: #ffae63; color: #000';
	public errorStyle = 'background: #ffae63; color: #000';

	constructor(
		type: { new (...args: any[]): any } | Function | string,
		logLevel: LogLevels,
		prepend?: string | (() => string),
		append?: string | (() => any),
	) {
		this.logLevel = logLevel;
		this.prepend = prepend;
		this.append = append;
		this.type = typeof type === 'string' ? { name: type } : type;
	}

	verbose(log: string, ...args: any[]) {
		if (this.logLevel > LogLevels.Verbose) return;

		if (typeof this.append === 'function') args.push(this.append());

		if (args.length > 0) {
			console.log('%c' + this.generateLog(log, LogLevels.Verbose), this.verboseStyle, args);
		} else {
			console.log('%c' + this.generateLog(log, LogLevels.Verbose), this.verboseStyle);
		}
	}

	info(log: string, ...args: any[]) {
		if (this.logLevel > LogLevels.Info) return;

		if (typeof this.append === 'function') args.push(this.append());

		console.log('%c' + this.generateLog(log, LogLevels.Info), this.infoStyle, ...args);
	}

	warn(log: string, ...args: any[]) {
		if (this.logLevel > LogLevels.Warn) return;

		if (typeof this.append === 'function') args.push(this.append());

		console.warn('%c' + this.generateLog(log, LogLevels.Warn), this.warnStyle, ...args);
	}

	error(log: string, ...args: any[]) {
		if (this.logLevel > LogLevels.Error) return;

		if (typeof this.append === 'function') args.push(this.append());

		console.error('%c' + this.generateLog(log, LogLevels.Error), this.errorStyle, ...args);
	}

	private generateLog(log: string, level: LogLevels) {
		let prepend = 'Logger#' + this.type.name + `[${LogLevels[level]}]: `;
		let append = '';

		if (typeof this.prepend === 'string') prepend += this.prepend;
		if (typeof this.prepend === 'function') prepend += this.prepend() + ' ';

		if (typeof this.append === 'string') append = ' # ' + this.append;

		return prepend + log + append;
	}
}
