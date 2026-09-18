export const mobileQuery = window.matchMedia('(width < 37.5em)'); // --breakpoint-sm: 600px

export function isMobile() {
	return mobileQuery.matches;
}
