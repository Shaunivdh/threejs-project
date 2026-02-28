import type { JSX } from "react";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

type WindUniforms = {
  uTime: { value: number };
  uAmplitudeBase: { value: number };
  uFrequency: { value: number };
  uWindDir: { value: THREE.Vector2 };
  uMinY: { value: number };
  uMaxY: { value: number };
  uScaleComp: { value: number };
};

type WindyMaterial = THREE.Material & {
  userData: THREE.Material["userData"] & {
    windUniforms?: WindUniforms;
  };
};

type SupportedMaterial =
  | THREE.MeshBasicMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshStandardMaterial
  | THREE.MeshPhysicalMaterial;

function isSupportedMaterial(mat: THREE.Material): mat is SupportedMaterial {
  return (
    (mat as THREE.MeshBasicMaterial).isMeshBasicMaterial === true ||
    (mat as THREE.MeshLambertMaterial).isMeshLambertMaterial === true ||
    (mat as THREE.MeshPhongMaterial).isMeshPhongMaterial === true ||
    (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial === true ||
    (mat as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial === true
  );
}

function patchMaterial(
  mat: WindyMaterial,
  minY: number,
  maxY: number,
  scaleComp: number
): boolean {
  if (!isSupportedMaterial(mat)) return false;

  const uniforms: WindUniforms = mat.userData.windUniforms ?? {
    uTime: { value: 0 },
    uAmplitudeBase: { value: 0.15 },
    uFrequency: { value: 1.3 },
    uWindDir: { value: new THREE.Vector2(1, 0).normalize() },
    uMinY: { value: minY },
    uMaxY: { value: maxY },
    uScaleComp: { value: scaleComp },
  };

  uniforms.uScaleComp.value = scaleComp;
  uniforms.uMinY.value = minY;
  uniforms.uMaxY.value = maxY;

  mat.userData.windUniforms = uniforms;

  mat.onBeforeCompile = (shader) => {
    const shaderUniforms = shader.uniforms as Record<
      string,
      { value: unknown }
    >;
    const windUniforms = uniforms as unknown as Record<
      string,
      { value: unknown }
    >;
    Object.assign(shaderUniforms, windUniforms);

    shader.vertexShader =
      `
      uniform float uTime;
      uniform float uAmplitudeBase;
      uniform float uFrequency;
      uniform vec2  uWindDir;
      uniform float uMinY;
      uniform float uMaxY;
      uniform float uScaleComp;
      ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      float denom = max(uMaxY - uMinY, 1e-5);
      float heightFactor = clamp((transformed.y - uMinY) / denom, 0.0, 1.0);
      float phase = (transformed.x * 0.75 + transformed.z * 0.35) * uFrequency;
      float sway = sin(phase + uTime * 1.5) * 0.85 + sin(phase * 2.3 + uTime * 0.9) * 0.15;
      float amp = uAmplitudeBase * uScaleComp;
      transformed.x += amp * sway * uWindDir.x * heightFactor;
      transformed.z += amp * sway * uWindDir.y * heightFactor;
      `
    );
  };

  mat.needsUpdate = true;
  return true;
}

export default function Grass(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/grass.glb", {
    targetHeight: 0.45,
    sitOnGround: true,
  });

  useAutoShadows(root);

  const windyMats = useRef<WindyMaterial[]>([]);

  useEffect(() => {
    windyMats.current = [];
    root.updateWorldMatrix(true, true);

    const tmpScale = new THREE.Vector3();

    root.traverse((obj: THREE.Object3D) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const mesh = obj as THREE.Mesh;

      tmpScale.setFromMatrixScale(mesh.matrixWorld);
      const avgScale = (tmpScale.x + tmpScale.y + tmpScale.z) / 3;
      const scaleComp = avgScale > 1e-6 ? 1 / avgScale : 1;

      const geo = mesh.geometry;
      if (!geo.boundingBox) {
        geo.computeBoundingBox();
      }
      const bb = geo.boundingBox as THREE.Box3;
      const minY = bb.min.y;
      const maxY = bb.max.y;

      const addMat = (material: THREE.Material): void => {
        const windy = material as WindyMaterial;
        if (patchMaterial(windy, minY, maxY, scaleComp)) {
          windyMats.current.push(windy);
        }
      };

      const material = mesh.material;
      if (Array.isArray(material)) {
        material.forEach(addMat);
      } else if (material) {
        addMat(material);
      }
    });
  }, [root]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mat of windyMats.current) {
      const uniforms = mat.userData.windUniforms;
      if (uniforms) {
        uniforms.uTime.value = t;
      }
    }
  });

  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/grass.glb");
