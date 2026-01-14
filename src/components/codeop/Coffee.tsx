import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Coffee(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/codeop/coffee.glb", {
    targetHeight: 0.2,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/codeop/coffee.glb");
