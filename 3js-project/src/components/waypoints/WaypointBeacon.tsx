import React, { useEffect, useRef, useState } from "react";
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

  onEnter?: (payload: { title: string; message: string }) => void;
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

  const planeWorld = useRef(new THREE.Vector3());
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
      plane.getWorldPosition(planeWorld.current);

      const inside =
        planeWorld.current.distanceTo(target.current) <= triggerRadius;

      if (inside !== insideRef.current) {
        insideRef.current = inside;
        setActive(inside);
        if (inside) onEnter?.({ title, message });
        else onExit?.();
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
            color={active ? "orange" : "white"}
            emissive={active ? "orange" : "white"}
            emissiveIntensity={1.8}
            roughness={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}
