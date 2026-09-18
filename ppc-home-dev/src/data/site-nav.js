import { withBase } from '../utils/paths';

export const MENU_LINKS = [
	{ label: 'Home', href: withBase('') },
	{ label: 'Prologue', href: withBase('prologue/') },
	{ label: 'Episode', href: withBase('episode/') },
	{ label: 'Scene', href: withBase('scene/') },
	{ label: 'Epilogue', href: withBase('epilogue/') },
	{ label: 'About', href: withBase('about/') },
	{ label: 'Partner', href: withBase('partner/') },
	{ label: 'Belong', href: withBase('belong/') },
	{ label: 'Gestalting', href: withBase('gestalting/') },
	{ label: 'Exodus', href: withBase('exodus/') },
	{ label: 'Contact', href: withBase('contact/') },
];

export const NEXT_PAGES = {
	prologue: { title: 'Episode', href: withBase('episode/') },
	episode: { title: 'Scene', href: withBase('scene/') },
	scene: { title: 'Epilogue', href: withBase('epilogue/') },
	epilogue: { title: 'About', href: withBase('about/') },
	about: { title: 'Partner', href: withBase('partner/') },
	partner: { title: 'Gestalting', href: withBase('gestalting/') },
	gestalting: { title: 'Exodus', href: withBase('exodus/') },
	exodus: { title: 'Open a Dialogue', href: withBase('contact/') },
	belong: { title: 'Apply Now', href: withBase('contact/') },
};
