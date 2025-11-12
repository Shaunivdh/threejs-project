import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function YellowBush(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/yellow_bush.glb", {
    targetHeight: 1,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/yellow_bush.glb");
