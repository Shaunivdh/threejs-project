import type { JSX } from "react";
import * as THREE from "three";
import { useMemo } from "react";

export default function Platform(props: JSX.IntrinsicElements["group"]) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const width = 12, height = 8, radius = 0.5;
    s.moveTo(-width/2 + radius,  height/2);
    s.lineTo( width/2 - radius,  height/2);
    s.quadraticCurveTo(width/2,  height/2,  width/2,  height/2 - radius);
    s.lineTo( width/2, -height/2 + radius);
    s.quadraticCurveTo(width/2, -height/2,  width/2 - radius, -height/2);
    s.lineTo(-width/2 + radius, -height/2);
    s.quadraticCurveTo(-width/2, -height/2, -width/2, -height/2 + radius);
    s.lineTo(-width/2,  height/2 - radius);
    s.quadraticCurveTo(-width/2,  height/2, -width/2 + radius,  height/2);
    return s;
  }, []);

  const depth = 0.2;

  return (
    <group {...props}>

      <mesh position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <extrudeGeometry args={[shape, { depth, bevelEnabled: false }]} />
        <meshStandardMaterial
          color="#5da45c"
          roughness={0.7}
          metalness={0}
          envMapIntensity={0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
