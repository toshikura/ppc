import { swup } from '../swup';

const menu = document.querySelector('#site-menu');
const trigger = document.querySelector('.site-navigation__toggle');
const links = document.querySelectorAll<HTMLAnchorElement>('.site-menu__link');

if (!(menu instanceof HTMLElement)) {
	throw new Error('The site menu was not found.');
}

if (!(trigger instanceof HTMLButtonElement)) {
	throw new Error('The site menu trigger was not found.');
}

function setMenuOpen(isOpen: boolean) {
	menu.setAttribute('aria-hidden', String(!isOpen));
	trigger.setAttribute('aria-expanded', String(isOpen));
	document.documentElement.classList.toggle('is-menu-open', isOpen);
}

function normalizePath(path: string) {
	return `${path.replace(/index\.html$/, '').replace(/\/$/, '')}/`;
}

function syncCurrentLink() {
	const currentPath = normalizePath(window.location.pathname);

	links.forEach((link) => {
		if (link.dataset.path === currentPath) {
			link.setAttribute('aria-current', 'page');
		} else {
			link.removeAttribute('aria-current');
		}
	});
}

trigger.addEventListener('click', () => {
	setMenuOpen(menu.getAttribute('aria-hidden') === 'true');
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') {
		setMenuOpen(false);
		trigger.focus();
	}
});

links.forEach((link) => {
	link.addEventListener('click', () => setMenuOpen(false));
});

syncCurrentLink();
swup.hooks.on('visit:start', () => setMenuOpen(false));
swup.hooks.on('page:view', syncCurrentLink);
