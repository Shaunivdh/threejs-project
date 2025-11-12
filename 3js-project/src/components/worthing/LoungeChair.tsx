import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function LoungeChair(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/lounge_chair.glb", {
    targetHeight: 1,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/lounge_chair.glb");
