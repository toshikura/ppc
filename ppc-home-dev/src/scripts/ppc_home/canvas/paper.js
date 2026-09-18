import * as THREE from 'three';
import { PPC_HOME_CANVAS_PARAMS } from './params';

const PAPER_VERTEX = /* glsl */ `
{
	float planeHeight = length(modelMatrix[1].xyz);
	float pin = 0.5 - position.y;
	float angle = uPaperBend * pow(pin, uPaperCurve);
	vec3 pivot = vec3(0.0, 0.5, 0.0);
	vec3 p = transformed - pivot;
	float worldY = p.y * planeHeight;
	float c = cos(angle);
	float s = sin(angle);
	transformed.y = pivot.y + worldY * c / planeHeight;
	transformed.z = worldY * s;
}
`;

export function applyPaperCompile(material) {
	const uniforms = {
		uPaperBend: { value: 0 },
		uPaperCurve: { value: 1.6 },
	};

	material.userData.paperUniforms = uniforms;
	material.onBeforeCompile = (shader) => {
		shader.uniforms.uPaperBend = uniforms.uPaperBend;
		shader.uniforms.uPaperCurve = uniforms.uPaperCurve;
		shader.vertexShader = shader.vertexShader
			.replace(
				'#include <common>',
				`#include <common>
uniform float uPaperBend;
uniform float uPaperCurve;`,
			)
			.replace(
				'#include <begin_vertex>',
				`#include <begin_vertex>
${PAPER_VERTEX}`,
			);
	};
	material.customProgramCacheKey = () => 'ppcHomePaperZoom';
}

export function getPaperGeometry(webgl) {
	const { x, y } =
		PPC_HOME_CANVAS_PARAMS.animation.transition.homeToSingle.zoom.segments;

	if (
		webgl.paperGeometry &&
		webgl.paperSegmentsX === x &&
		webgl.paperSegmentsY === y
	) {
		return webgl.paperGeometry;
	}

	if (webgl.paperGeometry) webgl.paperGeometry.dispose();

	webgl.paperGeometry = new THREE.PlaneGeometry(1, 1, x, y);
	webgl.paperSegmentsX = x;
	webgl.paperSegmentsY = y;

	return webgl.paperGeometry;
}

export function attachPaperGeometry(webgl, mesh) {
	mesh.geometry = getPaperGeometry(webgl);
	mesh.material.side = THREE.DoubleSide;
}

export function clearPaperDeform(webgl) {
	webgl.entries.forEach(({ mesh }) => {
		mesh.material.userData.paperUniforms.uPaperBend.value = 0;
		mesh.geometry = webgl.geometry;
		mesh.material.side = THREE.FrontSide;
	});
}
