/*!
 * Usagi Grid Scroll 1.0.5
 * Author: Kenta Toshikura
 * Last update: 2026/9/4
 * Require: gsap
*/

export default class UsagiGridScroll {

	constructor( props = {} ){

		//
		this.ready = false;
		this.stopped = true;
		this.props = props;

		//
		this.$html = document.querySelector('html');
		this.$html.classList.add('is-usg-grid-scroll');

		//
		this.wrapElem = props.el ?? document.querySelector('.usg-grid');
		this.bodyClassName = props.body ?? '.usg-grid-body';
		this.blockClassName = props.block ?? '.usg-grid-block';

		//
		this.bodyElem = this.wrapElem.querySelector(this.bodyClassName);
		if( !this.bodyElem ) return false;
		this.block = {
			origin : this.wrapElem.querySelectorAll(this.blockClassName),
			clone  : null
		};
		if( !this.block.origin ) return false;
		this.detail = {x:0, y:0 }
		this.delta1 = {x:0, y:0, }
		this.delta2 = {x:0, y:0, }

		//
		this.speed = props.speed ?? 100;
		this.ease = props.ease ? props.ease : 0.1;

		//
		this.accelerationEnable = props.accelerationEnable ?? true;
		this.accelerationDuration = props.accelerationDuration ?? 6;
		this.accelerationEase = props.accelerationEase ?? 'expo.out';
		this.acceleration = {
			delta : { x : 0, y : 0 },
			hitory : [],
			max : 1,
			tween : null,
			pow0 : {x  : 0, y  : 0, d  : 0 },
			pow1 : {x  : 0, y  : 0, d  : 0 },
			dir : {x : 0, y : 0 },
		};

		//
		this.position = { x : 0, y : 0 };
		this.scroll = {
			dir      : 'down',
			progress : 0,
			loop     : 0,
			x        : 0,
			y        : 0,
			top      : 0,
			left     : 0
		}
		this.autoscroll = {
			x : 0,
			y : 0
		};
		if (props.autoscroll) {
			this.autoscroll = props.autoscroll;
		}
		this.autoscrollOffset = {
			x : 0,
			y : 0
		};
		this.autoscrollProgress = 1;

		//
		this.events = {};

		//
		const t1 = (props?.timers?.complete) ? Number( props.timers.complete ) : 30;
		const t2 = (props?.timers?.resize) ? Number( props.timers.resize ) : 500;
		this.timers = {
			complete : {
				timer : null,
				wait : t1
			},
			resize : {
				timer : null,
				wait : t2
			}
		}

		//
		this.touch = {
			ratio : props.touchRatio ?? 1.5,
			ease  : props.touchEase  ?? 0.125,
			active : false,
			delta : {
				x:0,
				y:0
			},
			start : {
				x:0,
				y:0,
				delta : {
					x:0,
					y:0
				}
			},
			dist : {
				x:0,
				y:0
			},
			ing : {
				x:0,
				y:0
			},
			dir : {
				x:0,
				y:0
			},
			throw : {
				event  : null,
				buffer : {
					x:0,
					y:0
				}
			}
		};

		//
		this.array = [];
		this.content = {
			width  : 0,
			height : 0
		}

		//
		let _rx = props?.aspect?.x ? Math.max( props?.aspect?.x, 1 ) : 1;
		let _ry = props?.aspect?.y ? Math.max( props?.aspect?.y, 1 ) : 1;
		this.aspect = {
			x : _rx,
			y : _ry
		}

		//
		this.grid  = props.grid ?? 5;
		this.scale = props.scale ?? 1;
		this.autoScaleEnable = props.autoScale ?? true;
		this.autoScale = 1;

		//
		this.childWidth = 0;
		this.childHeight = 0;
		this.totalWidth = 0;
		this.totalHeight = 0;

		//
		this.translate = { x : 0, y : 0 };

		//
		if( this.block.origin.length && this.bodyElem ){
			this.runRabbit();
			this.ready = true;
			this.stopped = false;
		}

		//======================
		// function
		//======================
		if( typeof props.onUpdateBefore === 'function' ) this.onUpdateBefore = () => props.onUpdateBefore(this);
		if( typeof props.onUpdateAfter === 'function' ) this.onUpdateAfter = () => props.onUpdateAfter(this);
		if( typeof props.onDragStart === 'function' ) this.onDragStart = () => props.onDragStart(this);
		if( typeof props.onDragging === 'function' ) this.onDragging = () => props.onDragging(this);
		if( typeof props.onDragEnd === 'function' ) this.onDragEnd = () => props.onDragEnd(this);

	}

