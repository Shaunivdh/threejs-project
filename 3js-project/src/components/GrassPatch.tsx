import type { JSX } from "react";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useGLTF } from "@react-three/drei";

type UniformNumber = { value: number };
type UniformVec2 = { value: THREE.Vector2 };

type ShaderLike = {
  uniforms: Record<string, any>;
  vertexShader: string;
  fragmentShader: string;
};

type WindUniforms = {
  uTime: UniformNumber;
  uAmplitudeBase: UniformNumber;
  uFrequency: UniformNumber;
  uWindDir: UniformVec2;
  uMinY: UniformNumber;
  uMaxY: UniformNumber;
  uScaleComp: UniformNumber;
};

type WindyMaterial = THREE.Material & {
  userData: {
    shader?: ShaderLike;
    windUniforms?: WindUniforms;
  };
};

function isSupportedMaterial(mat: THREE.Material): mat is
  | THREE.MeshBasicMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshStandardMaterial
  | THREE.MeshPhysicalMaterial {
  return Boolean(
    (mat as any).isMeshBasicMaterial ||
    (mat as any).isMeshLambertMaterial ||
    (mat as any).isMeshPhongMaterial ||
    (mat as any).isMeshStandardMaterial ||
    (mat as any).isMeshPhysicalMaterial
  );
}

function patchMaterial(
  mat: WindyMaterial,
  minY: number,
  maxY: number,
  scaleComp: number
): boolean {
  if (!isSupportedMaterial(mat)) return false;

  const uniforms: WindUniforms =
    mat.userData.windUniforms ?? ({
      uTime: { value: 0 },
      uAmplitudeBase: { value: 0.15 },
      uFrequency: { value: 1.3 },
      uWindDir: { value: new THREE.Vector2(1, 0).normalize() },
      uMinY: { value: minY },
      uMaxY: { value: maxY },
      uScaleComp: { value: scaleComp },
    } as WindUniforms);

  uniforms.uScaleComp.value = scaleComp;
  uniforms.uMinY.value = minY;
  uniforms.uMaxY.value = maxY;

  mat.userData.windUniforms = uniforms;

  mat.onBeforeCompile = (shader: ShaderLike) => {
    mat.userData.shader = shader;
    Object.assign(shader.uniforms, uniforms);

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

export default function GrassPatch(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/grasspatch.glb", { targetHeight: 0.25, sitOnGround: true });
  const windyMats = useRef<WindyMaterial[]>([]);

  useEffect(() => {
    windyMats.current = [];
    root.updateWorldMatrix(true, true);

    const tmpScale = new THREE.Vector3();

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!(mesh as any).isMesh || !mesh.geometry) return;

      tmpScale.setFromMatrixScale(mesh.matrixWorld);
      const avgScale = (tmpScale.x + tmpScale.y + tmpScale.z) / 3;
      const scaleComp = avgScale > 1e-6 ? 1 / avgScale : 1;

      const geo = mesh.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      const minY = bb.min.y;
      const maxY = bb.max.y;

      const addMat = (m: THREE.Material) => {
        if (patchMaterial(m as WindyMaterial, minY, maxY, scaleComp)) {
          windyMats.current.push(m as WindyMaterial);
        }
      };

      const material = mesh.material as THREE.Material | THREE.Material[];
      if (Array.isArray(material)) material.forEach(addMat);
      else if (material) addMat(material);
    });
  }, [root]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mat of windyMats.current) {
      mat.userData.windUniforms && (mat.userData.windUniforms.uTime.value = t);
    }
  });

  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/grasspatch.glb");
