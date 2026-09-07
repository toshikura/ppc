import { Vector3 } from 'three';
import { gsap } from 'gsap';
import { resolveGsapEase } from './ease';
import { positionEntries } from './grid';
import { PPC_HOME_CANVAS_PARAMS, scaleDuration } from './params';

const ROTATION_PIVOT = new Vector3();

const QUADRANT_COUNT = 4;
const DEG_TO_RAD = Math.PI / 180;
const HOME_SPLASH_LAYOUTS = {
	static: animateStaticSplash,
	card: animateCardSplash,
	slide: animateSlideSplash,
	tornado: animateTornadoSplash,
};

function randomSignedRange(range) {
	return (Math.random() * 2 - 1) * range;
}

function resolveRotationFrom(value, rand) {
	return (rand ? randomSignedRange(value) : value) * DEG_TO_RAD;
}

function applySplashMeshPosition(mesh, x, y, z, plane) {
	let px = 0;
	let py = 0;
	let pz = 0;

	if (plane.rotation.enabled && plane.rotation.origin) {
		const origin = plane.rotation.origin;
		px = origin.x * mesh.scale.x;
		py = origin.y * mesh.scale.y;
		pz = origin.z * mesh.scale.z;
		ROTATION_PIVOT.set(px, py, pz).applyEuler(mesh.rotation);
		px -= ROTATION_PIVOT.x;
		py -= ROTATION_PIVOT.y;
		pz -= ROTATION_PIVOT.z;
	}

	mesh.position.set(x + px, y + py, z + pz);
}

function getActiveSplashPlane() {
	const splash = PPC_HOME_CANVAS_PARAMS.animation.splash;
	return splash.plane[splash.planeName];
}

function setPlaneMotionFrom(entry, target, plane) {
	const scale = plane.scale.enabled ? plane.scale.from : 1;
	const opacity = plane.opacity.enabled ? plane.opacity.from : 1;

	entry.mesh.scale.set(
		target.scale.x * scale,
		target.scale.y * scale,
		1,
	);
	if (plane.rotation.enabled) {
		entry.mesh.rotation.set(
			resolveRotationFrom(plane.rotation.from.x, plane.rotation.rand),
			resolveRotationFrom(plane.rotation.from.y, plane.rotation.rand),
			resolveRotationFrom(plane.rotation.from.z, plane.rotation.rand),
		);
	} else {
		entry.mesh.rotation.set(0, 0, 0);
	}
	entry.mesh.material.opacity = target.opacity * opacity;
}

function addPlaneMotion(timeline, entry, target, plane, start, layout) {
	if (plane.scale.enabled) {
		timeline.to(
			entry.mesh.scale,
			{
				x: target.scale.x * plane.scale.to,
				y: target.scale.y * plane.scale.to,
				duration: scaleDuration(layout.duration),
				ease: resolveGsapEase(layout.ease),
			},
			start,
		);
	}

	if (plane.rotation.enabled) {
		timeline.to(
			entry.mesh.rotation,
			{
				x: plane.rotation.to.x * DEG_TO_RAD,
				y: plane.rotation.to.y * DEG_TO_RAD,
				z: plane.rotation.to.z * DEG_TO_RAD,
				duration: scaleDuration(layout.duration),
				ease: resolveGsapEase(layout.ease),
			},
			start,
		);
	}

	if (plane.opacity.enabled) {
		timeline.to(
			entry.mesh.material,
			{
				opacity: target.opacity * plane.opacity.to,
				duration: scaleDuration(layout.duration),
				ease: resolveGsapEase(layout.ease),
			},
			start,
		);
	}
}

function getQuadrant({ x, y }) {
	if (x < 0 && y >= 0) return 0;
	if (x >= 0 && y < 0) return 1;
	if (x >= 0 && y >= 0) return 2;
	return 3;
}

