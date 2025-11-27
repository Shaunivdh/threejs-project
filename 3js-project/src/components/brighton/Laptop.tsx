import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Laptop(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/brighton/laptop.glb", {
    targetHeight: 0.33,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/brighton/laptop.glb");
