import * as THREE from 'three';
import { gsap } from 'gsap';
import { resolveGsapEase } from './ease';
import { PPC_HOME_CANVAS_PARAMS } from './params';
import {
	createHomeGrid,
	destroyHomeGrid,
	positionEntries,
	syncGridPadding,
} from './grid';
import { loadPlaneTextures } from './loader';
import {
	animateHomeSplash,
	getHomeSplashName,
	getHomeSplashPlaneName,
	stopHomeSplash,
} from './splash';
import { animateEnterFadein, animateToTransitionTarget } from './transition';

export default class PpcHomeCanvas {
	constructor(container) {
		this.container = container;
		this.items = window.firstData.top.items;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			PPC_HOME_CANVAS_PARAMS.fov,
			1,
			0.1,
			10000,
		);
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.geometry = new THREE.PlaneGeometry(1, 1);
		this.textures = [];
		this.entries = [];
		this.links = [];
		this.grid = null;
		this.loadPromise = null;
		this.rafId = null;
		this.transitionEntry = null;
		this.transitionTimeline = null;
		this.transitioning = false;
		this.splashTimeline = null;
		this.splashTargets = null;
		this.splashing = false;
		this.hasPlayedSplash = false;
		this.active = container.dataset.active === 'true';

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
		loadPlaneTextures(this).then(() => {
			if (!this.active || !this.grid) return;
			this.syncMeshesToGrid();
			this.syncLinks();

			if (!this.hasPlayedSplash) {
				this.grid.autoscrollProgress = 0;
			} else {
				animateEnterFadein(this);
			}

			this.grid.raf();
			this.resize();

			if (!this.hasPlayedSplash) {
				this.hasPlayedSplash = true;
				animateHomeSplash(
					this,
					getHomeSplashName(),
					getHomeSplashPlaneName(),
				);
			} else {
				this.startLoop();
			}
		});
	}

	createPlane(item, index, texture, cell, link) {
		const material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
		});
		const mesh = new THREE.Mesh(this.geometry, material);
		this.scene.add(mesh);

		this.entries.push({ item, index, mesh, el: cell.el, link, cell });
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
				cell,
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
		if (this.splashing) {
			event.preventDefault();
			return;
		}

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
		const fadeout = PPC_HOME_CANVAS_PARAMS.animation.transition.leave.fadeout;

		gsap.to(otherMaterials, {
			opacity: 0,
			duration: this.getTransitionDuration(fadeout.duration),
			ease: resolveGsapEase(fadeout.ease),
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
		stopHomeSplash(this);
		gsap.killTweensOf(this.entries.map(({ mesh }) => mesh.material));
		if (this.transitionTimeline) this.transitionTimeline.kill();
		this.transitionTimeline = null;
		this.transitionEntry = null;
		this.transitioning = false;
		document.documentElement.classList.remove('is-ppc-home-transition');

		this.entries.forEach(({ mesh }) => {
			mesh.visible = true;
			mesh.position.z = 0;
			mesh.material.opacity = 0;
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

		if (this.grid && !this.transitioning && !this.splashing) {
			this.grid.raf();
			positionEntries(this);
		}

		this.render();
	}

	resize() {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;

		this.camera.aspect = width / height;
		this.camera.position.z =
			height /
			(2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
		this.camera.far = this.camera.position.z * 10;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height, false);

		if (this.grid && !this.transitioning && !this.splashing) {
			this.grid.resize();
			syncGridPadding(this);
			this.grid.onUpdate();
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
			stopHomeSplash(this);
			this.stopLoop();
			this.links = [];
			destroyHomeGrid(this);
			animateToTransitionTarget(this);
		} else {
			stopHomeSplash(this);
			this.stopLoop();
			this.links = [];
			destroyHomeGrid(this);
			this.container.dataset.active = 'false';
		}
	}
}
