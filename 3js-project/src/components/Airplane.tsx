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
      targetHeight: 0.05,
      sitOnGround: true,
    });
    useAutoShadows(root);

    const groupRef = useRef<THREE.Group>(null);
    useImperativeHandle(ref, () => groupRef.current as THREE.Group, []);

    const visualRef = useRef<THREE.Group>(null);

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

    useFrame((_, dt) => {
      const g = groupRef.current;
      const v = visualRef.current;
      if (!g || !v) return;

      const delta = Math.min(dt, 1 / 30);

      timeRef.current += delta;
      introElapsedRef.current += delta;

      if (introElapsedRef.current < 2) {
        g.position.y = 0.75;
        v.position.y = Math.sin(timeRef.current * 3) * 0.03;
        v.rotation.z = Math.sin(timeRef.current * 2) * 0.05;
        v.rotation.x = 0;
        v.rotation.y = 0;
        return;
      }

      const SPEED = 0.9;
      const MAX_VEL = 0.08;
      const TURN_LERP = 0.14;

      const BANK_MAX = 0.65;
      const BANK_LERP = 0.18;

      const DAMPING = 0.95;

      const PITCH_STRENGTH = 0.16;
      const PITCH_LERP = 0.1;

      const kp = keysPressed.current;

      const left = kp.has("a") || kp.has("arrowleft");
      const right = kp.has("d") || kp.has("arrowright");
      const steer = (right ? 1 : 0) - (left ? 1 : 0); // -1..1

      if (kp.has("w") || kp.has("arrowup")) velocity.current.z -= SPEED * delta;
      if (kp.has("s") || kp.has("arrowdown"))
        velocity.current.z += SPEED * delta;
      if (kp.has("a") || kp.has("arrowleft"))
        velocity.current.x -= SPEED * delta;
      if (kp.has("d") || kp.has("arrowright"))
        velocity.current.x += SPEED * delta;

      velocity.current.multiplyScalar(DAMPING);

      const len = velocity.current.length();
      if (len > MAX_VEL) velocity.current.multiplyScalar(MAX_VEL / len);

      g.position.x += velocity.current.x;
      g.position.z += velocity.current.z;

      g.position.x = THREE.MathUtils.clamp(g.position.x, MIN_X, MAX_X);
      g.position.z = THREE.MathUtils.clamp(g.position.z, MIN_Z, MAX_Z);

      const speedSq = velocity.current.lengthSq();

      if (speedSq > 0.000001) {
        const heading = Math.atan2(velocity.current.x, velocity.current.z);
        v.rotation.y = THREE.MathUtils.lerp(v.rotation.y, heading, TURN_LERP);

        v.rotation.z = THREE.MathUtils.lerp(
          v.rotation.z,
          steer * BANK_MAX,
          BANK_LERP
        );

        v.rotation.x = THREE.MathUtils.lerp(
          v.rotation.x,
          -velocity.current.z * PITCH_STRENGTH,
          PITCH_LERP
        );
      } else {
        v.rotation.z = THREE.MathUtils.lerp(v.rotation.z, 0, 0.1);
        v.rotation.x = THREE.MathUtils.lerp(v.rotation.x, 0, 0.1);
      }

      g.position.y =
        0.75 +
        Math.sin(timeRef.current * 1.5) * 0.08 +
        Math.min(speedSq * 30, 0.05);

      v.position.y =
        Math.sin(timeRef.current * 6.0) * 0.002 * Math.min(speedSq * 200, 1);
    });

    return (
      <group ref={groupRef} {...props}>
        <group ref={visualRef}>
          <primitive object={root} />
        </group>
      </group>
    );
  }
);

export default Airplane;

useGLTF.preload("/models/paper_airplane.glb");
