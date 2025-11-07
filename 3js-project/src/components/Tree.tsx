import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";

export default function Tree(props: JSX.IntrinsicElements['group']) {
  const gltf = useGLTF("/models/tree.glb"); 

  return <primitive object={gltf.scene} {...props} />;
}

useGLTF.preload("/models/tree.glb"); // Changed from .gltf to .glb