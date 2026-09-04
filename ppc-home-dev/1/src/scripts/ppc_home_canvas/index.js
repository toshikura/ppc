import { swup } from '../swup';
import { createHomeCanvasGui } from './gui';
import PpcHomeCanvas from './webgl';

const container = document.querySelector('[data-ppc-home-canvas]');

if (!container) {
	throw new Error('PPC home canvas container was not found.');
}

const ppcHomeCanvas = new PpcHomeCanvas(container);
createHomeCanvasGui(ppcHomeCanvas);

function syncPpcHomeCanvasToPage() {
	ppcHomeCanvas.setActive(
		document.querySelector('[data-page="home"]') !== null,
	);
}

syncPpcHomeCanvasToPage();
swup.hooks.on('page:view', syncPpcHomeCanvasToPage);
