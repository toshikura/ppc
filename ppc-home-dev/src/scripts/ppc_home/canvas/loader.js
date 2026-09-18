import * as THREE from 'three';
import { getPlaneSize } from './grid';

function selectSource(sources, planeWidth, pixelRatio) {
	if (planeWidth <= 800 || pixelRatio <= 1) {
		return sources.medium;
	}

	return sources.large;
}

function getTextureSources(item) {
	if (item.media === 'image') {
		return item.sources;
	}

	if (item.media === 'video') {
		if (!item.poster) {
			throw new Error(`Video poster was not found: ${item.id}`);
		}

		return item.poster;
	}

	throw new Error(`Unsupported media type: ${item.media}`);
}

export function loadPlaneTextures(webgl) {
	if (webgl.loadPromise) return webgl.loadPromise;

	const textureLoader = new THREE.TextureLoader();
	webgl.loadPromise = Promise.all(
		webgl.items.map((item, index) => {
			const { width } = getPlaneSize(webgl, item);
			const source = selectSource(
				getTextureSources(item),
				width,
				webgl.renderer.getPixelRatio(),
			);

			return textureLoader.loadAsync(source.url).then((texture) => ({
				index,
				texture,
			}));
		}),
	).then((loadedTextures) => {
		loadedTextures.forEach(({ index, texture }) => {
			texture.colorSpace = THREE.SRGBColorSpace;
			texture.generateMipmaps = false;
			texture.minFilter = THREE.LinearFilter;
			webgl.textures[index] = texture;
		});
	});

	return webgl.loadPromise;
}
