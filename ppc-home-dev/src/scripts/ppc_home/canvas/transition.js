import { gsap } from 'gsap';
import {
	getEaseFn,
	getEaseVelocity,
	getEaseVelocityMax,
	resolveGsapEase,
} from './ease';
import { PPC_HOME_CANVAS_PARAMS } from './params';
import { attachPaperGeometry } from './paper';

export function getImageAlign(webgl, targetImage, projectId) {
	const rect = targetImage.getBoundingClientRect();

	if (rect.width === 0 || rect.height === 0) {
		throw new Error(`Transition target image for ${projectId} has zero size.`);
	}

	return {
		x: rect.left + rect.width / 2 - webgl.container.clientWidth / 2,
		y: webgl.container.clientHeight / 2 - rect.top - rect.height / 2,
		width: rect.width,
		height: rect.height,
	};
}

function getTransitionTargetImage(webgl) {
	const target = document.querySelector(
		`[data-transition-target][data-project-id="${webgl.transitionEntry.item.id}"]`,
	);

	if (!target) {
		throw new Error(
			`Transition target for ${webgl.transitionEntry.item.id} was not found.`,
		);
	}

	const targetImage = target.querySelector('img, video');

	if (!targetImage) {
		throw new Error(
			`Transition target image for ${webgl.transitionEntry.item.id} was not found.`,
		);
	}

	return targetImage;
}

export function getTransitionAlign(webgl, targetImage) {
	return getImageAlign(webgl, targetImage, webgl.transitionEntry.item.id);
}

export function animateToTransitionTarget(webgl) {
	const targetImage = getTransitionTargetImage(webgl);
	const startAlign = getTransitionAlign(webgl, targetImage);
	const zoom = PPC_HOME_CANVAS_PARAMS.animation.transition.homeToSingle.zoom;
	const duration = webgl.getTransitionDuration(zoom.duration);
	const mesh = webgl.transitionEntry.mesh;
	const paper = zoom.paper;
	const paperUniforms = mesh.material.userData.paperUniforms;

	webgl.entries.forEach((item) => {
		if (item !== webgl.transitionEntry) item.mesh.visible = false;
		item.bgMesh.visible = false;
	});

	const maxBend = (paper.angle * Math.PI) / 180;
	const easeFn = getEaseFn(zoom.ease);
	const vMax = getEaseVelocityMax(easeFn);

	if (paper.enabled) {
		attachPaperGeometry(webgl, mesh);
		paperUniforms.uPaperCurve.value = paper.curve;
		paperUniforms.uPaperBend.value = 0;
	}

	webgl.transitionTimeline = gsap.timeline({
		onUpdate: () => {
			const currentAlign = getTransitionAlign(webgl, targetImage);
			mesh.position.x += currentAlign.x - startAlign.x;
			mesh.position.y += currentAlign.y - startAlign.y;
			mesh.scale.x += currentAlign.width - startAlign.width;
			mesh.scale.y += currentAlign.height - startAlign.height;

			if (paper.enabled) {
				paperUniforms.uPaperBend.value =
					maxBend *
					(getEaseVelocity(easeFn, webgl.transitionTimeline.progress()) /
						vMax);
			}

			webgl.render();
		},
		onComplete: () => webgl.completeTransition(),
	});
	webgl.transitionTimeline.to(
		mesh.position,
		{
			x: startAlign.x,
			y: startAlign.y,
			duration,
			ease: resolveGsapEase(zoom.ease),
		},
		0,
	);
	webgl.transitionTimeline.to(
		mesh.scale,
		{
			x: startAlign.width,
			y: startAlign.height,
			duration,
			ease: resolveGsapEase(zoom.ease),
		},
		0,
	);
}

export function animateEnterFadein(webgl, fadein) {
	const materials = webgl.entries.flatMap(({ mesh, bgMesh }) => [
		mesh.material,
		bgMesh.material,
	]);

	materials.forEach((material) => {
		material.opacity = 0;
	});

	gsap.to(materials, {
		opacity: 1,
		duration: webgl.getTransitionDuration(fadein.duration),
		ease: resolveGsapEase(fadein.ease),
	});
}
