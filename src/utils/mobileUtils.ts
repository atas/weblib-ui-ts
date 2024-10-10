/**
 * This class checks if a mobile browser user tapped or not (in case of dragged etc)
 */
export class MobileTap {
	private started = 0;
	private moved = false;
	start() {
		this.started = +new Date();
		this.moved = false;
	}
	move() {
		this.moved = true;
	}
	tapped() {
		return !this.moved && +new Date() - this.started < 300;
	}
}
