import { Text3D } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type SceneTextProps = {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export default function SceneText({
  text,
  position = [0, 1, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: SceneTextProps) {
  const group = useRef<THREE.Group>(null!);

  useEffect(() => {
    group.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = false;
      }
    });
  }, []);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <Text3D
        font="fonts/englebert-medium.typeface.json"
        size={0.35}
        height={0.12}
        curveSegments={16}
        bevelEnabled
        bevelThickness={0.012}
        bevelSize={0.006}
        bevelSegments={4}
      >
        {text}

        <meshStandardMaterial
          color="#D97706"
          emissive="#A16207"
          emissiveIntensity={0.08}
          roughness={0.6}
          metalness={0.05}
        />
      </Text3D>
    </group>
  );
}