	stop(){
		this.stopped = true;
	}

	start(){
		this.stopped = false;
	}

	getRandom(arr, n) {
		let result = [];
		while (result.length < n) {
			const temp = arr.slice();
			let length = temp.length;
			for (let i = length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[temp[i], temp[j]] = [temp[j], temp[i]];
			}
			result = result.concat(temp);
		}
		return result.slice(0, n);
	}

	getCloneSource(origins, sourceIndexes, cellIndex) {
		const x = Math.floor(cellIndex / this.grid);
		const y = cellIndex % this.grid;
		const neighborIndexes = [];

		if (y > 0) neighborIndexes.push(cellIndex - 1);
		if (y === this.grid - 1) neighborIndexes.push(x * this.grid);

		if (x > 0) {
			const previousX = x - 1;
			neighborIndexes.push(previousX * this.grid + y);
			neighborIndexes.push(previousX * this.grid + (y + this.grid - 1) % this.grid);
			neighborIndexes.push(previousX * this.grid + (y + 1) % this.grid);
		}

		if (x === this.grid - 1) {
			neighborIndexes.push(y);
			neighborIndexes.push((y + this.grid - 1) % this.grid);
			neighborIndexes.push((y + 1) % this.grid);
		}

		const neighborSources = new Set(
			neighborIndexes.map((index) => sourceIndexes[index])
		);
		const sourceCounts = origins.map((origin, index) => (
			sourceIndexes.filter((sourceIndex) => sourceIndex === index).length
		));
		const candidates = origins
			.map((origin, index) => ({ origin, index }))
			.filter(({ index }) => !neighborSources.has(index));

		if (!candidates.length) {
			throw new Error('UsagiGridScroll could not place a non-adjacent clone.');
		}

		const minimumCount = Math.min(
			...candidates.map(({ index }) => sourceCounts[index])
		);
		const leastUsed = candidates.filter(
			({ index }) => sourceCounts[index] === minimumCount
		);

		return leastUsed[Math.floor(Math.random() * leastUsed.length)];
	}

	runRabbit(){
		this.initElements();
		this.initEvents();
		this.resize();
	}

	initElements(){

		//
		const g = this.grid * this.grid - (this.block.origin.length);

		//
		if( g != 0 ){
			if( g > 0 ){

				// 足りない場合は同じ要素が隣接しないように増やす
				const origins = [...this.block.origin];
				const sourceIndexes = origins.map((origin, index) => index);
				for (var i = 0; i < g; i++) {
					const source = this.getCloneSource(
						origins,
						sourceIndexes,
						sourceIndexes.length
					);
					const clone = source.origin.cloneNode(true);
					clone.classList.add('is-clone');
					this.bodyElem.appendChild(clone);
					sourceIndexes.push(source.index);
				}
				
			} else {

				// 多い場合はランダムに減らす
				const removeCount = Math.abs(g);
				const currentItems = [...this.bodyElem.querySelectorAll(this.blockClassName)];
				const toRemove = this.getRandom(currentItems, removeCount);
				toRemove.forEach((item) => {
					this.bodyElem.removeChild(item);
				});

			}
		}

		//
		this.block.clone = this.wrapElem.querySelectorAll(this.blockClassName);

		//
		this.array = [];
		this.block.clone.forEach( (v,i) =>{
			this.array.push({
				el : v,
				x : 0,
				y : 0,
				left : 0,
				top : 0,
				inview : false,
				min : {
					x : 0,
					y : 0,
				},
				max : {
					x : 0,
					y : 0,
				},
				rect : {
					width : 0,
					height : 0,
					top : 0,
					left : 0
				},
				position : {
					x : 0,
					y : 0,
				},
			});
		});

		//
		this.setPosition();

	}

	setPosition(){

		let index = 0;
		for (let x = 0; x < this.grid; x++) {
			for (let y = 0; y < this.grid; y++) {

				//
				const v = this.array[index];
				if( v ){
					v.position.x = x;
					v.position.y = y;
					v.el.dataset.x = x;
					v.el.dataset.y = y;
					// v.el.textContent = `(${x},${y})`;
					index++;
				}

			}
		}

	}


