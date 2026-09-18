import { gsap } from 'gsap';
import { isMobile } from '../device';
import { PPC_HOME_CANVAS_PARAMS } from './params';
import UsagiGridScroll from '../lib/usagi-grid-scroll';

//
window.gsap = gsap;

//
export const HOME_BG_PLANE_Z = -2;

//
function getBlockAspect(block) {
	const parts = getComputedStyle(block)
		.aspectRatio.split('/')
		.map((n) => Number(n.trim()));
	if (parts.length === 1 && parts[0] > 0) {
		return { x: parts[0], y: 1 };
	}
	if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
		return { x: parts[0], y: parts[1] };
	}
	return { x: 1, y: 1 };
}


//
export function createHomeGrid(webgl) {
	destroyHomeGrid(webgl);

	const wrap = document.querySelector('.usg-grid');

	if (!wrap) {
		throw new Error('Home grid was not found.');
	}

	const block = wrap.querySelector('.usg-grid-block');

	if (!block) {
		throw new Error('Home grid block was not found.');
	}

	const speed = navigator.userAgent.toLowerCase().includes('windows')
		? PPC_HOME_CANVAS_PARAMS.speed * 1.2
		: PPC_HOME_CANVAS_PARAMS.speed;

	webgl.grid = new UsagiGridScroll({
		el: wrap,
		body: '.usg-grid-body',
		block: '.usg-grid-block',
		speed,
		ease: PPC_HOME_CANVAS_PARAMS.ease,
		grid: isMobile() ? PPC_HOME_CANVAS_PARAMS.grid.mobile : PPC_HOME_CANVAS_PARAMS.grid.base,
		scale: PPC_HOME_CANVAS_PARAMS.scale,
		autoScale: PPC_HOME_CANVAS_PARAMS.autoScale,
		aspect: getBlockAspect(block),
		autoscroll: PPC_HOME_CANVAS_PARAMS.autoscroll,
	});

	if (!webgl.grid.ready) {
		throw new Error('Home grid failed to start.');
	}

	syncGridInner(webgl);

	webgl.gridPointer = { x: 0, y: 0, moved: false };

	webgl.onGridPointerDown = (event) => {
		webgl.gridPointer.x = event.clientX;
		webgl.gridPointer.y = event.clientY;
		webgl.gridPointer.moved = false;
		const block = event.target.closest('.usg-grid-block');
		webgl.pendingLeaveEntry = block
			? webgl.entries.find((item) => item.el === block)
			: null;
	};

	webgl.onGridPointerMove = (event) => {
		const dx = event.clientX - webgl.gridPointer.x;
		const dy = event.clientY - webgl.gridPointer.y;
		if (dx * dx + dy * dy > 25) webgl.gridPointer.moved = true;
	};

	wrap.addEventListener('pointerdown', webgl.onGridPointerDown);
	window.addEventListener('pointermove', webgl.onGridPointerMove);

}

export function destroyHomeGrid(webgl) {
	if (webgl.grid) {
		webgl.grid.wrapElem.removeEventListener(
			'pointerdown',
			webgl.onGridPointerDown,
		);
		window.removeEventListener('pointermove', webgl.onGridPointerMove);
		webgl.grid.destroy();
		webgl.grid = null;
		webgl.innerSize = null;
		webgl.pivotSize = null;
	}
}

export function syncGridInner(webgl) {
	const target = webgl.grid.array[0].el.querySelector('.js-media-target');
	const wrap = webgl.grid.array[0].el.querySelector('.js-media-wrap');

	if (!target) {
		throw new Error('Home media target was not found.');
	}
	if (!wrap) {
		throw new Error('Home media wrap was not found.');
	}

	webgl.innerSize = {
		width: target.clientWidth,
		height: target.clientHeight,
	};
	webgl.pivotSize = {
		width: wrap.clientWidth,
		height: wrap.clientHeight,
	};
}

export function getPlaneSize(webgl, item) {
	const cellWidth = webgl.innerSize.width;
	const cellHeight = webgl.innerSize.height;
	const aspect = item.width / item.height;
	const width = Math.min(cellWidth, cellHeight * aspect);

	return {
		width,
		height: width / aspect,
	};
}

export function getEntryAlign(webgl, entry) {
	const width = webgl.container.clientWidth;
	const height = webgl.container.clientHeight;
	const cellWidth = webgl.grid.childWidth;
	const cellHeight = webgl.grid.childHeight;
	const planeSize = getPlaneSize(webgl, entry.item);

	return {
		x: entry.cell.left + cellWidth / 2 - width / 2,
		y: height / 2 - entry.cell.top - cellHeight / 2,
		width: planeSize.width,
		height: planeSize.height,
	};
}

export function positionEntries(webgl) {
	const width = webgl.container.clientWidth;
	const height = webgl.container.clientHeight;
	const cellWidth = webgl.grid.childWidth;
	const cellHeight = webgl.grid.childHeight;

	webgl.entries.forEach((entry) => {
		const cell = entry.cell;

		if (!cell.inview || cellWidth === 0 || cellHeight === 0) {
			entry.mesh.visible = false;
			entry.bgMesh.visible = false;
			return;
		}

		const planeSize = getPlaneSize(webgl, entry.item);
		const x = cell.left + cellWidth / 2 - width / 2;
		const y = height / 2 - cell.top - cellHeight / 2;
		entry.link.style.width = `${planeSize.width}px`;
		entry.link.style.height = `${planeSize.height}px`;

		entry.mesh.visible = true;
		entry.mesh.position.set(x, y, 0);
		entry.mesh.scale.set(planeSize.width, planeSize.height, 1);

		entry.bgMesh.visible = true;
		entry.bgMesh.position.set(x, y, HOME_BG_PLANE_Z);
		entry.bgMesh.scale.set(webgl.pivotSize.width, webgl.pivotSize.height, 1);
	});
}
