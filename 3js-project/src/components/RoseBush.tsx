import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function RoseBush(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/rose_bush.glb", {
    targetHeight: 0.75,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/rose_bush.glb");