	getDetail(e){
		let delta = 0;
		const x = e.deltaX ? -(e.deltaX) : e.wheelDeltaX ? e.wheelDeltaX : -(e.detail);
		const y = e.deltaY ? -(e.deltaY) : e.wheelDeltaY ? e.wheelDeltaY : -(e.detail);
		const w = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
		const d = e.detail;
		if (d) {
			if (w) {
				delta = (w / d / 40 * d > 0) ? 1 : -1;	
			} else {
				delta = -d / 3;
			}
		} else {
			delta = w / 120;
		}
		if( d ) {
			if ( y ){
				let _x = x / d / 40 * d > 0 ? 1 : -1;
				let _y = y / d / 40 * d > 0 ? 1 : -1;
				return { x : _x , y : _y, d : delta }
			} else {
				let _x = 0;
				let _y = -d / 3;
				return { x : _x , y : _y, d : delta }
			}
		} else {
			let _x = x / 120;
			let _y = y / 120;
			return { x : _x , y : _y, d : delta }
		}

	}

	isWindowsOS() {
		return navigator.userAgent.toLowerCase().includes('windows');
	}

	onWheel( e ){
		if( !this.ready || this.stopped ) return false;
		const detail = this.getDetail(e);
		if (e.deltaX !== 0) {
			e.preventDefault();
		}
		this.detail.x = detail.x;
		this.detail.y = detail.y;
		this.delta1.x += -this.detail.x * this.speed;
		this.delta1.y += -this.detail.y * this.speed;
		this.ing = true;
		this.timers.complete.timer = setTimeout(()=>{ this.onComplete(); }, this.timers.complete.wait );
	}

