import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type GrassPatchConfig = {
  key: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

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
  userData: {
    shader?: any;
    windUniforms?: WindUniforms;
  };
};

function isSupportedMaterial(mat: THREE.Material): boolean {
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
    mat.userData.windUniforms ??
    ({
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

  mat.onBeforeCompile = (shader: any) => {
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

export default function GrassPatches({
  patches,
}: {
  patches: GrassPatchConfig[];
}) {
  const { scene } = useGLTF("/models/grass_patch.glb");
  const groupRef = useRef<THREE.Group>(null);
  const windyMats = useRef<WindyMaterial[]>([]);

  useEffect(() => {
    if (!groupRef.current) return;

    // Clear previous instances
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }
    windyMats.current = [];

    // Create instances for each patch
    patches.forEach((config) => {
      const instance = scene.clone(true);
      instance.position.set(...config.position);
      if (config.rotation) {
        instance.rotation.set(...config.rotation);
      }
      if (config.scale) {
        instance.scale.setScalar(config.scale);
      }

      instance.updateWorldMatrix(true, true);

      const tmpScale = new THREE.Vector3();

      instance.traverse((obj) => {
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
          const clonedMat = m.clone();
          if (
            patchMaterial(clonedMat as WindyMaterial, minY, maxY, scaleComp)
          ) {
            windyMats.current.push(clonedMat as WindyMaterial);
            mesh.material = clonedMat;
          }
        };

        const material = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(material)) material.forEach(addMat);
        else if (material) addMat(material);
      });

      groupRef.current!.add(instance);
    });
  }, [scene, patches]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mat of windyMats.current) {
      mat.userData.windUniforms && (mat.userData.windUniforms.uTime.value = t);
    }
  });

  return <group ref={groupRef} />;
}

useGLTF.preload("/models/grass_patch.glb");

// Usage in Scene.tsx:
// <GrassPatches patches={[
//   { key: "grass1", position: [1, 0, -0.5], rotation: [0, -Math.PI / 2.25, 0] },
//   { key: "grass2", position: [1, 0, 0], rotation: [0, -Math.PI / 2.25, 0] }
// ]} />