function getDealOrder(entries, targets) {
	const quadrants = Array.from({ length: QUADRANT_COUNT }, () => []);
	const centerEntries = [];

	entries.forEach((entry) => {
		const target = targets.get(entry);
		const distance = Math.hypot(target.position.x, target.position.y);

		if (distance < 1) {
			centerEntries.push(entry);
		} else {
			quadrants[getQuadrant(target.position)].push(entry);
		}
	});

	quadrants.forEach((quadrant) => {
		quadrant.sort(
			(a, b) =>
				targets.get(b).distance - targets.get(a).distance,
		);
	});

	const orderedEntries = [];
	const remainingEntryCount = quadrants.reduce(
		(total, quadrant) => total + quadrant.length,
		0,
	);

	for (let i = 0; orderedEntries.length < remainingEntryCount; i += 1) {
		const quadrant = quadrants[i % QUADRANT_COUNT];
		if (quadrant.length > 0) orderedEntries.push(quadrant.shift());
	}

	return orderedEntries.concat(centerEntries);
}

function getSlideDirection(entry, target) {
	if (target.position.y >= 1) return 1;
	if (target.position.y <= -1) return -1;
	return Number(entry.el.dataset.x) % 2 === 0 ? 1 : -1;
}

function getSlideOrder(entries, targets) {
	return entries.slice().sort((a, b) => {
		const targetA = targets.get(a).position;
		const targetB = targets.get(b).position;
		const columnDifference = targetA.x - targetB.x;

		if (Math.abs(columnDifference) >= 1) return columnDifference;

		const distanceDifference = Math.abs(targetA.y) - Math.abs(targetB.y);
		if (Math.abs(distanceDifference) >= 1) return distanceDifference;

		return targetA.y - targetB.y;
	});
}

function getClockwiseAngle(x, y) {
	const angle = Math.atan2(x, y);
	return angle < 0 ? angle + Math.PI * 2 : angle;
}

function getTornadoOrder(entries, targets) {
	return entries.slice().sort((a, b) => {
		const targetA = targets.get(a);
		const targetB = targets.get(b);
		const distanceDifference = targetA.distance - targetB.distance;

		if (Math.abs(distanceDifference) >= 1) return distanceDifference;

		return (
			getClockwiseAngle(targetA.position.x, targetA.position.y) -
			getClockwiseAngle(targetB.position.x, targetB.position.y)
		);
	});
}

function getTornadoPoint(progress, targetPosition, turns, startRadius) {
	const targetRadius = Math.hypot(targetPosition.x, targetPosition.y);

	if (targetRadius < 1) {
		return {
			x: targetPosition.x,
			y: targetPosition.y,
		};
	}

	const targetAngle = Math.atan2(targetPosition.y, targetPosition.x);
	const startAngle = targetAngle + turns * Math.PI * 2;
	const angle = startAngle + (targetAngle - startAngle) * progress;
	const radius = startRadius + (targetRadius - startRadius) * progress;

	return {
		x: Math.cos(angle) * radius,
		y: Math.sin(angle) * radius,
	};
}

function getMinTornadoDistance(targets) {
	let minDistance = 0;

	targets.forEach((target) => {
		if (target.distance >= 1 && (minDistance === 0 || target.distance < minDistance)) {
			minDistance = target.distance;
		}
	});

	return minDistance;
}

function getTornadoDuration(distance, minDistance, layout) {
	if (minDistance === 0) return layout.duration;
	const ratio = Math.max(distance, minDistance) / minDistance;
	return layout.duration * (1 + (ratio - 1) * layout.distance);
}

function prepareHomeSplash(webgl, autoscrollProgress) {
	const visibleEntries = webgl.entries.filter(({ mesh }) => mesh.visible);

	if (visibleEntries.length === 0) {
		throw new Error('Home splash could not find a visible Plane.');
	}

	const targets = new Map(
		visibleEntries.map((entry) => [
			entry,
			{
				position: entry.mesh.position.clone(),
				scale: entry.mesh.scale.clone(),
				opacity: entry.mesh.material.opacity,
				distance: Math.hypot(entry.mesh.position.x, entry.mesh.position.y),
				unscrolled: {
					x: entry.mesh.position.x,
					y: entry.mesh.position.y,
					z: entry.mesh.position.z,
				},
			},
		]),
	);

	webgl.splashing = true;
	webgl.splashDragEnabled = false;
	webgl.splashScrollX = webgl.grid.scroll.x;
	webgl.splashScrollY = webgl.grid.scroll.y;
	webgl.splashTargets = targets;
	webgl.grid.autoscrollProgress = autoscrollProgress;
	webgl.grid.stop();
	document.documentElement.classList.add('is-ppc-home-splash');

	if (PPC_HOME_CANVAS_PARAMS.animation.splash.dragStart <= 0) {
		enableHomeDrag(webgl);
	}

	return {
		entries: visibleEntries,
		targets,
	};
}

