import type { JSX } from "react";
import * as THREE from "three";
import { useMemo } from "react";

export default function Platform(props: JSX.IntrinsicElements['group']) {
  const shape = useMemo(() => {
    const roundedRectShape = new THREE.Shape();
    const width = 12;
    const height = 8;
    const radius = 0.5;

    // Start at top-left corner (after the radius)
    roundedRectShape.moveTo(-width / 2 + radius, height / 2);
    
    // Top edge
    roundedRectShape.lineTo(width / 2 - radius, height / 2);
    // Top-right corner
    roundedRectShape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius);
    
    // Right edge
    roundedRectShape.lineTo(width / 2, -height / 2 + radius);
    // Bottom-right corner
    roundedRectShape.quadraticCurveTo(width / 2, -height / 2, width / 2 - radius, -height / 2);
    
    // Bottom edge
    roundedRectShape.lineTo(-width / 2 + radius, -height / 2);
    // Bottom-left corner
    roundedRectShape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + radius);
    
    // Left edge
    roundedRectShape.lineTo(-width / 2, height / 2 - radius);
    // Top-left corner
    roundedRectShape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + radius, height / 2);

    return roundedRectShape;
  }, []);

  return (
    <group {...props}>
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.2,
              bevelEnabled: false,
            },
          ]}
        />
<meshStandardMaterial
  color="#5da45c"          // a mid green
  roughness={0.7}
  metalness={0}
  envMapIntensity={0.25}
  toneMapped={false}       // <— prevents the washed-out look
/>



      </mesh>
    </group>
  );
}