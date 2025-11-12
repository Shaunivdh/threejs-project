import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";

export default function Bench(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/uk/bench.glb", {
    targetHeight: 0.55,
    sitOnGround: true,
  });
  useAutoShadows(root);
  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/uk/bench.glb");
