import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";

export default function Grass(props: JSX.IntrinsicElements["group"]) {

  const root = useNormalizedGLTF("/models/grass.glb", { targetHeight: 0.45, sitOnGround: true });
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/grass.glb");
