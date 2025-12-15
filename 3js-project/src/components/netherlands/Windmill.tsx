import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";
import * as THREE from "three";

export default function Windmill(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/netherlands/windmill.glb", {
    targetHeight: 1.9,
    sitOnGround: true,
  });

  useAutoShadows(root);

  const bladesRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    // Your GLB shows this exact name:
    const blades = root.getObjectByName("Windmill_Meshblades");

    if (!blades) {
      console.warn("Blades not found. Available objects:");
      root.traverse((o) => o.name && console.log(o.name));
      return;
    }

    bladesRef.current = blades;
  }, [root]);

  useFrame((_, delta) => {
    if (bladesRef.current) {
      // spin speed (radians per second)
      bladesRef.current.rotation.z += delta * 1;
    }
  });

  return <primitive object={root} {...props} />;
}

useGLTF.preload("/models/netherlands/windmill.glb");
