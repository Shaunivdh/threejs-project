import { Suspense, useRef } from "react";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  BrightnessContrast,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import Platform from "./Platform";
import Tree from "./Tree";
import Fence from "./Fence";
import Grass from "./Grass";
import Bike from "./netherlands/Bike";
import Windmill from "./netherlands/Windmill";
import Cattail from "./netherlands/Cattail";
import Menu from "./uk/Menu";
import FireHydrant from "./uk/FireHydrant";
import Bench from "./uk/Bench";
import Postbox from "./uk/Postbox";
import Tulip from "./netherlands/Tulip";
import LoungeChair from "./codeop/LoungeChair";
import Pots from "./codeop/Pots";
import Laptop from "./brighton/Laptop";
import Coffee from "./codeop/Coffee";
import PalmTree from "./codeop/PalmTree";
import Books from "./codeop/Books";
import Corkboard from "./brighton/Corkboard";
import Desk from "./brighton/Desk";
import Seagull from "./brighton/Seagull";
import GrassPatches from "./GrassPatch";
import Airplane from "./waypoints/Airplane";
import Montsera from "./brighton/Montsera";
import FlightWaypoints from "./waypoints/FlightWaypoints";
import CloudBackground from "./experience/CloudBackground";
import Plant from "./Plant";
import Daisy from "./Daisy";
import Rose from "./Rose";
import RoseBush from "./RoseBush";
import Marigold from "./Marigold";
import SceneText from "./SceneText";

export type SceneProps = {
  follow?: boolean;
  onBeaconEnter?: (payload: { title: string; message: string }) => void;
  onBeaconExit?: () => void;
  inputMode?: "keyboard" | "touch";
};

