import { useNormalizedGLTF } from "../../hooks/useNormalizedGLTF";
import type { JSX } from "react";
import { useGLTF } from "@react-three/drei";
import { useAutoShadows } from "../../hooks/useAutoShadows";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type AirplaneProps = JSX.IntrinsicElements["group"];

const Airplane = forwardRef<THREE.Group, AirplaneProps>(function Airplane(
  props,
  ref
) {
  const root = useNormalizedGLTF("/models/paper_airplane.glb", {
    targetHeight: 0.05,
    sitOnGround: true,
  });
  useAutoShadows(root);
  useEffect(() => {
    root.traverse((obj: THREE.Object3D) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const materials = Array.isArray(obj.material)
        ? obj.material
        : [obj.material];

      for (const m of materials) {
        if (!(m instanceof THREE.MeshStandardMaterial)) continue;

        m.color.set("#9bb7d4");
        m.roughness = Math.min(m.roughness ?? 0.6, 0.65);
        m.metalness = 0;
        m.needsUpdate = true;
      }
    });
  }, [root]);

  const groupRef = useRef<THREE.Group>(null!);
  useImperativeHandle(ref, () => groupRef.current, []);

  const visualRef = useRef<THREE.Group>(null!);

  const timeRef = useRef(0);
  const introElapsedRef = useRef(0);

  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const keysPressed = useRef<Set<string>>(new Set());

  const MIN_X = -3.8;
  const MAX_X = 3.8;
  const MIN_Z = -3.0;
  const MAX_Z = 3.2;

  const restPosRef = useRef(new THREE.Vector3(0, 0.75, 0));
  const restRotRef = useRef(new THREE.Euler(0, 0, 0));
  const didInitRef = useRef(false);

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

    const delta = Math.min(dt, 1 / 30);
    timeRef.current += delta;
    introElapsedRef.current += delta;

    if (!didInitRef.current) {
      const px = Array.isArray(props.position)
        ? props.position[0] ?? 0
        : g.position.x;
      const py = Array.isArray(props.position)
        ? props.position[1] ?? 0.75
        : g.position.y;
      const pz = Array.isArray(props.position)
        ? props.position[2] ?? 0
        : g.position.z;

      restPosRef.current.set(px, py, pz);

      const rx = Array.isArray(props.rotation)
        ? props.rotation[0] ?? 0
        : g.rotation.x;
      const ry = Array.isArray(props.rotation)
        ? props.rotation[1] ?? 0
        : g.rotation.y;
      const rz = Array.isArray(props.rotation)
        ? props.rotation[2] ?? 0
        : g.rotation.z;

      restRotRef.current.set(rx, ry, rz);

      g.position.set(px - 0.25, py + 0.65, pz + 0.9);
      didInitRef.current = true;
    }

    if (introElapsedRef.current < 2) {
      const rest = restPosRef.current;
      const startX = rest.x - 0.25;
      const startY = rest.y + 0.65;
      const startZ = rest.z + 0.9;

      const t = introElapsedRef.current / 2;
      const e = t * t * (3 - 2 * t);

      g.position.x = THREE.MathUtils.lerp(startX, rest.x, e);
      g.position.y = THREE.MathUtils.lerp(startY, rest.y, e);
      g.position.z = THREE.MathUtils.lerp(startZ, rest.z, e);

      const wobble = 1 - e;
      g.position.x += Math.sin(timeRef.current * 7.0) * 0.06 * wobble;
      g.position.z += Math.sin(timeRef.current * 5.0) * 0.03 * wobble;

      v.rotation.y = Math.sin(timeRef.current * 3.2) * 0.35 * wobble;
      v.rotation.z = Math.sin(timeRef.current * 6.5) * 0.25 * wobble;
      v.rotation.x = -0.25 * wobble;

      const settleT = (t - 0.82) / 0.18;
      if (settleT > 0) {
        const s = THREE.MathUtils.clamp(settleT, 0, 1);
        const se = s * s * (3 - 2 * s);
        g.position.y += Math.sin(se * Math.PI) * 0.05 * (1 - se);
      }

      v.position.y = Math.sin(timeRef.current * 3.0) * 0.02 * wobble;
      velocity.current.set(0, 0, 0);

      const rr = restRotRef.current;
      g.rotation.set(rr.x, rr.y, rr.z);
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
    const steer = (right ? 1 : 0) - (left ? 1 : 0);

    if (kp.has("w") || kp.has("arrowup")) velocity.current.z -= SPEED * delta;
    if (kp.has("s") || kp.has("arrowdown")) velocity.current.z += SPEED * delta;
    if (kp.has("a") || kp.has("arrowleft")) velocity.current.x -= SPEED * delta;
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

    const baseY = restPosRef.current.y;
    g.position.y =
      baseY +
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
});

export default Airplane;

useGLTF.preload("/models/paper_airplane.glb");
