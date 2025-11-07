import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";

export default function Platform(props: JSX.IntrinsicElements['group']) {
  const gltf = useGLTF("/models/platform.gltf");

  return <primitive object={gltf.scene} position={[0, 0, 0]} {...props} />;
}

useGLTF.preload("/models/platform.gltf");