export default function Scene({
  follow = true,
  onBeaconEnter,
  onBeaconExit,
  inputMode = "keyboard",
}: SceneProps) {
  const airplaneRef = useRef<THREE.Group>(null!);

  const inited = useRef(false);
  const baseCam = useRef(new THREE.Vector3());
  const baseLook = useRef(new THREE.Vector3());
  const desiredCam = useRef(new THREE.Vector3());
  const desiredLook = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3());

  const center = useRef(new THREE.Vector3(0, 0.8, 0));
  const parallax = useRef(new THREE.Vector3(0.22, 0.08, 0.18));
  const lookParallax = useRef(new THREE.Vector3(0.35, 0.12, 0.35));
  const stiffness = 0.06;

  useFrame(({ camera, size }, dt) => {
    if (!follow) return;

    const p = airplaneRef.current;
    if (!p) return;

    if (!inited.current) {
      baseCam.current.copy(camera.position);
      baseLook.current.copy(center.current);
      desiredCam.current.copy(baseCam.current);
      smoothedLook.current.copy(baseLook.current);
      inited.current = true;
    }

    const aspect = size.width / size.height;
    const frameBoost = THREE.MathUtils.clamp(1.35 / aspect, 1, 1.85);

    const dx = p.position.x - center.current.x;
    const dy = p.position.y - center.current.y;
    const dz = p.position.z - center.current.z;

    desiredCam.current.set(
      baseCam.current.x + dx * (parallax.current.x * frameBoost),
      baseCam.current.y + dy * (parallax.current.y * frameBoost),
      baseCam.current.z + dz * (parallax.current.z * frameBoost)
    );

    desiredLook.current.set(
      baseLook.current.x + dx * (lookParallax.current.x * frameBoost),
      baseLook.current.y + dy * (lookParallax.current.y * frameBoost),
      baseLook.current.z + dz * (lookParallax.current.z * frameBoost)
    );

    const currentDist = camera.position.distanceTo(smoothedLook.current);
    const dir = desiredCam.current.clone().sub(desiredLook.current).normalize();
    const zoomAwareCam = desiredLook.current
      .clone()
      .add(dir.multiplyScalar(currentDist));

    const k = 1 - Math.pow(1 - stiffness, dt * 60);
    camera.position.lerp(zoomAwareCam, k);

    smoothedLook.current.lerp(desiredLook.current, k);
    camera.lookAt(smoothedLook.current);
  });

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  return (
    <>
      <directionalLight
        castShadow
        position={[-10, 18, -10]}
        intensity={2.05}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={5}
        shadow-camera-far={35}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-radius={1}
      />

      <hemisphereLight intensity={0.62} groundColor="#7b6a60" color="#d6e6ff" />

      <ambientLight intensity={0.12} color="#ffffff" />

      <Environment preset="sunset" environmentIntensity={0.38} />
      <CloudBackground />
      <Suspense fallback={null}>
        <FlightWaypoints
          airplaneRef={airplaneRef}
          onBeaconEnter={onBeaconEnter}
          onBeaconExit={onBeaconExit}
        />

        <Platform />

        <Cattail position={[-3, 0.1, -0.9]} rotation={[0, 0.7, 0]} />
        <Tree position={[-4, 1.8, -2]} rotation={[0, Math.PI / 4, 0]} />
        <Tree position={[-3.5, 1.8, -2.5]} />
        <Tulip position={[-2.1, 0, -2.8]} />
        <Tulip position={[-1.9, 0, -2.4]} />
        <Tulip position={[-2.5, 0, -2.4]} />
        <Tulip position={[-2.8, 0, -0.4]} />
        <Grass position={[-4, -0.15, -0.2]} />
        <Grass position={[1, -0.15, 2.8]} />
        <Grass position={[3.2, -0.15, 1.2]} />
        <Bike position={[-1.5, -0.15, -3]} rotation={[-0.4, 0, 0]} />

        <Windmill position={[-2.6, -0.15, -1.5]} rotation={[0, 0.9, 0]} />

        <Menu position={[-0.9, 0.25, 2.9]} rotation={[0, 1.7, 0]} />
        <FireHydrant position={[-3.2, -0.15, 3.1]} rotation={[0, -1.5, 0]} />
        <Bench position={[-0.9, 0.1, 2.9]} rotation={[0, 0, 0]} />
        <Postbox position={[-3.1, 0.45, 1.2]} rotation={[0, 1.5, 0]} />

        <LoungeChair position={[2.6, 0.1, 2]} rotation={[0, 2.4, 0]} />
        <Pots position={[1.7, -0.15, 3.5]} rotation={[0, 1.5, 0]} />
        <Coffee position={[3.2, 0.43, 1.8]} rotation={[0, 0.5, 0]} />
        <PalmTree position={[3.9, 0, 1.2]} rotation={[0, 1.5, 0]} />
        <Books position={[3.2, 0.1, 1.8]} rotation={[0, 2, 0]} />

        <Laptop position={[2.72, 0.52, -2.9]} rotation={[0, 4.7, 0]} />
        <Corkboard position={[3.65, -0.15, -3.2]} rotation={[-0.4, 0, 0]} />
        <Desk position={[2.5, 0.25, -3]} />
        <Seagull position={[2.1, -0.15, -1.2]} rotation={[0, 0.5, 0]} />
        <Montsera position={[2, 0.52, -3]} rotation={[0, -1.5, 0]} />

        <Plant position={[-3.9, -0.15, 1.7]} rotation={[0, 1.2, 0]} />
        <Daisy position={[-2.7, -0.15, 0.5]} />
        <Daisy position={[1, -0.15, 1.8]} />
        <Daisy position={[1.7, -0.15, -1.7]} />
        <Rose position={[-2, 0.15, 1]} />
        <Rose position={[3.2, 0.15, 1]} />
        <Rose position={[-2, 0.15, 1]} />

        <RoseBush position={[-3.8, -0.31, 0.3]} />
        <RoseBush position={[1.2, -0.31, 3.2]} />
        <RoseBush position={[3.7, -0.31, -1.7]} />
        <Marigold position={[-0.8, -0.15, 2]} />
        <Marigold position={[0.1, -0.15, -0.3]} />

        <GrassPatches
          patches={[
            {
              key: "grass1",
              position: [1.6, -0.15, -0.4],
              rotation: [0, -Math.PI / 2.25, 0],
              count: 10,
              radius: 0.6,
              scaleRange: [0.85, 1.2],
              rotationJitter: Math.PI * 1.2,
            },
            {
              key: "grass2",
              position: [-1.1, -0.15, -2.5],
              rotation: [0, -Math.PI / 1.25, 0],
              count: 12,
              radius: 0.8,
              scaleRange: [0.8, 0.8],
              rotationJitter: Math.PI * 1.2,
            },
            {
              key: "grass3",
              position: [-2.3, -0.15, 2.2],
              rotation: [0, -Math.PI / 2.25, 0],
              count: 18,
              radius: 0.9,
              scaleRange: [0.8, 0.8],
              rotationJitter: Math.PI * 1.2,
            },
            {
              key: "grass4",
              position: [3.4, -0.15, 3],
              rotation: [0, -Math.PI / 2.25, 0],
              count: 18,
              radius: 0.5,
              scaleRange: [0.8, 0.8],
              rotationJitter: Math.PI * 1.2,
            },
            {
              key: "grass5",
              position: [3.4, -0.15, -0.7],
              rotation: [0, -Math.PI / 2.25, 0],
              count: 11,
              radius: 0.2,
              scaleRange: [0.8, 0.8],
              rotationJitter: Math.PI * 1.2,
            },
          ]}
        />

        <Airplane
          ref={airplaneRef}
          position={[-1.1, 0.75, -0.6]}
          rotation={[0, 0, 0]}
          inputMode={inputMode}
        />
        <group position={[-0.9, -0.17, 0.9]} rotation={[0, 0.9, 0]}>
          <SceneText
            text="FULL STACK DEVELOPER"
            scale={0.4}
            position={[0.82, 0, 0.29]}
            rotation={[0, 0, 0]}
          />

          <SceneText text="SHAUNI" position={[0, 0, 0]} rotation={[0, 0, 0]} />
        </group>

        <Fence position={[-3, -0.15, -3.4]} />
        <Fence position={[-1.8, -0.15, -3.4]} />
        <Fence position={[1.8, -0.15, -3.4]} />
        <Fence position={[3, -0.15, -3.4]} />

        <Fence position={[4.2, -0.15, -2.2]} rotation={[0, 4.7, 0]} />
        <Fence position={[4.2, -0.15, 0.16]} rotation={[0, 4.7, 0]} />
        <Fence position={[4.2, -0.15, 2.49]} rotation={[0, 4.7, 0]} />

        <Fence position={[-4.2, -0.15, 2.49]} rotation={[0, 4.7, 0]} />
        <Fence position={[-4.2, -0.15, -2.2]} rotation={[0, 4.7, 0]} />
        <Fence position={[-4.2, -0.15, 0.16]} rotation={[0, 4.7, 0]} />

        <Fence position={[3, -0.15, 3.7]} />
        <Fence position={[-2.85, -0.15, 3.7]} />
        <Fence position={[-0.5, -0.15, 3.7]} />
        <Fence position={[1.81, -0.15, 3.7]} />
      </Suspense>

      <EffectComposer multisampling={2}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <HueSaturation saturation={0.02} hue={0.0} />
        <BrightnessContrast brightness={-0.03} contrast={0.18} />
        <Bloom
          mipmapBlur
          intensity={isMobile ? 0.18 : 0.12}
          luminanceThreshold={isMobile ? 0.65 : 0.78}
          luminanceSmoothing={isMobile ? 0.4 : 0.25}
          levels={isMobile ? 6 : 8}
        />

        <Vignette eskil={false} offset={0.2} darkness={0.55} />
      </EffectComposer>
    </>
  );
}