function resetSplashEntry(entry, target) {
	entry.mesh.position.set(target.position.x, target.position.y, 0);
	entry.mesh.scale.set(target.scale.x, target.scale.y, 1);
	entry.mesh.rotation.set(0, 0, 0);
	entry.mesh.material.opacity = target.opacity;
	entry.mesh.renderOrder = 0;
	entry.mesh.material.depthWrite = true;
}

function enableHomeDrag(webgl) {
	if (webgl.splashDragEnabled) return;

	webgl.splashDragEnabled = true;
	webgl.grid.start();
	document.documentElement.classList.remove('is-ppc-home-splash');
}

function applySplashAutoscroll(webgl) {
	const ox =
		webgl.grid.autoscrollOffset.x +
		webgl.grid.scroll.x -
		webgl.splashScrollX;
	const oy =
		webgl.grid.autoscrollOffset.y +
		webgl.grid.scroll.y -
		webgl.splashScrollY;

	const plane = getActiveSplashPlane();

	webgl.splashTargets.forEach((target, entry) => {
		applySplashMeshPosition(
			entry.mesh,
			target.unscrolled.x - ox,
			target.unscrolled.y + oy,
			target.unscrolled.z,
			plane,
		);
	});
}

function syncSplashAutoscroll(webgl) {
	if (!webgl.splashTimeline) return;

	webgl.grid.autoscrollProgress = webgl.splashAutoscrollProgress();
	webgl.grid.raf();
	applySplashAutoscroll(webgl);

	if (
		!webgl.splashDragEnabled &&
		webgl.splashTimeline.totalProgress() >=
			PPC_HOME_CANVAS_PARAMS.animation.splash.dragStart
	) {
		enableHomeDrag(webgl);
	}

	webgl.render();
}

function startSplashAutoscroll(webgl, getProgress) {
	webgl.splashAutoscrollProgress = getProgress;
	webgl.syncSplashAutoscroll = () => syncSplashAutoscroll(webgl);
	gsap.ticker.add(webgl.syncSplashAutoscroll);
}

function stopSplashAutoscroll(webgl) {
	if (!webgl.syncSplashAutoscroll) return;

	gsap.ticker.remove(webgl.syncSplashAutoscroll);
	webgl.syncSplashAutoscroll = null;
	webgl.splashAutoscrollProgress = null;
}

function finishHomeSplash(webgl) {
	stopSplashAutoscroll(webgl);
	webgl.splashTargets.forEach((target, entry) => {
		resetSplashEntry(entry, target);
	});

	webgl.grid.autoscrollProgress = 1;
	webgl.grid.start();
	webgl.grid.raf();
	positionEntries(webgl);

	webgl.splashTimeline = null;
	webgl.splashTargets = null;
	webgl.splashDragEnabled = false;
	webgl.splashing = false;
	document.documentElement.classList.remove('is-ppc-home-splash');
	webgl.startLoop();
}

function animateStaticSplash(webgl, plane) {
	const layout = PPC_HOME_CANVAS_PARAMS.animation.splash.layout.static;
	const { entries, targets } = prepareHomeSplash(webgl, 1);
	const staticPlane = {
		rotation: plane.rotation,
		scale: plane.scale,
		opacity: {
			enabled: true,
			from: plane.opacity.from,
			to: plane.opacity.to,
		},
	};

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		finishHomeSplash(webgl);
		return;
	}

	entries.forEach((entry) => {
		const target = targets.get(entry);
		setPlaneMotionFrom(entry, target, staticPlane);
		applySplashMeshPosition(
			entry.mesh,
			target.unscrolled.x,
			target.unscrolled.y,
			target.unscrolled.z,
			staticPlane,
		);
	});
	webgl.render();
	webgl.splashTimeline = gsap.timeline({
		delay: layout.delay,
		onComplete: () => finishHomeSplash(webgl),
	});
	startSplashAutoscroll(webgl, () => 1);

	entries.forEach((entry, index) => {
		addPlaneMotion(
			webgl.splashTimeline,
			entry,
			targets.get(entry),
			staticPlane,
			index * layout.stagger,
			layout,
		);
	});
}

