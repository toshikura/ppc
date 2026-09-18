import { swup } from '../../kritik/modules/swup';
import { isMobile, mobileQuery } from '../device';

export default class UiFilter {
	static instances = [];
	static measure = null;

	constructor(el) {
		this.el = el;
		this.trigger = el.querySelector('.ui-filter-trigger');
		this.menu = el.querySelector('.ui-filter-menu');
		this.select = el.querySelector('.js-ui-filter-value');
		this.options = el.querySelectorAll('.js-ui-filter-option');

		if (!this.trigger) {
			throw new Error('ui-filter-trigger was not found.');
		}
		if (!this.menu) {
			throw new Error('ui-filter-menu was not found.');
		}
		if (!this.select) {
			throw new Error('js-ui-filter-value was not found.');
		}

		this.onTriggerClick = this.onTriggerClick.bind(this);
		this.onOptionClick = this.onOptionClick.bind(this);
		this.onSelectChange = this.onSelectChange.bind(this);
		this.fitSelectWidth = this.fitSelectWidth.bind(this);

		this.select.addEventListener('change', this.onSelectChange);
		this.syncInteraction();
		this.syncSelected();
		this.fitSelectWidth();
		document.fonts.ready.then(this.fitSelectWidth);

		UiFilter.instances.push(this);
	}

	fitSelectWidth() {
		const measure = UiFilter.measure;
		const style = getComputedStyle(this.select);
		measure.style.fontFamily = style.fontFamily;
		measure.style.fontSize = style.fontSize;
		measure.style.fontWeight = style.fontWeight;
		measure.style.letterSpacing = style.letterSpacing;
		measure.textContent = this.select.selectedOptions[0].textContent;
		this.select.style.width = `${measure.getBoundingClientRect().width}px`;
	}

	open() {
		this.el.classList.add('is-open');
	}

	close() {
		this.el.classList.remove('is-open');
	}

	onTriggerClick() {
		if (this.el.classList.contains('is-open')) {
			this.close();
		} else {
			this.open();
		}
	}

	syncSelected() {
		const value = this.select.value;
		this.options.forEach((option) => {
			option.classList.toggle('is-selected', option.dataset.value === value);
		});
	}

	onOptionClick(event) {
		this.select.value = event.currentTarget.dataset.value;
		this.syncSelected();
		this.fitSelectWidth();
		this.close();
	}

	onSelectChange() {
		this.syncSelected();
		this.fitSelectWidth();
	}

	unbindCustomMenu() {
		this.trigger.removeEventListener('click', this.onTriggerClick);
		this.options.forEach((option) => {
			option.removeEventListener('click', this.onOptionClick);
		});
	}

	bindCustomMenu() {
		this.trigger.addEventListener('click', this.onTriggerClick);
		this.options.forEach((option) => {
			option.addEventListener('click', this.onOptionClick);
		});
	}

	syncInteraction() {
		this.close();
		this.unbindCustomMenu();
		this.select.disabled = !isMobile();

		if (this.select.disabled) {
			this.bindCustomMenu();
		}
	}

	destroy() {
		this.select.removeEventListener('change', this.onSelectChange);
		this.unbindCustomMenu();
		this.close();
		UiFilter.instances = UiFilter.instances.filter((filter) => filter !== this);
	}

	static destroy() {
		document.querySelectorAll('.js-ui-filter-form').forEach((form) => {
			form.removeEventListener('submit', UiFilter.onFormSubmit);
		});
		UiFilter.instances.slice().forEach((filter) => filter.destroy());
	}

	static init() {
		if (!UiFilter.measure) {
			UiFilter.measure = document.createElement('span');
			UiFilter.measure.setAttribute('aria-hidden', 'true');
			UiFilter.measure.style.cssText =
				'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;';
			document.body.appendChild(UiFilter.measure);
		}

		document.querySelectorAll('.js-ui-filter').forEach((el) => {
			new UiFilter(el);
		});

		document.querySelectorAll('.js-ui-filter-form').forEach((form) => {
			form.addEventListener('submit', UiFilter.onFormSubmit);
		});
	}

	static onFormSubmit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const url = new URL(form.action);
		form.querySelectorAll('.js-ui-filter-value').forEach((select) => {
			if (select.name && select.value && select.value !== 'all') {
				url.searchParams.set(select.name, select.value);
			}
		});
		swup.navigate(url.pathname + url.search);
	}

	static onDocumentClick(event) {
		UiFilter.instances.forEach((filter) => {
			if (!filter.el.contains(event.target)) {
				filter.close();
			}
		});
	}

	static onNativeSelectQueryChange() {
		UiFilter.instances.forEach((filter) => {
			filter.syncInteraction();
			filter.fitSelectWidth();
		});
	}
}

document.addEventListener('click', UiFilter.onDocumentClick);
mobileQuery.addEventListener('change', UiFilter.onNativeSelectQueryChange);
UiFilter.init();
swup.hooks.on('visit:start', () => {
	UiFilter.destroy();
});
swup.hooks.on('page:view', () => {
	UiFilter.init();
});
