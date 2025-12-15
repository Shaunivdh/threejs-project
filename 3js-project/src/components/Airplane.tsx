import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Airplane(props: JSX.IntrinsicElements["group"]) {
  const root = useNormalizedGLTF("/models/paper_airplane.glb", {
    targetHeight: 0.1,
    sitOnGround: true,
  });
  useAutoShadows(root);

  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const introStartTime = useRef(0);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    introStartTime.current = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta;
    const elapsed = (Date.now() - introStartTime.current) / 1000;

    //2 second wobble
    if (elapsed < 2) {
      groupRef.current.position.y = 0.75 + Math.sin(timeRef.current * 3) * 0.03;
      groupRef.current.rotation.z = Math.sin(timeRef.current * 2) * 0.05;
    } else {
      const speed = 1;
      const damping = 0.92;

      if (keysPressed.current.has("w") || keysPressed.current.has("arrowup")) {
        velocity.current.z += speed * delta;
      }
      if (
        keysPressed.current.has("s") ||
        keysPressed.current.has("arrowdown")
      ) {
        velocity.current.z -= speed * delta;
      }
      if (
        keysPressed.current.has("a") ||
        keysPressed.current.has("arrowleft")
      ) {
        velocity.current.x += speed * delta;
      }
      if (
        keysPressed.current.has("d") ||
        keysPressed.current.has("arrowright")
      ) {
        velocity.current.x -= speed * delta;
      }

      velocity.current.multiplyScalar(damping);
      groupRef.current.position.x += velocity.current.x;
      groupRef.current.position.z += velocity.current.z;

      // keep plane in bounds
      groupRef.current.position.x = Math.max(
        -3.8,
        Math.min(3.8, groupRef.current.position.x)
      );
      groupRef.current.position.z = Math.max(
        -3,
        Math.min(3.2, groupRef.current.position.z)
      );

      // point direction of travel
      if (velocity.current.length() > 0.01) {
        const targetRotation = Math.atan2(
          velocity.current.x,
          velocity.current.z
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotation,
          0.1
        );

        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          -velocity.current.x * 0.5,
          0.1
        );
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          0,
          0.05
        );
      }

      groupRef.current.position.y =
        0.75 + Math.sin(timeRef.current * 1.5) * 0.08;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={root} />
    </group>
  );
}

useGLTF.preload("/models/paper_airplane.glb");
