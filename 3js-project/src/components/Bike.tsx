import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Bike(props: JSX.IntrinsicElements["group"]) {

  const root = useNormalizedGLTF("/models/bike.glb", { targetHeight: 0.77, sitOnGround: true });
     useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/bike.glb");
