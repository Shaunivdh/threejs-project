import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";

export default function Tree(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/tree.glb", { targetHeight: 3, sitOnGround: true });
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/tree.glb");
