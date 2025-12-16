import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function LoungeChair(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/barcelona/lounge_chair.glb", {
    targetHeight: 0.6,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/barcelona/lounge_chair.glb");
