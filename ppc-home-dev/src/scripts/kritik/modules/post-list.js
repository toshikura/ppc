import { updateHistoryRecord } from 'swup';
import { swup } from './swup';

let controller = null;

export function initPostList() {
	cleanupPostList();
	setupPostList();
}

function setupPostList() {
	const selectElement = document.querySelector('.js-select-work-category');
	const postItems = document.querySelectorAll('[data-category]');
	if (!selectElement) return;

	const urlParams = new URLSearchParams(window.location.search);
	const initialCategory = urlParams.get('category');
	const currentCountry =
		urlParams.get('country') && urlParams.get('country') !== 'all' ? urlParams.get('country') : '';
	if (initialCategory && initialCategory !== 'all') {
		const match = Array.from(selectElement.options).some((option) => option.value === initialCategory);
		if (match) selectElement.value = initialCategory;
	}

	let currentCategory = selectElement.value;

	function applyFiltering() {
		let visibleIndex = 0;
		postItems.forEach((item) => {
			const categories = item.dataset.category.split(',');
			const categoryHidden = currentCategory !== '' && !categories.includes(currentCategory);
			const countryHidden = currentCountry !== '' && item.dataset.country !== currentCountry;
			const hidden = categoryHidden || countryHidden;
			item.hidden = hidden;
			item.classList.toggle('is-odd', !hidden && visibleIndex % 2 === 0);
			item.classList.toggle('is-even', !hidden && visibleIndex % 2 === 1);
			if (!hidden) visibleIndex += 1;
		});
	}

	function syncUrl() {
		const url = new URL(window.location.href);
		if (currentCategory) {
			url.searchParams.set('category', currentCategory);
		} else {
			url.searchParams.delete('category');
		}
		if (currentCountry) {
			url.searchParams.set('country', currentCountry);
		} else {
			url.searchParams.delete('country');
		}
		updateHistoryRecord(url.toString());
	}

	applyFiltering();

	controller = new AbortController();
	selectElement.addEventListener(
		'change',
		() => {
			currentCategory = selectElement.value;
			applyFiltering();
			syncUrl();
		},
		{ signal: controller.signal },
	);
}

export function cleanupPostList() {
	if (!controller) return;
	controller.abort();
	controller = null;
}

swup.hooks.on('visit:start', cleanupPostList);
swup.hooks.on('page:view', initPostList);
initPostList();
