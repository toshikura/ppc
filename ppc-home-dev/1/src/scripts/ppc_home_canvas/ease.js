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
