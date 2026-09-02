import * as THREE from 'three';
import { gsap } from 'gsap';
import { PPC_HOME_CANVAS_PARAMS } from './params';
import {
	createHomeGrid,
	destroyHomeGrid,
	getPlaneSize,
	positionEntries,
} from './grid';
import { animateToTransitionTarget } from './transition';

export default class PpcHomeCanvas {
	constructor(container) {
		this.container = container;
		this.items = window.firstData.top.items;
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.geometry = new THREE.PlaneGeometry(1, 1, 32, 20);
		this.textures = [];
		this.entries = [];
		this.links = [];
		this.grid = null;
		this.loadPromise = null;
		this.rafId = null;
		this.transitionEntry = null;
		this.transitionTimeline = null;
		this.transitioning = false;
		this.active = container.dataset.active === 'true';

		this.camera.position.z = 10;
		this.renderer.setPixelRatio(
			Math.min(window.devicePixelRatio, 2) * PPC_HOME_CANVAS_PARAMS.res,
		);
		this.renderer.setClearColor(0x000000, 0);
		this.renderer.domElement.setAttribute('aria-hidden', 'true');
		this.container.appendChild(this.renderer.domElement);

		this.resize = this.resize.bind(this);
		this.render = this.render.bind(this);
		this.tick = this.tick.bind(this);
		this.onLinkClick = this.onLinkClick.bind(this);

		window.addEventListener('resize', this.resize);
		this.resize();
	}

	activateHome() {
		createHomeGrid(this);
		this.loadPlanes().then(() => {
			if (!this.active || !this.grid) return;
			this.syncMeshesToGrid();
			this.syncLinks();
			this.startLoop();
			this.resize();
		});
	}

	loadPlanes() {
		if (this.loadPromise) return this.loadPromise;

		const textureLoader = new THREE.TextureLoader();
		this.loadPromise = Promise.all(
			this.items.map((item, index) => {
				if (item.media !== 'image') {
					throw new Error(`Unsupported media type: ${item.media}`);
				}

				const { width } = getPlaneSize(this, item);
				const source = this.selectSource(
					item.sources,
					width * this.renderer.getPixelRatio(),
				);

				return textureLoader.loadAsync(source.url).then((texture) => ({
					item,
					index,
					texture,
				}));
			}),
		).then((loadedItems) => {
			loadedItems.forEach(({ index, texture }) => {
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.generateMipmaps = false;
				texture.minFilter = THREE.LinearFilter;
				this.textures[index] = texture;
			});
		});

		return this.loadPromise;
	}

	selectSource(sources, requiredWidth) {
		return (
			sources.find(({ width }) => width >= requiredWidth) ??
			sources[sources.length - 1]
		);
	}

	createPlane(item, index, texture, el, link) {
		const material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
		});
		const mesh = new THREE.Mesh(this.geometry, material);
		this.scene.add(mesh);

		this.entries.push({ item, index, mesh, el, link });
	}

	syncMeshesToGrid() {
		this.entries.forEach(({ mesh }) => {
			this.scene.remove(mesh);
			mesh.material.dispose();
		});
		this.entries = [];

		this.grid.array.forEach((cell) => {
			const link = cell.el.querySelector('[data-ppc-home-link]');
			const index = Number(link.dataset.index);
			this.createPlane(
				this.items[index],
				index,
				this.textures[index],
				cell.el,
				link,
			);
		});
	}

	syncLinks() {
		this.links = [];

		this.grid.array.forEach((cell) => {
			const link = cell.el.querySelector('[data-ppc-home-link]');
			this.links.push(link);
			link.addEventListener('click', this.onLinkClick);
		});
	}

	onLinkClick(event) {
		if (this.gridPointer.moved) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		const block = event.currentTarget.closest('.usg-grid-block');
		const entry = this.entries.find((item) => item.el === block);

		if (!entry) {
			throw new Error(
				`Home Plane ${event.currentTarget.dataset.index} was not found.`,
			);
		}

		this.startTransition(entry);
	}

	startTransition(entry) {
		if (this.transitioning) return;

		this.transitioning = true;
		this.transitionEntry = entry;
		document.documentElement.classList.add('is-ppc-home-transition');
		entry.mesh.position.z = 1;
		this.grid.stop();

		const otherMaterials = this.entries
			.filter((item) => item !== entry)
			.map(({ mesh }) => mesh.material);
		const fadeout = PPC_HOME_CANVAS_PARAMS.animation.transition.fadeout;

		gsap.to(otherMaterials, {
			opacity: 0,
			duration: this.getTransitionDuration(fadeout.duration),
			ease: fadeout.ease,
			onUpdate: this.render,
		});
	}

	completeTransition() {
		this.transitionEntry.mesh.visible = false;
		this.transitionEntry.mesh.position.z = 0;
		this.container.dataset.active = 'false';
		document.documentElement.classList.remove('is-ppc-home-transition');
		this.transitionTimeline = null;
		this.transitionEntry = null;
		this.transitioning = false;
		this.render();
	}

	getTransitionDuration(duration) {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 0
			: duration;
	}

	resetPlanes() {
		gsap.killTweensOf(this.entries.map(({ mesh }) => mesh.material));
		if (this.transitionTimeline) this.transitionTimeline.kill();
		this.transitionTimeline = null;
		this.transitionEntry = null;
		this.transitioning = false;
		document.documentElement.classList.remove('is-ppc-home-transition');

		this.entries.forEach(({ mesh }) => {
			mesh.visible = true;
			mesh.position.z = 0;
			mesh.material.opacity = 1;
		});
	}

	startLoop() {
		if (this.rafId !== null) return;
		this.tick();
	}

	stopLoop() {
		cancelAnimationFrame(this.rafId);
		this.rafId = null;
	}

	tick() {
		this.rafId = requestAnimationFrame(this.tick);

		if (this.grid && !this.transitioning) {
			this.grid.raf();
			positionEntries(this);
		}

		this.render();
	}

	resize() {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;

		this.camera.left = width / -2;
		this.camera.right = width / 2;
		this.camera.top = height / 2;
		this.camera.bottom = height / -2;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height, false);

		if (this.grid && !this.transitioning) {
			this.grid.resize();
			positionEntries(this);
		}

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	setActive(active) {
		this.active = active;

		if (active) {
			this.resetPlanes();
			this.activateHome();
			this.container.dataset.active = 'true';
			this.resize();
		} else if (this.transitioning) {
			this.stopLoop();
			this.links = [];
			destroyHomeGrid(this);
			animateToTransitionTarget(this);
		} else {
			this.stopLoop();
			this.links = [];
			destroyHomeGrid(this);
			this.container.dataset.active = 'false';
		}
	}
}
