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

  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const plane = airplaneRef.current;
    if (!plane) return;

    const dist = tmp.copy(plane.position).distanceTo(targetPos);
    const inside = dist <= triggerRadius;

    if (inside !== isActiveRef.current) {
      isActiveRef.current = inside;
      setIsActive(inside);
      inside ? onEnter?.() : onExit?.();
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

      <mesh position={beaconPos.toArray()}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.95} />
      </mesh>

      <mesh position={[beaconPos.x, beaconPos.y - 0.7, beaconPos.z]}>
        <coneGeometry args={[0.22, 1.4, 18, 1, true]} />
        <meshBasicMaterial transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* GPU text instead of Html */}
      {isActive && (
        <group position={[beaconPos.x, beaconPos.y + 0.35, beaconPos.z]}>
          <Text fontSize={0.18} color="white" anchorX="center" anchorY="bottom">
            {title}
          </Text>
          <Text
            position={[0, -0.22, 0]}
            fontSize={0.14}
            color="white"
            opacity={0.9}
            anchorX="center"
            anchorY="top"
          >
            {message}
          </Text>
        </group>
      )}
    </group>
  );
}
