import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../hooks/useAutoShadows";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Airplane = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(
  function Airplane(props, ref) {
    const root = useNormalizedGLTF("/models/paper_airplane.glb", {
      targetHeight: 0.1,
      sitOnGround: true,
    });
    useAutoShadows(root);

    const groupRef = useRef<THREE.Group>(null);
    useImperativeHandle(ref, () => groupRef.current as THREE.Group, []);

    const timeRef = useRef(0);
    const introElapsedRef = useRef(0);

    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const keysPressed = useRef<Set<string>>(new Set());

    const MIN_X = -3.8;
    const MAX_X = 3.8;
    const MIN_Z = -3.0;
    const MAX_Z = 3.2;

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        keysPressed.current.add(e.key.toLowerCase());
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed.current.delete(e.key.toLowerCase());
      };

      window.addEventListener("keydown", handleKeyDown, { passive: true });
      window.addEventListener("keyup", handleKeyUp, { passive: true });

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, []);

    useFrame((_, delta) => {
      const g = groupRef.current;
      if (!g) return;

      timeRef.current += delta;
      introElapsedRef.current += delta;

      if (introElapsedRef.current < 2) {
        g.position.y = 0.75 + Math.sin(timeRef.current * 3) * 0.03;
        g.rotation.z = Math.sin(timeRef.current * 2) * 0.05;
        return;
      }

      const speed = 1;
      const damping = 0.92;

      const kp = keysPressed.current;

      if (kp.has("w") || kp.has("arrowup")) velocity.current.z -= speed * delta;
      if (kp.has("s") || kp.has("arrowdown"))
        velocity.current.z += speed * delta;
      if (kp.has("a") || kp.has("arrowleft"))
        velocity.current.x -= speed * delta;
      if (kp.has("d") || kp.has("arrowright"))
        velocity.current.x += speed * delta;

      velocity.current.multiplyScalar(damping);

      g.position.x += velocity.current.x;
      g.position.z += velocity.current.z;

      g.position.x = THREE.MathUtils.clamp(g.position.x, MIN_X, MAX_X);
      g.position.z = THREE.MathUtils.clamp(g.position.z, MIN_Z, MAX_Z);

      if (velocity.current.lengthSq() > 0.0001) {
        const targetRotation = Math.atan2(
          velocity.current.x,
          velocity.current.z
        );

        g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotation, 0.1);
        g.rotation.z = THREE.MathUtils.lerp(
          g.rotation.z,
          -velocity.current.x * 0.5,
          0.1
        );
      } else {
        g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, 0.05);
      }

      g.position.y = 0.75 + Math.sin(timeRef.current * 1.5) * 0.08;
    });

    return (
      <group ref={groupRef} {...props}>
        <primitive object={root} />
      </group>
    );
  }
);

export default Airplane;

useGLTF.preload("/models/paper_airplane.glb");
