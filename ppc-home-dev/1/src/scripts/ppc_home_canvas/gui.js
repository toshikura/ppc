import { Pane } from 'tweakpane';
import { EASES, PPC_HOME_CANVAS_PARAMS } from './params';
import { replayHomeSplash } from './splash';

const EASE_OPTIONS = {};

for (const name in EASES) {
	EASE_OPTIONS[name] = name;
}

function nameOptions(map) {
	const options = {};
	for (const name in map) {
		options[name] = name;
	}
	return options;
}

function isPlainObject(value) {
	return Object.getPrototypeOf(value) === Object.prototype;
}

function numberBindingOptions(key, parentKey) {
	if (key === 'speed') return { min: 1, max: 400 };
	if (key === 'ease') return { min: 0.01, max: 1 };
	if (key === 'delay') return { min: 0, max: 3 };
	if (key === 'dragStart') return { min: 0, max: 1, step: 0.05 };
	if (parentKey === 'animationScale' && key === 'duration') {
		return { min: 0, max: 3, step: 0.05 };
	}
	if (key === 'duration') return { min: 0, max: 5 };
	if (key === 'stagger') return { min: 0, max: 0.5 };
	if (key === 'depth') return { min: 0, max: 0.2 };
	if (key === 'visibleLayers') return { min: 1, max: 25, step: 1 };
	if (key === 'outside') return { min: 0, max: 400 };
	if (key === 'turns') return { min: 0, max: 3, step: 0.05 };
	if (key === 'radius') return { min: 0, max: 400 };
	if (key === 'distance') return { min: 0, max: 3, step: 0.05 };
	if (key === 'offsetX' || key === 'offsetY') return { min: -20, max: 20 };
	if (parentKey === 'autoscroll' && (key === 'x' || key === 'y')) {
		return { min: -5, max: 5 };
	}
	if (parentKey === 'offset' && (key === 'x' || key === 'y')) {
		return { min: -2, max: 2 };
	}
	if (parentKey === 'origin' && (key === 'x' || key === 'y' || key === 'z')) {
		return { min: -1, max: 1, step: 0.05 };
	}
	if (
		(parentKey === 'from' || parentKey === 'to') &&
		(key === 'x' || key === 'y' || key === 'z')
	) {
		return { min: -180, max: 180 };
	}
	if (parentKey === 'scale' && (key === 'from' || key === 'to')) {
		return { min: 0, max: 2 };
	}
	if (parentKey === 'opacity' && (key === 'from' || key === 'to')) {
		return { min: 0, max: 1 };
	}
	return {};
}

function addEaseBinding(folder, target, key, label) {
	const binding = { value: '' };
	const current = target[key];

	if (typeof current === 'string') {
		binding.value = current;
	} else {
		for (const name in EASES) {
			if (EASES[name] === current) {
				binding.value = name;
				break;
			}
		}
	}

	folder.addBinding(binding, 'value', {
		label,
		options: EASE_OPTIONS,
	}).on('change', (event) => {
		target[key] = EASES[event.value];
	});
}

function bindObject(folder, target, parentKey) {
	for (const key in target) {
		const value = target[key];

		if (key === 'ease' && typeof value !== 'number') {
			addEaseBinding(folder, target, key, 'ease');
			continue;
		}

		if (isPlainObject(value)) {
			const child = folder.addFolder({ title: key, expanded: false });
			bindObject(child, value, key);
			continue;
		}

		folder.addBinding(target, key, {
			label: key,
			...numberBindingOptions(key, parentKey),
		});
	}
}

function syncGridSpeed(webgl) {
	if (!webgl.grid) return;

	webgl.grid.speed = navigator.userAgent.toLowerCase().includes('windows')
		? PPC_HOME_CANVAS_PARAMS.speed * 1.2
		: PPC_HOME_CANVAS_PARAMS.speed;
}

function addSplashFolder(pane, splash, webgl) {
	const splashFolder = pane.addFolder({ title: 'splash' });

	splashFolder.addBinding(splash, 'layoutName', {
		label: 'layout',
		options: nameOptions(splash.layout),
	});
	splashFolder.addBinding(splash, 'planeName', {
		label: 'plane',
		options: nameOptions(splash.plane),
	});
	splashFolder.addButton({ title: 'replay' }).on('click', () => {
		replayHomeSplash(
			webgl,
			splash.layoutName,
			splash.planeName,
		);
	});

	for (const key in splash) {
		if (key === 'layoutName' || key === 'planeName') continue;

		const value = splash[key];
		if (!isPlainObject(value)) {
			if (key === 'ease' && typeof value !== 'number') {
				addEaseBinding(splashFolder, splash, key, 'ease');
				continue;
			}
			splashFolder.addBinding(splash, key, {
				label: key,
				...numberBindingOptions(key, 'splash'),
			});
			continue;
		}

		for (const name in value) {
			const folder = splashFolder.addFolder({
				title: name,
				expanded: false,
			});
			bindObject(folder, value[name], name);
		}
	}
}

export function createHomeCanvasGui(webgl) {
	const search = new URLSearchParams(window.location.search);
	const animation = PPC_HOME_CANVAS_PARAMS.animation;
	const splash = animation.splash;
	const pane = new Pane({ title: 'PPC Home', expanded: false });

	const layoutName = search.get('splash');
	const planeName = search.get('plane');
	splash.layoutName = splash.layout[layoutName] ? layoutName : splash.layoutName;
	splash.planeName = splash.plane[planeName] ? planeName : splash.planeName;

	pane.addBinding(PPC_HOME_CANVAS_PARAMS, 'speed', {
		label: 'speed',
		...numberBindingOptions('speed', ''),
	}).on('change', () => {
		syncGridSpeed(webgl);
	});
	pane.addBinding(PPC_HOME_CANVAS_PARAMS, 'ease', {
		label: 'ease',
		...numberBindingOptions('ease', ''),
	}).on('change', () => {
		if (!webgl.grid) return;
		webgl.grid.ease = PPC_HOME_CANVAS_PARAMS.ease;
	});

	const autoscrollFolder = pane.addFolder({ title: 'autoscroll' });
	bindObject(autoscrollFolder, PPC_HOME_CANVAS_PARAMS.autoscroll, 'autoscroll');

	const animationScaleFolder = pane.addFolder({ title: 'animationScale' });
	bindObject(
		animationScaleFolder,
		PPC_HOME_CANVAS_PARAMS.animationScale,
		'animationScale',
	);

	for (const name in animation) {
		if (name === 'splash') {
			addSplashFolder(pane, splash, webgl);
			continue;
		}

		const folder = pane.addFolder({ title: name, expanded: false });
		bindObject(folder, animation[name], name);
	}
}