function animateCardSplash(webgl, plane) {
	const layout = PPC_HOME_CANVAS_PARAMS.animation.splash.layout.card;
	const { entries, targets } = prepareHomeSplash(webgl, 0);
	const dealOrder = getDealOrder(entries, targets);

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		finishHomeSplash(webgl);
		return;
	}

	dealOrder.forEach((entry, index) => {
		const target = targets.get(entry);
		const layer = Math.min(index, layout.stack.visibleLayers);
		const offsetDirection = index % 2 === 0 ? -1 : 1;

		target.unscrolled.x = layer * layout.stack.offsetX * offsetDirection;
		target.unscrolled.y = layer * layout.stack.offsetY;
		target.unscrolled.z = (dealOrder.length - index) * layout.stack.depth;
		setPlaneMotionFrom(entry, target, plane);
		applySplashMeshPosition(
			entry.mesh,
			target.unscrolled.x,
			target.unscrolled.y,
			target.unscrolled.z,
			plane,
		);
		entry.mesh.renderOrder = dealOrder.length - index;
		entry.mesh.material.depthWrite = false;
	});
	webgl.render();
	webgl.splashTimeline = gsap.timeline({
		delay: layout.delay,
		onComplete: () => finishHomeSplash(webgl),
	});
	startSplashAutoscroll(webgl, () => webgl.splashTimeline.progress());

	dealOrder.forEach((entry, index) => {
		const target = targets.get(entry);
		const start = index * layout.stagger;

		webgl.splashTimeline.to(
			target.unscrolled,
			{
				x: target.position.x,
				y: target.position.y,
				z: 0,
				duration: scaleDuration(layout.duration),
				ease: resolveGsapEase(layout.ease),
				onComplete: () => {
					entry.mesh.renderOrder = 0;
					entry.mesh.material.depthWrite = true;
				},
			},
			start,
		);
		addPlaneMotion(
			webgl.splashTimeline,
			entry,
			target,
			plane,
			start,
			layout,
		);
	});
}

function animateSlideSplash(webgl, plane) {
	const layout = PPC_HOME_CANVAS_PARAMS.animation.splash.layout.slide;
	const { entries, targets } = prepareHomeSplash(webgl, 0);
	const slideOrder = getSlideOrder(entries, targets);

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		finishHomeSplash(webgl);
		return;
	}

	slideOrder.forEach((entry, index) => {
		const target = targets.get(entry);
		const direction = getSlideDirection(entry, target);

		target.unscrolled.x =
			target.position.x +
			(webgl.container.clientWidth / 2 +
				target.scale.x / 2 +
				layout.outside) *
				layout.offset.x;
		target.unscrolled.y =
			target.position.y +
			direction *
				(webgl.container.clientHeight / 2 +
					target.scale.y / 2 +
					layout.outside) *
				layout.offset.y;
		target.unscrolled.z = 0;
		setPlaneMotionFrom(entry, target, plane);
		applySplashMeshPosition(
			entry.mesh,
			target.unscrolled.x,
			target.unscrolled.y,
			target.unscrolled.z,
			plane,
		);
		entry.mesh.renderOrder = slideOrder.length - index;
		entry.mesh.material.depthWrite = false;
	});
	webgl.render();
	webgl.splashTimeline = gsap.timeline({
		delay: layout.delay,
		onComplete: () => finishHomeSplash(webgl),
	});
	startSplashAutoscroll(webgl, () => webgl.splashTimeline.progress());

	slideOrder.forEach((entry, index) => {
		const target = targets.get(entry);
		const start = index * layout.stagger;

		webgl.splashTimeline.to(
			target.unscrolled,
			{
				x: target.position.x,
				y: target.position.y,
				duration: scaleDuration(layout.duration),
				ease: resolveGsapEase(layout.ease),
				onComplete: () => {
					entry.mesh.renderOrder = 0;
					entry.mesh.material.depthWrite = true;
				},
			},
			start,
		);
		addPlaneMotion(
			webgl.splashTimeline,
			entry,
			target,
			plane,
			start,
			layout,
		);
	});
}

