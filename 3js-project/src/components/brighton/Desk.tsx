import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Desk(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/brighton/desk.glb", {
    targetHeight: 0.7,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/brighton/desk.glb");
