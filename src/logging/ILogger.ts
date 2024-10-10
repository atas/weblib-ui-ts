
export default interface ILogger {
	verbose(log: string, ...args: any[]): void;

	info(log: string, ...args: any[]): void;

	warn(log: string, ...args: any[]): void;

	error(log: string, ...args: any[]): void;
}

export enum LogLevels {
	Verbose = 0,
	Info = 1,
	Warn = 2,
	Error = 3,
}