import Swup from 'swup';
import SwupA11yPlugin from '@swup/a11y-plugin';
import SwupHeadPlugin from '@swup/head-plugin';

export const swup = new Swup({
	containers: ['#swup'],
	animationSelector: '[class*="swup-"]',
	plugins: [
		new SwupHeadPlugin({
			persistTags: '[data-tp-style]',
		}),
		new SwupA11yPlugin(),
	],
});