	onTouchStart(e){

		//
		if( !this.ready || this.stopped ) return false;

		//
		if( e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL' ) return false;

		//
		this.$html.classList.add('is-usg-grid-scroll-dragging');

		//
		let x = e.clientX;
		let y = e.clientY;
		if( e.touches && e.touches[0] ){
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		}
		this.touch.start.x = x;
		this.touch.start.y = y;
		this.touch.dist.x  = 0;
		this.touch.dist.y  = 0;

		//
		if( e.touches && e.touches.length > 1) e.preventDefault();
		this.touch.start.delta.x = this.delta1.x;
		this.touch.start.delta.y = this.delta1.y;

		//
		this.touch.active = true;

	}
	onTouchMove(e){
		if( !this.ready || this.stopped ) return false;
		let x = e.clientX;
		let y = e.clientY;
		if( e.touches && e.touches[0] ){
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else if ( e.originalEvent && e.originalEvent.changedTouches[0] ) {
			x = e.originalEvent.changedTouches[0].clientX;
			y = e.originalEvent.changedTouches[0].clientY;
		}
		this.touch.ing.x  = x;
		this.touch.ing.y  = y;
		this.touch.dist.x = this.touch.start.x - x;
		this.touch.dist.y = this.touch.start.y - y;
		if( this.touch.active ){

			// X
			this.touch.delta.x = this.touch.dist.x * this.touch.ratio * Math.abs(1) + this.touch.start.delta.x;
			this.touch.dir.x = this.touch.dist.x > 0 ? 1:-1;
			this.touch.throw.buffer.x = window.innerHeight * 0.5;
			this.delta1.x = this.touch.delta.x;

			// Y
			this.touch.delta.y = this.touch.dist.y * this.touch.ratio * Math.abs(1) + this.touch.start.delta.y;
			this.touch.dir.y = this.touch.dist.y > 0 ? 1:-1;
			this.touch.throw.buffer.y = window.innerHeight * 0.5;
			this.delta1.y = this.touch.delta.y;

			//
			this.trigger('dragging');

		}
	}

	onTouchEnd(e){
		if( !this.ready || this.stopped ) return false;
		this.$html.classList.remove('is-usg-grid-scroll-dragging');
		this.touch.dist.x  = 0;
		this.touch.dist.y  = 0;
		this.touch.active = false;
		this.timers.complete.timer = setTimeout(()=>{ this.onComplete(); }, this.timers.complete.wait );
	}

	calcGrid() {

		this.aspectRatio = this.aspect.y / this.aspect.x;

		this.childWidth  = window.innerWidth / (this.grid - 1) * this.scale * this.autoScale;
		this.childHeight = window.innerWidth / (this.grid - 1) * this.aspectRatio * this.scale * this.autoScale;
		this.totalWidth  = this.childWidth * this.grid;
		this.totalHeight = this.childHeight * this.grid;

		this.translate.x = -this.totalWidth / 2 + window.innerWidth / 2;
		this.translate.y = -this.totalHeight / 2 + window.innerHeight / 2;

		for (let i = 0; i < this.array.length; i++) {
			const v = this.array[i];
			const w = parseInt( v.el.style.width );
			const h = parseInt( v.el.style.height );
			if( w != this.childWidth || h != this.childHeight  ){
				v.rect.width  = this.childWidth;
				v.rect.height = this.childHeight;
				v.el.style.width    = this.childWidth + 'px';
				v.el.style.height   = this.childHeight + 'px';
				v.el.style.position = 'absolute';
				v.el.style.top      = '0px';
				v.el.style.left     = '0px';
			}
		}

	}

	calcAutoScale(){
		const childWidth = window.innerWidth / (this.grid - 1) * this.scale;
		const childHeight = childWidth * (this.aspect.y / this.aspect.x);
		const totalWidth = childWidth * this.grid;
		const totalHeight = childHeight * this.grid;
		const minScaleX = window.innerWidth / (totalWidth - childWidth);
		const minScaleY = window.innerHeight / (totalHeight - childHeight);
		this.autoScale  = Math.max( minScaleX, minScaleY, 1 );
	}

	resize(){
		if( this.autoScaleEnable ){
			this.calcAutoScale();
		}
		this.calcGrid();
	}

	//
	getAcceleration( ratio = 1 ){
		if( this.acceleration.hitory.length > 2 ){
			this.acceleration.hitory.shift();
			this.acceleration.hitory.push({
				x : this.delta1.x,
				y : this.delta1.y
			});
		} else {
			this.acceleration.hitory.push({
				x : this.delta1.x,
				y : this.delta1.y
			});
		}
		if( this.acceleration.hitory.length > 2 ){
			this.acceleration.pow0.x = Math.min( Math.abs(( this.acceleration.hitory[0].x - this.acceleration.hitory[2].x ) * ratio ) , this.acceleration.max );
			this.acceleration.pow0.y = Math.min( Math.abs(( this.acceleration.hitory[0].y - this.acceleration.hitory[2].y ) * ratio ) , this.acceleration.max );
			this.acceleration.dir.x  = ( this.acceleration.hitory[0].x - this.acceleration.hitory[2].x ) < 0 ? -1 : 1;
			this.acceleration.dir.y  = ( this.acceleration.hitory[0].y - this.acceleration.hitory[2].y ) < 0 ? -1 : 1;
			const _x = this.acceleration.pow0.x * this.acceleration.dir.x;
			const _y = this.acceleration.pow0.y * this.acceleration.dir.y;
			const _d = this.clamp( Math.sqrt(this.acceleration.pow0.x * this.acceleration.pow0.x + this.acceleration.pow0.y * this.acceleration.pow0.y), 0, 1 );
			this.acceleration.tween = gsap.to( this.acceleration.pow1, {
				duration : this.accelerationDuration,
				ease     : this.accelerationEase,
				x        : _x,
				y        : _y,
				d        : _d
			});
		}
	}

	onResetTweens(){
		if( this.acceleration.tween ) this.acceleration.tween.kill(); this.acceleration.tween = null;
	}

	onComplete(){
		this.onResetTweens();
		this.ing = false;
	}

	clamp(value, min, max) {
		return Math.max(min, Math.min(value, max));
	}

	raf(){

		//
		if( !this.ready ) return false;

		//
		this.calcGrid();

		//
		this.scroll.x += ( this.delta1.x - this.scroll.x ) * this.ease;
		if ( 0.001 >= Math.abs(this.scroll.x) ) this.scroll.x = 0;

		//
		this.scroll.y += ( this.delta1.y - this.scroll.y ) * this.ease;
		if ( 0.001 >= Math.abs(this.scroll.y) ) this.scroll.y = 0;

		//
		this.autoscrollOffset.x = ( this.autoscrollOffset.x + this.autoscroll.x * this.autoscrollProgress ) % this.totalWidth;
		this.autoscrollOffset.y = ( this.autoscrollOffset.y + this.autoscroll.y * this.autoscrollProgress ) % this.totalHeight;
		this.scroll.left = ( this.scroll.x + this.autoscrollOffset.x ) % this.totalWidth;
		this.scroll.top = ( this.scroll.y + this.autoscrollOffset.y ) % this.totalHeight;

		//
		this.position.x = ( this.scroll.left % this.totalWidth / this.totalWidth );
		this.position.y = ( (this.scroll.top % this.totalHeight ) / this.totalHeight );

		//
		this.onUpdate();

		//
		this.getAcceleration(1);

		//
		this.trigger('update');

	}

	onUpdate(){

		for (let i = 0; i < this.array.length; i++) {
			const v = this.array[i];

			//
			let _x = (v.position.x * this.childWidth) + this.translate.x - this.scroll.left;
			let _y = (v.position.y * this.childHeight) + this.translate.y - this.scroll.top;

			// 下リピート
			if ( _y + this.childHeight < 0 ) {
				_y = _y + this.totalHeight;
			}

			// 上リピート
			if ( _y - window.innerHeight > 0) {
				_y = _y - this.totalHeight;
			}

			// 左リピート
			if ( _x - window.innerWidth > 0) {
				_x = _x - this.totalWidth;
			}

			// 右リピート
			if ( _x + this.childWidth < 0) {
				_x = _x + this.totalWidth;
			}

			//
			const inview_x = (_x + this.childWidth) > 0 && _x < window.innerWidth;
			const inview_y = (_y + this.childHeight) > 0 && _y < window.innerHeight;
			v.left = _x;
			v.top = _y;
			v.inview = inview_x && inview_y;
			if (v.inview) {
				v.el.style.transform = "translate3d(" + _x + "px, " + _y + "px, 0)";
				v.el.dataset.visible = 1;
			} else {
				v.el.dataset.visible = 0;
			}

		}

	}

	initEvents(){
		this.onWheel = this.onWheel.bind(this);
		this.resize = this.resize.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);
		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);
		window.addEventListener('wheel', this.onWheel, { passive: false });
		window.addEventListener('resize', this.resize );
		window.addEventListener('touchstart', this.onTouchStart, { passive: true });
		window.addEventListener('touchmove', this.onTouchMove, { passive: true });
		window.addEventListener('touchend', this.onTouchEnd );
		window.addEventListener('mousedown', this.onTouchStart );
		window.addEventListener('mousemove', this.onTouchMove );
		window.addEventListener('mouseup', this.onTouchEnd );
		document.addEventListener('mouseleave', this.onTouchEnd );
	}

