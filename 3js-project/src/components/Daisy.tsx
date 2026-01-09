import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Daisy(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/daisy.glb", {
    targetHeight: 0.5,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/daisy.glb");
