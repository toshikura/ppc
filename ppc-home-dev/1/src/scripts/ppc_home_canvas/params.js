export const PPC_HOME_CANVAS_PARAMS = {
	res: 0.75, // res
	grid: 5, // grid
	scale: 1, // scale
	autoScale: true, // autoScale
	aspect: { x: 1, y: 1 }, // aspect : 比率
	speed: 100, // speed : windowsでは1.2倍推奨
	ease: 0.1, // ease
	animation: {
		transition: {
			zoom: {
				duration: 1.2,
				ease: 'power2.inOut',
			},
			fadeout: {
				duration: 1,
				ease: 'power2.inOut',
			}
		}
	}
};
