import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Pots(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/codeop/pots.glb", {
    targetHeight: 0.4,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/codeop/pots.glb");
