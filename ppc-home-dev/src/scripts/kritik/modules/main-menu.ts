import Lenis from 'lenis';
import type { Visit } from 'swup';
import { gsap } from 'gsap';
import { lenis } from './lenis.js';
import { swup } from './swup';

const transitionDuration = { in: 0.8, out: 0.5 };
const menuInactiveToggleText = '.js-menu-inactive-toggle-text';
const menuActiveToggleText = '.js-menu-active-toggle-text';
const menuActiveText = '.js-menu-active-text';

let isAnimating = false;
let pendingAction: (() => void) | null = null;
let menuLenis: Lenis | null = null;
let timeline: GSAPTimeline | null = null;
let swupElement: HTMLElement | null = null;
let controller: AbortController | null = null;

let container: HTMLElement | null = null;
let triggers: NodeListOf<Element>;
let menuLinks: NodeListOf<HTMLAnchorElement> | null = null;
let firstTabbable: HTMLElement | null = null;
let lastTabbable: HTMLElement | null = null;

function motionDuration(duration: number) {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches
		? 0
		: duration;
}

function isHomePage() {
	return document.documentElement.classList.contains('is-home');
}

function releaseMenuFocus() {
	const active = document.activeElement;
	const trigger = document.querySelector<HTMLButtonElement>('.js-menu-trigger');
	if (container && active instanceof HTMLElement && container.contains(active)) {
		trigger.focus({ preventScroll: true });
	}
}

export function toggleMenuText({ hide, show }: { hide: string; show: string }) {
	gsap.killTweensOf([hide, show]);
	gsap.set(hide, { opacity: 0 });
	gsap.set(show, { opacity: 1 });
}

function hideMenuOverlay() {
	container?.setAttribute('aria-hidden', 'true');
	document.documentElement.classList.remove('is-menu-open', 'is-menu-overlay');
	if (container) {
		gsap.set(container, { clearProps: 'opacity,pointerEvents' });
	}
}

export function toggleMenu() {
	if (isAnimating) {
		pendingAction = () => toggleMenu();
		return;
	}

	const isOpen = container?.getAttribute('aria-hidden') !== 'true';

	isAnimating = true;
	pendingAction = null;
	timeline?.kill();

	triggers?.forEach((trigger) =>
		trigger.setAttribute('aria-expanded', String(!isOpen)),
	);
	if (isOpen) {
		releaseMenuFocus();
		gsap.set(container, { pointerEvents: 'none' });
	} else {
		gsap.set(container, { opacity: 0, clearProps: 'pointerEvents' });
		gsap.set(menuActiveText, { opacity: 0 });
		container?.setAttribute('aria-hidden', 'false');
		document.documentElement.classList.add('is-menu-open', 'is-menu-overlay');
	}
	document
		.querySelector<HTMLElement>('#menu-logo')
		?.setAttribute('tabindex', String(isOpen ? '-1' : '0'));

	timeline = gsap.timeline({
		onComplete: () => {
			if (isOpen) {
				hideMenuOverlay();
			}
			isAnimating = false;
			if (pendingAction) {
				const action = pendingAction;
				pendingAction = null;
				action();
			}
		},
	});

	if (isOpen) {
		toggleMenuText({
			hide: menuActiveToggleText,
			show: menuInactiveToggleText,
		});
		timeline
			.to(menuActiveText, {
				opacity: 0,
				duration: motionDuration(transitionDuration.out),
				ease: 'power2.out',
			})
			.to(container, {
				opacity: 0,
				duration: motionDuration(transitionDuration.in),
				ease: 'power2.out',
				overwrite: 'auto',
				onStart: () => {
					document.documentElement.classList.remove('is-menu-overlay');
				},
			});
		if (!isHomePage()) {
			lenis.start();
		}
	} else {
		toggleMenuText({
			hide: menuInactiveToggleText,
			show: menuActiveToggleText,
		});
		timeline
			.to(container, {
				opacity: 1,
				duration: motionDuration(transitionDuration.out),
				ease: 'power2.out',
				overwrite: 'auto',
			})
			.to(menuActiveText, {
				opacity: 1,
				duration: motionDuration(transitionDuration.in),
				ease: 'power2.out',
			});
		lenis.stop();
	}
}

export function closeMenu() {
	const isOpen = container?.getAttribute('aria-hidden') !== 'true';
	if (isOpen) toggleMenu();
}

function handleKeyDownEsc(event: KeyboardEvent) {
	const isOpen = container?.getAttribute('aria-hidden') !== 'true';
	if (!isOpen || event.key !== 'Escape') return;
	event.preventDefault();
	if (isAnimating) {
		pendingAction = () => toggleMenu();
		return;
	}
	toggleMenu();
}

