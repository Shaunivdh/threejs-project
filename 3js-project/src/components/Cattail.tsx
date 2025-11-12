import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Cattail(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/cattail.glb", {
    targetHeight: 1,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/cattail.glb");
