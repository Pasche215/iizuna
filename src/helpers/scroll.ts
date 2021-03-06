/**
 * @description
 * A simple function that scrolls the the page to the given destination with the passed easing animation
 * @param {number|HTMLElement} destination Either the Target element or the scroll position in pixels
 * @param {number} duration The animation duration
 * @param {string} easing The easing function which should be used for the scrolling
 * @param {()} callback
 * @return {void}
 * @deprecated is potentially being removed in the next major update!
 *
 * @see https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
 */
export function smoothScroll(destination: any, duration = 500, easing = 'linear', callback = () => {}) {

	const easings = {
		linear(t: number) {
			return t;
		},
		easeInQuad(t: number) {
			return t * t;
		},
		easeOutQuad(t: number) {
			return t * (2 - t);
		},
		easeInOutQuad(t: number) {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		},
		easeInCubic(t: number) {
			return t * t * t;
		},
		easeOutCubic(t: number) {
			return (--t) * t * t + 1;
		},
		easeInOutCubic(t: number) {
			return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
		},
		easeInQuart(t: number) {
			return t * t * t * t;
		},
		easeOutQuart(t: number) {
			return 1 - (--t) * t * t * t;
		},
		easeInOutQuart(t: number) {
			return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
		},
		easeInQuint(t: number) {
			return t * t * t * t * t;
		},
		easeOutQuint(t: number) {
			return 1 + (--t) * t * t * t * t;
		},
		easeInOutQuint(t: number) {
			return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
		}
	};

	const start = window.pageYOffset;
	const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

	const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
	const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

	if ('requestAnimationFrame' in window === false) {
		window.scroll(0, destinationOffsetToScroll);
		if (callback) {
			callback();
		}
		return;
	}

	function scroll() {
		const now = 'now' in window.performance ? performance.now() : new Date().getTime();
		const time = Math.min(1, ((now - startTime) / duration));
		const timeFunction = (easings as any)[easing](time);
		window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

		if (window.pageYOffset === destinationOffsetToScroll) {
			if (callback) {
				callback();
			}
			return;
		}

		requestAnimationFrame(scroll);
	}

	scroll();
}