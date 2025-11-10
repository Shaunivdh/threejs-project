import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Tree(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/tree.glb", { targetHeight: 2.75, sitOnGround: true });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/tree.glb");
