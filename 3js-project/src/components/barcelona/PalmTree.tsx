import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function PalmTree(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/barcelona/palm_tree.glb", {
    targetHeight: 1.8,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/barcelona/palm_tree.glb");
