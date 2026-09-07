import { gsap } from 'gsap';
import { PPC_HOME_CANVAS_PARAMS } from './params';
import UsagiGridScroll from './lib/usagi-grid-scroll';

window.gsap = gsap;

export function createHomeGrid(webgl) {
	destroyHomeGrid(webgl);

	const wrap = document.querySelector('.usg-grid');

	if (!wrap) {
		throw new Error('Home grid was not found.');
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
		grid: PPC_HOME_CANVAS_PARAMS.grid,
		scale: PPC_HOME_CANVAS_PARAMS.scale,
		autoScale: PPC_HOME_CANVAS_PARAMS.autoScale,
		aspect: PPC_HOME_CANVAS_PARAMS.aspect,
		autoscroll: PPC_HOME_CANVAS_PARAMS.autoscroll,
	});

	if (!webgl.grid.ready) {
		throw new Error('Home grid failed to start.');
	}

	syncGridPadding(webgl);

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

	// webgl.grid.on('update', function () {
	// 	this.wrapElem.style.setProperty('--usg-gs-x', this.acceleration.pow1.x);
	// 	this.wrapElem.style.setProperty('--usg-gs-y', this.acceleration.pow1.y);
	// 	this.wrapElem.style.setProperty('--usg-gs-d', this.acceleration.pow1.d);
	// });
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
		webgl.gridPadding = null;
	}
}

export function syncGridPadding(webgl) {
	const cell = webgl.grid.array[0];
	const style = getComputedStyle(cell.el);

	webgl.gridPadding = {
		x: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
		y: parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
	};
}

export function getPlaneSize(webgl, item) {
	const cellWidth = webgl.grid.childWidth - webgl.gridPadding.x;
	const cellHeight = webgl.grid.childHeight - webgl.gridPadding.y;
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
	});
}
