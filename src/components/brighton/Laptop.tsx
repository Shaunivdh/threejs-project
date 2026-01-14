import type { JSX } from "react";
import { Plane, useTexture, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../../hooks/useAutoShadows";
import reactLogo from "../../assets/react.png";

export default function Laptop(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/brighton/laptop.glb", {
    targetHeight: 0.33,
    sitOnGround: true,
  });

  useAutoShadows(root);

  const texture = useTexture(reactLogo);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group {...props}>
      <primitive object={root} />

      <Plane
        args={[0.28, 0.28]}
        position={[-0.21, 0.17, 0]}
        rotation={[0, 4.7, 0]}
      >
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </Plane>
    </group>
  );
}

useGLTF.preload("/models/brighton/laptop.glb");
