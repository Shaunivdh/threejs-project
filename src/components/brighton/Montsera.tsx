import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Montsera(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/brighton/montsera.glb", {
    targetHeight: 0.7,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/brighton/montsera.glb");
