import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type GrassPatchConfig = {
  key: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  count?: number;
  radius?: number;
  scale?: number;
  scaleRange?: [number, number];
  rotationJitter?: number;
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

// deterministic PRNG
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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

    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }
    windyMats.current = [];

    const tmpScale = new THREE.Vector3();

    const buildOneInstance = (base: GrassPatchConfig, rand: () => number) => {
      const radius = base.radius ?? 0;
      const baseScale = base.scale ?? 1;
      const scaleRange = base.scaleRange ?? [0.85, 1.15];
      const rotationJitter = base.rotationJitter ?? Math.PI;

      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * radius;
      const ox = Math.cos(a) * r;
      const oz = Math.sin(a) * r;

      const sMul = scaleRange[0] + (scaleRange[1] - scaleRange[0]) * rand();
      const s = baseScale * sMul;

      const instance = scene.clone(true);
      instance.position.set(
        base.position[0] + ox,
        base.position[1],
        base.position[2] + oz
      );

      const baseRot = base.rotation ?? [0, 0, 0];
      instance.rotation.set(
        baseRot[0],
        baseRot[1] + (rand() - 0.5) * rotationJitter,
        baseRot[2]
      );

      instance.scale.setScalar(s);
      instance.updateWorldMatrix(true, true);

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
    };

    patches.forEach((base) => {
      const seedFn = xmur3(base.key);
      const rand = mulberry32(seedFn());
      const count = base.count ?? 1;

      for (let i = 0; i < count; i++) buildOneInstance(base, rand);
    });
  }, [scene, patches]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mat of windyMats.current) {
      const uniforms = mat.userData.windUniforms;
      if (uniforms) {
        uniforms.uTime.value = t;
      }
    }
  });

  return <group ref={groupRef} />;
}

useGLTF.preload("/models/grass_patch.glb");
