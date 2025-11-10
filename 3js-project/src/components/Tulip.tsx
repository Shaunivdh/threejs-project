import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";

export default function Tulip(props: JSX.IntrinsicElements["group"]) {
  const gltf = useGLTF("/models/tulip.glb");

  return <primitive object={gltf.scene.clone()} {...props} />;
}

useGLTF.preload("/models/tulip.glb");
