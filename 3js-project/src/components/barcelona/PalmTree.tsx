import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";
import * as THREE from "three";

export default function PalmTree(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);

  const root = useNormalizedGLTF("/models/barcelona/palm_tree.512.glb", {
    targetHeight: 1.8,
    sitOnGround: true,
  });

  useAutoShadows(root);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();
    group.current.rotation.z = Math.sin(t * 0.6) * 0.04;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.015;
  });

  return (
    <group ref={group} {...props}>
      <primitive object={root} />
    </group>
  );
}

useGLTF.preload("/models/barcelona/palm_tree.512.glb");
