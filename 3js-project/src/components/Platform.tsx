import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import { useEffect } from "react";
import * as THREE from "three";

export default function Platform(props: JSX.IntrinsicElements['group']) {
  const gltf = useGLTF("/models/platform.gltf");

  // Apply color to all meshes in the scene
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#6b8e6b",
          flatShading: true,
        });
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} position={[0, 0, 0]} {...props} />;
}

useGLTF.preload("/models/platform.gltf");