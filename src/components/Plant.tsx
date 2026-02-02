import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Plant(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/plant.512.glb", {
    targetHeight: 0.75,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/plant.512.glb");
