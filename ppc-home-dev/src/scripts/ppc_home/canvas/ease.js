import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { EASES } from './params';

export function resolveGsapEase(ease) {
	if (typeof ease !== 'string') return ease;
	if (EASES[ease]) return EASES[ease];
	if (ease.charAt(0) === 'M' || ease.charAt(0) === 'm' || ease.includes(',')) {
		return CustomEase.create(ease, ease);
	}

	return ease;
}

export function getEaseFn(ease) {
	return gsap.parseEase(resolveGsapEase(ease));
}

export function getEaseVelocity(easeFn, p) {
	const eps = 0.002;
	const a = Math.max(0, p - eps);
	const b = Math.min(1, p + eps);
	return Math.abs(easeFn(b) - easeFn(a)) / (b - a);
}

export function getEaseVelocityMax(easeFn) {
	let vMax = 0;
	for (let i = 0; i <= 64; i++) {
		const v = getEaseVelocity(easeFn, i / 64);
		if (v > vMax) vMax = v;
	}
	return vMax;
}
