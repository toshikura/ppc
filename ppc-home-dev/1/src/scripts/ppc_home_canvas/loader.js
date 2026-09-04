import * as THREE from 'three';
import { getPlaneSize } from './grid';

function selectSource(sources, requiredWidth) {
	return (
		sources.find(({ width }) => width >= requiredWidth) ??
		sources[sources.length - 1]
	);
}

export function loadPlaneTextures(webgl) {
	if (webgl.loadPromise) return webgl.loadPromise;

	const textureLoader = new THREE.TextureLoader();
	webgl.loadPromise = Promise.all(
		webgl.items.map((item, index) => {
			if (item.media !== 'image') {
				throw new Error(`Unsupported media type: ${item.media}`);
			}

			const { width } = getPlaneSize(webgl, item);
			const source = selectSource(
				item.sources,
				width * webgl.renderer.getPixelRatio(),
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
