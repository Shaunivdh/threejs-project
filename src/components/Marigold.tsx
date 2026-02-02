import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Marigold(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/marigold.512.glb", {
    targetHeight: 0.5,
    sitOnGround: true,
  });

  useAutoShadows(root);

  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase.current;

    root.rotation.z = Math.sin(t * 0.8) * 0.09;
    root.rotation.x = Math.sin(t * 0.6) * 0.02;
  });

  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/marigold.512.glb");
