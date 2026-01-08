import type { JSX } from "react";
import * as THREE from "three";
import { useMemo } from "react";

export default function Platform(props: JSX.IntrinsicElements["group"]) {
  const fenceMinX = -4.2;
  const fenceMaxX = 4.2;
  const fenceMinZ = -3.4;
  const fenceMaxZ = 3.7;

  const margin = 0.7;

  const width = fenceMaxX - fenceMinX + margin * 2;
  const depth = fenceMaxZ - fenceMinZ + margin * 2;

  const centerX = (fenceMinX + fenceMaxX) * 0.5;
  const centerZ = (fenceMinZ + fenceMaxZ) * 0.5;

  const y = -0.3;
  const thickness = 0.25;
  const radius = 0.6;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const hw = width / 2;
    const hh = depth / 2;

    s.moveTo(-hw + radius, -hh);
    s.lineTo(hw - radius, -hh);
    s.quadraticCurveTo(hw, -hh, hw, -hh + radius);
    s.lineTo(hw, hh - radius);
    s.quadraticCurveTo(hw, hh, hw - radius, hh);
    s.lineTo(-hw + radius, hh);
    s.quadraticCurveTo(-hw, hh, -hw, hh - radius);
    s.lineTo(-hw, -hh + radius);
    s.quadraticCurveTo(-hw, -hh, -hw + radius, -hh);

    return s;
  }, [width, depth, radius]);

  return (
    <group {...props}>
      <mesh
        position={[centerX, y - thickness * 0.5, centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry
          args={[
            shape,
            {
              depth: thickness,
              bevelEnabled: false,
              curveSegments: 16,
              steps: 1,
            },
          ]}
        />

        <meshStandardMaterial color="#c7ea74" roughness={0.6} metalness={0} />
      </mesh>
    </group>
  );
}
