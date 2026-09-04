import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const EASES = {
	none: 'none',
	'power1.out': 'power1.out',
	'power2.inOut': 'power2.inOut',
	'power3.inOut': 'power3.inOut',
	'power4.out': 'power4.out',
	'expo.out': 'expo.out',
	t1: CustomEase.create(
		't1',
		'M0,0 C0.072,0 0.142,0.064 0.192,0.126 0.252,0.201 0.322,0.375 0.375,0.514 0.419,0.63 0.478,0.832 0.584,0.924 0.657,0.988 0.869,1 1,1 ',
	),
};

export const PPC_HOME_CANVAS_PARAMS = {
	res: 0.75, // res
	fov: 35, // fov
	grid: 6, // grid
	scale: 1, // scale
	autoScale: true, // autoScale
	aspect: { x: 1, y: 1 }, // aspect : 比率
	speed: 100, // speed : windowsでは1.2倍推奨
	ease: 0.1, // ease
	autoscroll: {
		x: 0, // autoscroll x : フレームごとの移動量
		y: 0.2, // autoscroll y : フレームごとの移動量
	},
	animation: {
		splash: {
			layoutName: 'static', // layout
			planeName: 'fadein', // plane
			dragStart: 0.6, // dragStart : 1 = splash完了時
			layout: {
				static: {
					delay: 0, // delay
					duration: 1.25, // duration
					stagger: 0.035, // stagger
					ease: EASES.t1, // ease
				},
				card: {
					delay: 0.4, // delay
					duration: 1.75, // duration
					stagger: 0.065, // stagger
					ease: EASES.t1, // ease
					stack: {
						offsetX: 1.25, // x
						offsetY: 2.5, // y
						depth: 0.01, // depth
						visibleLayers: 6, // visibleLayers
					},
				},
				slide: {
					delay: 0.2, // delay
					duration: 1.75, // duration
					stagger: 0.055, // stagger
					ease: EASES.t1, // ease
					outside: 0, // outside
					offset: {
						x: 0.1, // x : 画面外距離に対する開始位置の倍率（一方向）
						y: 1, // y : 画面外距離に対する開始位置の倍率
					},
				},
				tornado: {
					delay: 0.2, // delay
					duration: 1.5, // duration
					stagger: 0.04, // stagger
					ease: 'power2.out', // ease
					turns: .25, // turns : 中心から到達までの追加回転数
					radius: 0.2, // radius : 開始半径
					distance: .1, // distance : 距離による duration の影響
					depth: 0.01, // depth
				},
			},
			plane: {
				fadein: {
					rotation: {
						enabled: false, // enabled
						rand: false, // rand : true なら from を -n ~ n
						from: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 0, // z : deg
						},
						to: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 0, // z : deg
						},
					},
					scale: {
						enabled: false, // enabled
						from: 1, // from
						to: 1, // to
					},
					opacity: {
						enabled: true, // enabled
						from: 0, // from
						to: 1, // to
					},
				},
				zoom: {
					rotation: {
						enabled: false, // enabled
						rand: false, // rand : true なら from を -n ~ n
						from: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 0, // z : deg
						},
						to: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 0, // z : deg
						},
					},
					scale: {
						enabled: true, // enabled
						from: 0.75, // from
						to: 1, // to
					},
					opacity: {
						enabled: false, // enabled
						from: 0, // from
						to: 1, // to
					},
				},
				pile: {
					rotation: {
						enabled: true, // enabled
						rand: true, // rand : true なら from を -n ~ n
						from: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 5, // z : deg
						},
						to: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 0, // z : deg
						},
					},
					scale: {
						enabled: true, // enabled
						from: 0.95, // from
						to: 1, // to
					},
					opacity: {
						enabled: false, // enabled
						from: 0, // from
						to: 1, // to
					},
				},
				flip: {
					rotation: {
						enabled: true, // enabled
						rand: false, // rand : true なら from を -n ~ n
						origin: {
							x: -0.5, // x : 回転基準（0が中心、-0.5が左端）
							y: 0, // y : 回転基準（0が中心、-0.5が下端）
							z: 0, // z : 回転基準
						},
						from: {
							x: 0, // x : deg
							y: -120, // y : deg
							z: 0, // z : deg
						},
						to: {
							x: 0, // x : deg
							y: 0, // y : deg
							z: 0, // z : deg
						},
					},
					scale: {
						enabled: true, // enabled
						from: 0.95, // from
						to: 1, // to
					},
					opacity: {
						enabled: false, // enabled
						from: 0, // from
						to: 1, // to
					},
				},
			},
		},
		transition: {
			leave: {
				zoom: {
					duration: 2, // duration
					ease: EASES.t1, // ease
				},
				fadeout: {
					duration: 1, // duration
					ease: EASES.t1, // ease
				},
			},
			enter: {
				fadein: {
					duration: 1, // duration
					ease: EASES.t1, // ease
				},
			},
		},
	},
};
