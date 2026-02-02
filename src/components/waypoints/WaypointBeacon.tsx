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
  pulseSpeed?: number;
  baseLightIntensity?: number;
  pulseLightIntensity?: number;
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
  pulseSpeed = 2.5,
  baseLightIntensity = 0.6,
  pulseLightIntensity = 1.2,
}: WaypointBeaconProps) {
  const [active, setActive] = useState(false);

  const target = useRef(new THREE.Vector3());
  const beacon = useRef(new THREE.Vector3());

  const planeWorld = useRef(new THREE.Vector3());
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const insideRef = useRef(false);

  useEffect(() => {
    target.current.set(...targetPosition);
    beacon.current
      .set(...targetPosition)
      .add(new THREE.Vector3(...beaconOffset));
  }, [targetPosition, beaconOffset]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

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
        beacon.current.y + Math.sin(t * bounceSpeed) * bounceHeight,
        beacon.current.z,
      );
    }
    const light = lightRef.current;
    if (light) {
      const pulse =
        baseLightIntensity +
        Math.sin(t * pulseSpeed) * pulseLightIntensity * 0.5;

      light.intensity = active ? pulse * 1.6 : pulse;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial
            color={active ? "orange" : "white"}
            emissive={active ? "orange" : "white"}
            emissiveIntensity={2}
            roughness={0.5}
          />
        </mesh>
        <pointLight
          ref={lightRef}
          color={active ? "orange" : "white"}
          intensity={baseLightIntensity}
          distance={active ? 6 : 4}
          decay={2}
        />
      </group>
    </group>
  );
}
