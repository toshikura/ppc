import * as THREE from 'three';
import { gsap } from 'gsap';
import { resolveGsapEase } from './ease';
import { PPC_HOME_CANVAS_PARAMS, scaleDuration } from './params';
import {
	createHomeGrid,
	destroyHomeGrid,
	getEntryAlign,
	positionEntries,
	syncGridPadding,
} from './grid';
import { loadPlaneTextures } from './loader';
import {
	animateHomeSplash,
	getHomeSplashName,
	getHomeSplashPlaneName,
	interruptHomeSplash,
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
		this.homeSession = 0;
		this.transitionKind = null;
		this.transitionEntry = null;
		this.pendingLeaveEntry = null;
		this.enterFrom = null;
		this.transitionTimeline = null;
		this.leaveFadeTween = null;
		this.transitioning = false;
		this.splashTimeline = null;
		this.splashTargets = null;
		this.splashing = false;
		this.hasPlayedSplash = false;
		this.active = container.dataset.active === 'true';

		this.renderer.setPixelRatio(
			Math.max(1, Math.min(window.devicePixelRatio, 2) * PPC_HOME_CANVAS_PARAMS.res),
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
		const session = ++this.homeSession;
		createHomeGrid(this);
		loadPlaneTextures(this).then(() => {
			if (session !== this.homeSession || !this.active || !this.grid) return;
			this.syncMeshesToGrid();
			this.syncLinks();

			if (!this.hasPlayedSplash) {
				this.grid.autoscrollProgress = 0;
			} else {
				const enter =
					this.enterFrom === 'single'
						? PPC_HOME_CANVAS_PARAMS.animation.transition.singleToHome
							.fadein
						: PPC_HOME_CANVAS_PARAMS.animation.transition.otherToHome
							.fadein;
				animateEnterFadein(this, enter);
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

	findItemIndexByUrl(url) {
		const path =
			new URL(url, window.location.origin).pathname.replace(/\/$/, '') || '/';

		return this.items.findIndex((item) => {
			const itemPath =
				new URL(item.href, window.location.origin).pathname.replace(
					/\/$/,
					'',
				) || '/';
			return itemPath === path;
		});
	}

	findEntryByIndex(index) {
		const matches = this.entries.filter((entry) => entry.index === index);

		if (!matches.length) {
			throw new Error(`Home Plane ${index} was not found.`);
		}

		let nearest = matches[0];
		let best = Infinity;

		for (let i = 0; i < matches.length; i++) {
			const entry = matches[i];
			const dist =
				entry.mesh.position.x * entry.mesh.position.x +
				entry.mesh.position.y * entry.mesh.position.y;
			if (dist < best) {
				best = dist;
				nearest = entry;
			}
		}

		return nearest;
	}

	killTransitionTweens() {
		if (this.leaveFadeTween) this.leaveFadeTween.kill();
		this.leaveFadeTween = null;
		if (this.transitionTimeline) this.transitionTimeline.kill();
		this.transitionTimeline = null;
		gsap.killTweensOf(this.entries.map(({ mesh }) => mesh.material));
		gsap.killTweensOf(this.entries.map(({ mesh }) => mesh.position));
		gsap.killTweensOf(this.entries.map(({ mesh }) => mesh.scale));
	}

	clearTransition() {
		this.killTransitionTweens();
		this.transitionKind = null;
		this.transitionEntry = null;
		this.transitioning = false;
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

		this.startLeaveToSingle(entry);
	}

	setPageType(type) {
		if (type === 'home') return;
		this.enterFrom = type;
	}

	prepareLeaveTransition(url) {
		if (!this.grid || !this.entries.length) return;

		const index = this.findItemIndexByUrl(url);

		if (index === -1) {
			this.startLeaveToOther();
			return;
		}

		if (this.pendingLeaveEntry && this.pendingLeaveEntry.index === index) {
			this.startLeaveToSingle(this.pendingLeaveEntry);
			return;
		}

		if (
			this.transitionKind === 'homeToSingle' &&
			this.transitionEntry
		) {
			return;
		}

		this.startLeaveToSingle(this.findEntryByIndex(index));
	}

	snapFromSplash() {
		this.entries.forEach(({ mesh }) => {
			mesh.rotation.set(0, 0, 0);
			mesh.renderOrder = 0;
			mesh.material.depthWrite = true;
		});
		this.grid.onUpdate();
		positionEntries(this);
	}

	startLeaveToOther() {
		if (this.transitionKind === 'homeToOther') return;

		const fromSplash = this.splashing;
		interruptHomeSplash(this);
		this.killTransitionTweens();

		if (fromSplash) this.snapFromSplash();

		this.enterFrom = 'other';
		this.transitionKind = 'homeToOther';
		this.transitioning = true;
		this.transitionEntry = null;
		document.documentElement.classList.add('is-ppc-home-transition');
		this.grid.stop();

		const fadeout = PPC_HOME_CANVAS_PARAMS.animation.transition.homeToOther.fadeout;
		const materials = this.entries.map(({ mesh }) => mesh.material);

		this.leaveFadeTween = gsap.to(materials, {
			opacity: 0,
			duration: this.getTransitionDuration(fadeout.duration),
			ease: resolveGsapEase(fadeout.ease),
			onUpdate: this.render,
			onComplete: () => this.completeTransition(),
		});
	}

	startLeaveToSingle(entry) {
		if (this.transitionKind === 'homeToSingle' && this.transitionEntry === entry) {
			return;
		}

		const fromSplash = this.splashing;
		interruptHomeSplash(this);

		this.killTransitionTweens();

		if (fromSplash) this.snapFromSplash();

		const align = getEntryAlign(this, entry);
		entry.mesh.visible = true;
		entry.mesh.material.opacity = 1;
		entry.mesh.rotation.set(0, 0, 0);
		entry.mesh.position.set(align.x, align.y, 1);
		entry.mesh.scale.set(align.width, align.height, 1);

		this.enterFrom = 'single';
		this.transitionKind = 'homeToSingle';
		this.transitioning = true;
		this.transitionEntry = entry;
		document.documentElement.classList.add('is-ppc-home-transition');
		this.grid.stop();

		const otherMaterials = this.entries
			.filter((item) => item !== entry)
			.map(({ mesh }) => mesh.material);
		const fadeout =
			PPC_HOME_CANVAS_PARAMS.animation.transition.homeToSingle.fadeout;

		this.leaveFadeTween = gsap.to(otherMaterials, {
			opacity: 0,
			duration: this.getTransitionDuration(fadeout.duration),
			ease: resolveGsapEase(fadeout.ease),
			onUpdate: this.render,
		});
	}

	completeTransition() {
		if (
			this.transitionKind !== 'homeToSingle' &&
			this.transitionKind !== 'homeToOther'
		) {
			return;
		}
		if (this.transitionEntry) {
			this.transitionEntry.mesh.visible = false;
			this.transitionEntry.mesh.position.z = 0;
		}
		this.container.dataset.active = 'false';
		document.documentElement.classList.remove('is-ppc-home-transition');
		this.clearTransition();
		this.render();
	}

	getTransitionDuration(duration) {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 0
			: scaleDuration(duration);
	}

	resetPlanes() {
		stopHomeSplash(this);
		this.killTransitionTweens();
		this.transitionKind = null;
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
		if (active) {
			if (this.active && this.grid) return;
			this.active = true;
			this.resetPlanes();
			this.activateHome();
			this.container.dataset.active = 'true';
			this.resize();
			return;
		}

		this.active = false;
		this.homeSession += 1;
		interruptHomeSplash(this);
		this.stopLoop();
		this.links = [];
		this.pendingLeaveEntry = null;
		destroyHomeGrid(this);

		if (this.transitionKind === 'homeToSingle' && this.transitionEntry) {
			animateToTransitionTarget(this);
			return;
		}

		if (this.transitionKind === 'homeToOther') return;

		this.clearTransition();
		this.container.dataset.active = 'false';
		document.documentElement.classList.remove('is-ppc-home-transition');
		this.render();
	}
}
