import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { swup } from '../swup';

export const lenis = new Lenis();

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

function syncLenisToPage() {
	const isHome = document.querySelector('[data-page="home"]') !== null;
	document.documentElement.classList.toggle('is-home', isHome);

	if (isHome) {
		lenis.scrollTo(0, { immediate: true, force: true });
		lenis.stop();
	} else {
		lenis.start();
	}
}

requestAnimationFrame(raf);
syncLenisToPage();
swup.hooks.on('page:view', syncLenisToPage);
