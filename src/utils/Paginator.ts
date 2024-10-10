// export type UpdaterFn = (limit: number, offset: number) => void;

// export default class Paginator {
// 	private updaterFn: UpdaterFn | null = null;

// 	private currentOffset = 0;
// 	private limit = 10;

// 	private isLoading = false;
// 	private done = false;

// 	constructor(limit: number) {
// 		this.limit = limit;
// 	}

// 	setUpdater(func: UpdaterFn) {
// 		this.updaterFn = func;
// 	}

// 	onScrollEvent() {
// 		const self = this;
// 		if (self.done) {
// 			return;
// 		}

// 		const hT = document.querySelector<HTMLElement>('.footerBar')?.offsetTop,
// 			hH = document.querySelector<HTMLElement>('.footerBar')?.offsetHeight,
// 			wH = window.innerHeight,
// 			wS = this.scrollTop;

// 		if (wS! > hT + hH! - wH! && self.isLoading === false) {
// 			self.loadMore();
// 		}
// 	}

// 	mount() {
// 		window.addEventListener('scroll', this.onScrollEvent);
// 	}

// 	unmount() {
// 		window.removeEventListener('scroll', this.onScrollEvent);
// 	}

// 	/**
// 	 * Don't try to load anymore.
// 	 */
// 	setDone() {
// 		this.done = true;
// 	}

// 	clear() {
// 		this.currentOffset = 0;
// 		this.done = false;
// 	}

// 	async loadMore() {
// 		this.isLoading = true;
// 		const currentOffset = this.currentOffset;
// 		this.currentOffset += this.limit;
// 		await this.updaterFn!(this.limit, currentOffset);
// 		this.isLoading = false;
// 	}
// }