function animateTornadoSplash(webgl, plane) {
	const layout = PPC_HOME_CANVAS_PARAMS.animation.splash.layout.tornado;
	const { entries, targets } = prepareHomeSplash(webgl, 0);
	const tornadoOrder = getTornadoOrder(entries, targets);
	const minDistance = getMinTornadoDistance(targets);

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		finishHomeSplash(webgl);
		return;
	}

	tornadoOrder.forEach((entry, index) => {
		const target = targets.get(entry);
		const start = getTornadoPoint(
			0,
			target.position,
			layout.turns,
			layout.radius,
		);

		target.tornado = 0;
		target.unscrolled.x = start.x;
		target.unscrolled.y = start.y;
		target.unscrolled.z = (tornadoOrder.length - index) * layout.depth;
		setPlaneMotionFrom(entry, target, plane);
		applySplashMeshPosition(
			entry.mesh,
			target.unscrolled.x,
			target.unscrolled.y,
			target.unscrolled.z,
			plane,
		);
		entry.mesh.renderOrder = tornadoOrder.length - index;
		entry.mesh.material.depthWrite = false;
	});
	webgl.render();
	webgl.splashTimeline = gsap.timeline({
		delay: layout.delay,
		onComplete: () => finishHomeSplash(webgl),
	});
	startSplashAutoscroll(webgl, () => webgl.splashTimeline.progress());

	tornadoOrder.forEach((entry, index) => {
		const target = targets.get(entry);
		const start = index * layout.stagger;
		const duration = getTornadoDuration(
			target.distance,
			minDistance,
			layout,
		);

		webgl.splashTimeline.to(
			target,
			{
				tornado: 1,
				duration: scaleDuration(duration),
				ease: resolveGsapEase(layout.ease),
				onUpdate: () => {
					const point = getTornadoPoint(
						target.tornado,
						target.position,
						layout.turns,
						layout.radius,
					);
					target.unscrolled.x = point.x;
					target.unscrolled.y = point.y;
				},
				onComplete: () => {
					entry.mesh.renderOrder = 0;
					entry.mesh.material.depthWrite = true;
				},
			},
			start,
		);
		webgl.splashTimeline.to(
			target.unscrolled,
			{
				z: 0,
				duration: scaleDuration(duration),
				ease: resolveGsapEase(layout.ease),
			},
			start,
		);
		addPlaneMotion(
			webgl.splashTimeline,
			entry,
			target,
			plane,
			start,
			{
				duration,
				ease: layout.ease,
			},
		);
	});
}

export function getHomeSplashName() {
	return PPC_HOME_CANVAS_PARAMS.animation.splash.layoutName;
}

export function getHomeSplashPlaneName() {
	return PPC_HOME_CANVAS_PARAMS.animation.splash.planeName;
}

export function animateHomeSplash(
	webgl,
	layoutName,
	planeName,
) {
	const layout = HOME_SPLASH_LAYOUTS[layoutName];
	const plane = PPC_HOME_CANVAS_PARAMS.animation.splash.plane[planeName];

	if (!layout) {
		throw new Error(`Unsupported Home splash layout: ${layoutName}`);
	}
	if (!plane) {
		throw new Error(`Unsupported Home splash Plane: ${planeName}`);
	}

	layout(webgl, plane);
}

export function replayHomeSplash(
	webgl,
	layoutName,
	planeName,
) {
	if (!webgl.active || !webgl.grid || webgl.transitioning) return;

	stopHomeSplash(webgl);
	webgl.stopLoop();
	webgl.grid.autoscrollProgress = 0;
	webgl.grid.autoscrollOffset.x = 0;
	webgl.grid.autoscrollOffset.y = 0;
	webgl.grid.start();
	webgl.grid.raf();
	positionEntries(webgl);
	animateHomeSplash(webgl, layoutName, planeName);
}

export function stopHomeSplash(webgl) {
	interruptHomeSplash(webgl);

	if (webgl.splashTargets) {
		webgl.splashTargets.forEach((target, entry) => {
			resetSplashEntry(entry, target);
		});
	}

	webgl.splashTargets = null;
}

export function interruptHomeSplash(webgl) {
	stopSplashAutoscroll(webgl);
	if (webgl.splashTimeline) webgl.splashTimeline.kill();

	webgl.splashTimeline = null;
	webgl.splashDragEnabled = false;
	webgl.splashing = false;
	document.documentElement.classList.remove('is-ppc-home-splash');
}
