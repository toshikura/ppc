export function withBase(path) {
	const relative = path.replace(/^\/+/, '');
	if (import.meta.env.PROD) {
		return `./${relative}`;
	}
	return `${import.meta.env.BASE_URL}${relative}`;
}

export function getSitePath(pathname, baseUrl = import.meta.env.BASE_URL) {
	let path = pathname.replace(/index\.html$/, '');
	if (baseUrl && baseUrl !== '/' && !baseUrl.startsWith('.')) {
		const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
		if (path.startsWith(prefix)) {
			path = `/${path.slice(prefix.length)}`;
		} else if (path === prefix.replace(/\/$/, '')) {
			path = '/';
		}
	}
	return path.replace(/^\/+/, '');
}

export function pathKey(path) {
	const normalized = path.replace(/index\.html$/, '').replace(/^\.\//, '/');
	return normalized.replace(/\/$/, '') || '/';
}
