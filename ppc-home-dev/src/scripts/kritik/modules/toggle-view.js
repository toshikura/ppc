import { swup } from './swup';
import { cleanupPostList, initPostList } from './post-list';

let controller = null;

function init() {
	controller?.abort();

	const container = document.querySelector('.js-toggle-view');
	if (!container) return;

	const triggers = container.querySelectorAll('button[data-view]');
	const storedViewValue = localStorage.getItem('viewMode') ?? 'image';
	const supportedViews = Array.from(triggers, (trigger) => trigger.dataset.view);
	const storedView = supportedViews.includes(storedViewValue) ? storedViewValue : 'image';

	container.dataset.view = storedView;
	triggers.forEach((trigger) => {
		trigger.disabled = trigger.dataset.view === storedView;
	});

	cleanupPostList();
	initPostList();

	controller = new AbortController();
	const { signal } = controller;

	triggers.forEach((trigger) => {
		trigger.addEventListener(
			'click',
			({ currentTarget }) => {
				const nextView = currentTarget.dataset.view;
				container.dataset.view = nextView;
				triggers.forEach((button) => {
					button.disabled = button.dataset.view === nextView;
				});
				localStorage.setItem('viewMode', nextView);

				cleanupPostList();
				initPostList();
			},
			{ signal },
		);
	});
}

swup.hooks.on('visit:start', () => {
	controller?.abort();
	controller = null;
});
swup.hooks.on('page:view', init);
init();
