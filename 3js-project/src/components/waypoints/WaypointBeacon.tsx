import React, { useEffect, useRef, useState } from "react";
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
  bounceSpeed = 3,
}: WaypointBeaconProps) {
  const [active, setActive] = useState(false);

  const target = useRef(new THREE.Vector3());
  const beacon = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());
  const groupRef = useRef<THREE.Group>(null);
  const insideRef = useRef(false);

  useEffect(() => {
    target.current.set(...targetPosition);
    beacon.current
      .set(...targetPosition)
      .add(new THREE.Vector3(...beaconOffset));
  }, [targetPosition, beaconOffset]);

  useFrame(({ clock }) => {
    const plane = airplaneRef.current;
    if (plane) {
      const inside =
        tmp.current.copy(plane.position).distanceTo(target.current) <=
        triggerRadius;

      if (inside !== insideRef.current) {
        insideRef.current = inside;
        setActive(inside);

        if (inside) {
          onEnter?.();
        } else {
          onExit?.();
        }
      }
    }

    const g = groupRef.current;
    if (g) {
      g.position.set(
        beacon.current.x,
        beacon.current.y +
          Math.sin(clock.getElapsedTime() * bounceSpeed) * bounceHeight,
        beacon.current.z
      );
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={1.6}
            roughness={0.6}
          />
        </mesh>
      </group>

      <group
        position={[beacon.current.x, beacon.current.y + 0.6, beacon.current.z]}
        visible={active}
      >
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
