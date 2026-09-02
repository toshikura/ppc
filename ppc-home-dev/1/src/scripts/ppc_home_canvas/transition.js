import { gsap } from 'gsap';
import { PPC_HOME_CANVAS_PARAMS } from './params';

export function getTransitionAlign(webgl) {
	const target = document.querySelector(
		`[data-transition-target][data-project-id="${webgl.transitionEntry.item.id}"]`,
	);

	if (!target) {
		throw new Error(
			`Transition target for ${webgl.transitionEntry.item.id} was not found.`,
		);
	}

	const targetImage = target.querySelector('img');

	if (!targetImage) {
		throw new Error(
			`Transition target image for ${webgl.transitionEntry.item.id} was not found.`,
		);
	}

	const rect = targetImage.getBoundingClientRect();

	if (rect.width === 0 || rect.height === 0) {
		throw new Error(
			`Transition target image for ${webgl.transitionEntry.item.id} has zero size.`,
		);
	}

	return {
		x: rect.left + rect.width / 2 - webgl.container.clientWidth / 2,
		y: webgl.container.clientHeight / 2 - rect.top - rect.height / 2,
		width: rect.width,
		height: rect.height,
	};
}

export function animateToTransitionTarget(webgl) {
	const { x, y, width, height } = getTransitionAlign(webgl);
	const zoom = PPC_HOME_CANVAS_PARAMS.animation.transition.zoom;
	const duration = webgl.getTransitionDuration(zoom.duration);

	webgl.transitionTimeline = gsap.timeline({
		onUpdate: webgl.render,
		onComplete: () => webgl.completeTransition(),
	});
	webgl.transitionTimeline.to(
		webgl.transitionEntry.mesh.position,
		{ x, y, duration, ease: zoom.ease },
		0,
	);
	webgl.transitionTimeline.to(
		webgl.transitionEntry.mesh.scale,
		{ x: width, y: height, duration, ease: zoom.ease },
		0,
	);
}
