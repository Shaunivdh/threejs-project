import React, { useMemo, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Vector3Tuple } from "three";

export type WaypointBeaconProps = {
  airplaneRef: React.RefObject<THREE.Object3D | null>;

  title: string;
  message: string;

  targetPosition: Vector3Tuple;
  beaconOffset?: Vector3Tuple;

  triggerRadius?: number;

  onEnter?: () => void;
  onExit?: () => void;

  bounceHeight?: number;
  bounceSpeed?: number;
};

export default function WaypointBeacon({
  airplaneRef,
  title,
  message,
  targetPosition,
  beaconOffset = [0, 2, 0],
  triggerRadius = 1.2,
  onEnter,
  onExit,
  bounceHeight = 0.05,
  bounceSpeed = 3.0,
}: WaypointBeaconProps) {
  const targetPos = useMemo(
    () => new THREE.Vector3(...targetPosition),
    [targetPosition]
  );

  const beaconPos = useMemo(() => {
    const p = new THREE.Vector3(...targetPosition);
    p.add(new THREE.Vector3(...beaconOffset));
    return p;
  }, [targetPosition, beaconOffset]);

  const labelPos = useMemo<Vector3Tuple>(
    () => [beaconPos.x, beaconPos.y + 0.6, beaconPos.z],
    [beaconPos]
  );

  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const markerGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const plane = airplaneRef.current;
    if (plane) {
      const dist = tmp.copy(plane.position).distanceTo(targetPos);
      const inside = dist <= triggerRadius;

      if (inside !== isActiveRef.current) {
        isActiveRef.current = inside;
        setIsActive(inside);
        inside ? onEnter?.() : onExit?.();
      }
    }

    // bounce animation (independent of plane existence)
    const g = markerGroupRef.current;
    if (g) {
      const t = state.clock.getElapsedTime();
      const y = Math.sin(t * bounceSpeed) * bounceHeight;
      g.position.set(beaconPos.x, beaconPos.y + y, beaconPos.z);
    }
  });

  return (
    <group>
      <pointLight
        position={beaconPos.toArray()}
        intensity={3.2}
        distance={8}
        decay={2}
        color="#ffffff"
      />

      <group ref={markerGroupRef}>
        <mesh>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.6}
            roughness={0.6}
            metalness={0.0}
          />
        </mesh>
      </group>

      <group position={labelPos} visible={isActive}>
        <Text fontSize={0.18} color="white" anchorX="center" anchorY="bottom">
          {title}
        </Text>
        <Text
          position={[0, -0.22, 0]}
          fontSize={0.14}
          color="white"
          anchorX="center"
          anchorY="top"
        >
          {message}
        </Text>
      </group>
    </group>
  );
}
