import type { JSX } from "react";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";
import * as THREE from "three";

export default function Windmill(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/netherlands/windmill.512.glb", {
    targetHeight: 1.9,
    sitOnGround: true,
  });

  useAutoShadows(root);

  const blades = useMemo(() => {
    const b = root.getObjectByName("Windmill_Meshblades");
    if (!b) {
      console.warn("Blades not found. Available objects:");
      root.traverse((o) => o.name && console.log(o.name));
    }
    return b as THREE.Object3D | null;
  }, [root]);

  useFrame((_, delta) => {
    if (blades) blades.rotation.z += delta;
  });

  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/netherlands/windmill.512.glb");
