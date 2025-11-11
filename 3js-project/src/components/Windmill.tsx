import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Windmill(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/windmill.glb", {
    targetHeight: 1.6,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/windmill.glb");
