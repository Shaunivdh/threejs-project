import type { JSX } from "react";
import * as THREE from "three";
import { useMemo } from "react";

export default function Platform(props: JSX.IntrinsicElements["group"]) {
  const size = 150;
  const yOffset = -0.2;

  const alphaMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;

    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(128, 128, 60, 128, 128, 128);

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  return (
    <group {...props}>
      <mesh
        position={[1, yOffset, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#8fdc8a"
          roughness={0.9}
          metalness={0}
          transparent
          alphaMap={alphaMap}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
