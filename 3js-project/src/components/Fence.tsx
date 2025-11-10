import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Fence(props: JSX.IntrinsicElements["group"]) {

  const root = useNormalizedGLTF("/models/fence.glb", { targetHeight: 0.45, sitOnGround: true });
     useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/fence.glb");