	removeEvents(){
		window.removeEventListener('wheel', this.onWheel );
		window.removeEventListener('resize', this.resize );
		window.removeEventListener('touchstart', this.onTouchStart );
		window.removeEventListener('touchmove', this.onTouchMove );
		window.removeEventListener('touchend', this.onTouchEnd );
		window.removeEventListener('mousedown', this.onTouchStart );
		window.removeEventListener('mousemove', this.onTouchMove );
		window.removeEventListener('mouseup', this.onTouchEnd );
		document.removeEventListener('mouseleave', this.onTouchEnd );
	}

	on(event, handler) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(handler.bind(this));
	}

	trigger(event, args) {
		if (this.events[event]) {
			this.events[event].forEach(handler => handler(args));
		}
	}

	destroy(){
		this.$html.classList.remove('is-usg-grid-scroll');
		clearTimeout( this.timers.complete.timer );
		this.array = [];
		this.onResetTweens();
		this.removeEvents();
		this.events = {};
	}

	get scale() { return this._scale; }
	set scale( value ) { this._scale = value; }
	get speed() { return this._speed; }
	set speed( value ) { this._speed = value; }
	get ease() { return this._ease; }
	set ease( value ) { this._ease = value; }
	get aspect() { return this._aspect; }
	set aspect(value) {
		if (typeof value === 'object' && 'x' in value && 'y' in value) {
			this._aspect = {
				x: value.x,
				y: value.y
			};
		} else {
			console.warn('Invalid aspect value. It should be an object with x and y properties.');
		}
	}

}


























