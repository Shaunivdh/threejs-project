import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Cattail(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/netherlands/cattail.glb", {
    targetHeight: 1,
    sitOnGround: true,
  });

  useAutoShadows(root);

  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase.current;

    root.rotation.z = Math.sin(t * 0.6) * 0.05;
    root.rotation.x = Math.sin(t * 0.4) * 0.03;
  });

  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/netherlands/cattail.glb");
