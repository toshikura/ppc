import { swup } from '../../kritik/modules/swup';
import { createHomeCanvasGui } from './gui';
import PpcHomeCanvas from './webgl';

const container = document.querySelector('[data-ppc-canvas]');

if (!container) {
	throw new Error('PPC home canvas container was not found.');
}

const ppcHomeCanvas = new PpcHomeCanvas(container);
createHomeCanvasGui(ppcHomeCanvas);

function isHomeUrl(url) {
	const path = new URL(url, document.baseURI).pathname.replace(/\/$/, '') || '/';
	const home = new URL('./', document.baseURI).pathname.replace(/\/$/, '') || '/';
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

function applyHtmlBg(bg) {
	const current = document.documentElement.getAttribute('data-bg');
	if (bg === current) return;
	if (bg) {
		document.documentElement.setAttribute('data-bg', bg);
	} else {
		document.documentElement.removeAttribute('data-bg');
	}
}

syncPpcHomeCanvasToPage();
swup.hooks.on('visit:start', (visit) => {
	applyHtmlBg(isHomeUrl(visit.to.url) ? 'white' : 'black');
	if (isHomeUrl(visit.to.url)) return;
	ppcHomeCanvas.prepareLeaveTransition(visit.to.url);
});
swup.hooks.on('content:replace', (visit) => {
	applyHtmlBg(visit.to.document.documentElement.getAttribute('data-bg'));
});
swup.hooks.on('page:view', syncPpcHomeCanvasToPage);
