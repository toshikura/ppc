import { withBase } from '../../utils/paths';

export function categorySlug(label) {
	return label
		.toLowerCase()
		.replace(/[・·]/g, '-')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const LANDSCAPE = {
	width: 1280,
	height: 820,
	mediumWidth: 720,
	mediumHeight: 461,
};

const PORTRAIT = {
	width: 1280,
	height: 2295,
	mediumWidth: 720,
	mediumHeight: 1291,
};

function imageItem(index, size, filter) {
	const id = `single-${index}`;
	const padded = String(index).padStart(2, '0');

	return {
		id,
		media: 'image',
		title: `Project ${padded}`,
		href: withBase(`collection/${id}/`),
		width: size.width,
		height: size.height,
		sources: {
			large: {
				width: size.width,
				height: size.height,
				url: withBase(`assets/dev/images/${index}@2x.jpg`),
			},
			medium: {
				width: size.mediumWidth,
				height: size.mediumHeight,
				url: withBase(`assets/dev/images/${index}@1x.jpg`),
			},
			poster: {
				width: 4,
				height: 4,
				url: withBase(`assets/dev/images/${index}@poster.jpg`),
			},
		},
		filter,
	};
}

export const HOME_FEATURED_PROJECTS = [
	imageItem(1, LANDSCAPE, {
		country: 'Japan',
		category: ['Product', 'Graphic', 'Package'],
	}),
	{
		id: 'single-2',
		media: 'video',
		title: 'Project 02',
		href: withBase('collection/single-2/'),
		width: 1280,
		height: 720,
		poster: {
			large: {
				width: 1280,
				height: 720,
				url: withBase('assets/dev/video/1280x720@2x.jpg'),
			},
			medium: {
				width: 1280,
				height: 720,
				url: withBase('assets/dev/video/1280x720@1x.jpg'),
			},
		},
		sources: {
			large: {
				width: 1280,
				height: 720,
				url: withBase('assets/dev/video/1280x720.mp4'),
			},
			medium: {
				width: 1280,
				height: 720,
				url: withBase('assets/dev/video/1280x720.mp4'),
			},
			poster: {
				width: 4,
				height: 4,
				url: withBase('assets/dev/video/1280x720@poster.jpg'),
			},
		},
		filter: {
			country: 'USA',
			category: ['Movie・Film', 'CG・Motion', 'Still・Photography'],
		},
	},
	imageItem(3, LANDSCAPE, {
		country: 'Japan',
		category: ['Architecture', 'Interior'],
	}),
	imageItem(4, LANDSCAPE, {
		country: 'France',
		category: ['Web', 'Logo・Naming'],
	}),
	imageItem(5, PORTRAIT, {
		country: 'Italy',
		category: ['Editorial', 'Typography'],
	}),
	imageItem(6, LANDSCAPE, {
		country: 'Japan',
		category: ['furniture', 'Goods'],
	}),
	imageItem(7, LANDSCAPE, {
		country: 'UK',
		category: ['Illustration', 'Philosophy'],
	}),
	imageItem(8, LANDSCAPE, {
		country: 'Germany',
		category: ['Sign・System', 'Web'],
	}),
	imageItem(9, PORTRAIT, {
		country: 'Japan',
		category: ['Behind the scenes', 'Research'],
	}),
	imageItem(10, LANDSCAPE, {
		country: 'Switzerland',
		category: ['Other', 'Recipe'],
	}),
	imageItem(11, PORTRAIT, {
		country: 'Japan',
		category: ['Graphic', 'Typography', 'Editorial'],
	}),
	imageItem(12, LANDSCAPE, {
		country: 'Netherlands',
		category: ['Product', 'Interior', 'Architecture'],
	}),
	imageItem(13, LANDSCAPE, {
		country: 'Japan',
		category: ['Product', 'Package'],
	}),
	imageItem(14, PORTRAIT, {
		country: 'USA',
		category: ['Graphic', 'Editorial'],
	}),
	imageItem(15, LANDSCAPE, {
		country: 'France',
		category: ['Architecture', 'Interior'],
	}),
	imageItem(16, PORTRAIT, {
		country: 'Italy',
		category: ['Web', 'Typography'],
	}),
	imageItem(17, LANDSCAPE, {
		country: 'UK',
		category: ['Illustration', 'Goods'],
	}),
	imageItem(18, LANDSCAPE, {
		country: 'Germany',
		category: ['Logo・Naming', 'Sign・System'],
	}),
];
