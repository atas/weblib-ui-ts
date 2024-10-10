import { Logger, LogLevels } from '../logging';

/**
 * Sets viewportHeight CSS because iOS Safari incudes bottom bar in viewport height
 * Attach to event handlers:
 * window.addEventListener('resize', setViewportHeight);
 * window.addEventListener('orientationchange', setViewportHeight);
 *
 * CSS Usage: @vh100: calc(var(--vh, 1vh) * 100);
 * height: @100vh;
 */
export default function setViewportHeight(logLevel: LogLevels = LogLevels.Info) {
	const logger = new Logger('setViewportHeight', logLevel);

	// Calculate the viewport height (1vh equivalent) in pixels
	const vh = window.innerHeight * 0.01;

	// Set the CSS variable on the root document
	document.documentElement.style.setProperty('--vh', `${vh}px`);
	logger.info('Setting Viewport Height: ', vh, 'px');
}
