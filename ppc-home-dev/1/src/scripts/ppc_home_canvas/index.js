import { swup } from '../swup';
import { createHomeCanvasGui } from './gui';
import PpcHomeCanvas from './webgl';

const container = document.querySelector('[data-ppc-home-canvas]');

if (!container) {
	throw new Error('PPC home canvas container was not found.');
}

const ppcHomeCanvas = new PpcHomeCanvas(container);
createHomeCanvasGui(ppcHomeCanvas);

function isHomeUrl(url) {
	const path = new URL(url, window.location.origin).pathname.replace(/\/$/, '') || '/';
	const home = String(import.meta.env.BASE_URL).replace(/\/$/, '') || '/';
	return path === home;
}

function getPageType() {
	if (document.querySelector('[data-page="home"]')) return 'home';
	if (document.querySelector('[data-transition-target][data-project-id]')) {
		return 'single';
	}
	return 'other';
}

function syncPpcHomeCanvasToPage() {
	const type = getPageType();
	ppcHomeCanvas.setPageType(type);
	ppcHomeCanvas.setActive(type === 'home');
}

syncPpcHomeCanvasToPage();
swup.hooks.on('visit:start', (visit) => {
	if (isHomeUrl(visit.to.url)) return;
	ppcHomeCanvas.prepareLeaveTransition(visit.to.url);
});
swup.hooks.on('page:view', syncPpcHomeCanvasToPage);
