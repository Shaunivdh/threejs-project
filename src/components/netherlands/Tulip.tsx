import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";
import * as THREE from "three";

export default function Tulip(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/netherlands/tulip.glb", {
    targetHeight: 0.5,
    sitOnGround: true,
  });

  const groupRef = useRef<THREE.Group>(null);

  useAutoShadows(root);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={root} />
    </group>
  );
}

useGLTF.preload("/models/netherlands/tulip.glb");