function handleCaptureClick(event: MouseEvent) {
	const menuLink = (event.target as HTMLElement).closest('.js-menu-link');
	if (menuLink && isAnimating) {
		event.stopPropagation();
		event.preventDefault();
		pendingAction = () => {
			(menuLink as HTMLElement).click();
		};
	}
}

function handleTriggerClick(event: Event) {
	if (
		!(event.currentTarget instanceof HTMLButtonElement) &&
		!(event.currentTarget instanceof HTMLAnchorElement)
	) {
		return;
	}

	const action = () => toggleMenu();

	if (isAnimating) {
		event.preventDefault();
		pendingAction = action;
		return;
	}
	action();
}

function normalizePath(path: string) {
	return `${path.replace(/index\.html$/, '').replace(/\/$/, '')}/`;
}

function syncCurrentLink() {
	const currentPath = normalizePath(window.location.pathname);

	document.querySelectorAll<HTMLAnchorElement>('.js-menu-item').forEach((link) => {
		const linkPath = normalizePath(new URL(link.href, document.baseURI).pathname);
		if (linkPath === currentPath) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	});
}

function init() {
	menuLenis?.destroy();
	controller?.abort();

	container = document.querySelector<HTMLElement>('#menu');
	triggers = document.querySelectorAll('.js-menu-trigger');

	if (!container || !triggers.length) {
		throw new Error('The site menu was not found.');
	}

	menuLinks = document.querySelectorAll<HTMLAnchorElement>('.js-menu-link');
	const tabbableElements = document.querySelectorAll<HTMLElement>(
		'#menu-logo, #menu-button, #menu a:not([tabindex="-1"]), #menu button:not([tabindex="-1"])',
	);
	firstTabbable = tabbableElements[0];
	lastTabbable = tabbableElements[tabbableElements.length - 1];

	menuLenis = new Lenis({
		wrapper: container,
		content:
			document.querySelector<HTMLElement>('.js-menu-content') || undefined,
		autoRaf: true,
	});

	controller = new AbortController();
	const { signal } = controller;

	window.addEventListener('keydown', handleKeyDownEsc, { signal });
	document.addEventListener('click', handleCaptureClick as EventListener, {
		capture: true,
		signal,
	});

	[...triggers, ...(menuLinks ?? [])].forEach((trigger) => {
		trigger.addEventListener('click', handleTriggerClick, { signal });
	});

	document
		.querySelector<HTMLElement>('#menu-logo a')
		?.addEventListener('click', () => closeMenu(), { signal });

	firstTabbable?.addEventListener(
		'keydown',
		(event: KeyboardEvent) => {
			if (event.key !== 'Tab' || !event.shiftKey) return;
			event.preventDefault();
			lastTabbable?.focus();
		},
		{ signal },
	);

	lastTabbable?.addEventListener(
		'keydown',
		(event: KeyboardEvent) => {
			if (event.key !== 'Tab' || event.shiftKey) return;
			event.preventDefault();
			firstTabbable?.focus();
		},
		{ signal },
	);
}

swup.hooks.on('visit:start', async (visit: Visit) => {
	if (container?.getAttribute('aria-hidden') === 'false' || isAnimating) {
		timeline?.kill();
		timeline = null;
		pendingAction = null;
		isAnimating = true;
		gsap.killTweensOf(container);
		gsap.killTweensOf(menuActiveText);
		if (container) {
			gsap.set(container, {
				visibility: 'visible',
				pointerEvents: 'none',
				opacity: 1,
			});
		}
		controller?.abort();
		await new Promise<void>((resolve) => {
			gsap.to(menuActiveText, {
				opacity: 0,
				duration: motionDuration(transitionDuration.out),
				ease: 'power2.out',
				onComplete: resolve,
				onInterrupt: resolve,
			});
		});
		releaseMenuFocus();
		hideMenuOverlay();
		if (container) {
			gsap.set(container, { clearProps: 'visibility,pointerEvents' });
		}
		pendingAction = null;
		isAnimating = false;
		triggers?.forEach((trigger) =>
			trigger.setAttribute('aria-expanded', 'false'),
		);
		toggleMenuText({
			hide: menuActiveToggleText,
			show: menuInactiveToggleText,
		});
		if (!isHomePage()) {
			lenis.start();
		}
	}

	controller?.abort();
	controller = null;
	menuLenis?.destroy();
	menuLenis = null;
	swupElement = null;

	if (visit.trigger.el?.classList.contains('js-menu-link')) {
		swupElement = document.querySelector<HTMLElement>('#swup');
		swupElement?.classList.add('is-menu-leave');
	}
});

swup.hooks.on('page:view', () => {
	swupElement?.classList.remove('is-menu-leave');
	syncCurrentLink();
	init();
});

init();
syncCurrentLink();
