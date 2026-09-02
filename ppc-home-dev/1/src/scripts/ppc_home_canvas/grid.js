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
	});

	if (!webgl.grid.ready) {
		throw new Error('Home grid failed to start.');
	}

	webgl.gridPointer = { x: 0, y: 0, moved: false };

	webgl.onGridPointerDown = (event) => {
		webgl.gridPointer.x = event.clientX;
		webgl.gridPointer.y = event.clientY;
		webgl.gridPointer.moved = false;
	};

	webgl.onGridPointerMove = (event) => {
		const dx = event.clientX - webgl.gridPointer.x;
		const dy = event.clientY - webgl.gridPointer.y;
		if (dx * dx + dy * dy > 25) webgl.gridPointer.moved = true;
	};

	wrap.addEventListener('pointerdown', webgl.onGridPointerDown);
	window.addEventListener('pointermove', webgl.onGridPointerMove);

	webgl.grid.on('update', function () {
		this.wrapElem.style.setProperty('--usg-gs-x', this.acceleration.pow1.x);
		this.wrapElem.style.setProperty('--usg-gs-y', this.acceleration.pow1.y);
		this.wrapElem.style.setProperty('--usg-gs-d', this.acceleration.pow1.d);
	});
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
	}
}

export function getPlaneSize(webgl, item, rect) {
	const cellWidth = rect ? rect.width : webgl.grid.childWidth;
	const cellHeight = rect ? rect.height : webgl.grid.childHeight;
	const aspect = item.width / item.height;
	const width = Math.min(cellWidth, cellHeight * aspect);

	return {
		width,
		height: width / aspect,
	};
}

export function positionEntries(webgl) {
	const width = webgl.container.clientWidth;
	const height = webgl.container.clientHeight;

	webgl.entries.forEach((entry) => {
		if (entry.el.dataset.visible === '0') {
			entry.mesh.visible = false;
			return;
		}

		const rect = entry.link.parentElement.getBoundingClientRect();

		if (rect.width === 0 || rect.height === 0) {
			entry.mesh.visible = false;
			return;
		}

		const planeSize = getPlaneSize(webgl, entry.item, rect);
		const x = rect.left + rect.width / 2 - width / 2;
		const y = height / 2 - rect.top - rect.height / 2;
		entry.link.style.width = `${planeSize.width}px`;
		entry.link.style.height = `${planeSize.height}px`;

		entry.mesh.visible = true;
		entry.mesh.position.set(x, y, 0);
		entry.mesh.scale.set(planeSize.width, planeSize.height, 1);
	});
}
