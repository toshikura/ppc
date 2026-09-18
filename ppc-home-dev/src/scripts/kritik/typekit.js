(function (d) {
	var config = { kitId: 'dlr2ezd', scriptTimeout: 3000, async: true };
	var h = d.documentElement;
	var t = setTimeout(function () {
		h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
	}, config.scriptTimeout);
	var tk = d.createElement('script');
	var f = false;
	var s = d.getElementsByTagName('script')[0];
	var a;
	h.className += ' wf-loading';
	tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
	tk.async = true;
	tk.onload = tk.onreadystatechange = function () {
		a = this.readyState;
		if (f || (a && a !== 'complete' && a !== 'loaded')) return;
		f = true;
		clearTimeout(t);
		try {
			window.Typekit.load(config);
		} catch (e) {
			h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
		}
	};
	tk.onerror = function () {
		clearTimeout(t);
		h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
	};
	s.parentNode.insertBefore(tk, s);
})(document);
