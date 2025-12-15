import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Airplane(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/paper_airplane.glb", {
    targetHeight: 0.1,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/paper_airplane.glb");
