import { Suspense } from "react";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";

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
import LoungeChair from "./barcelona/LoungeChair";
import Pots from "./barcelona/Pots";
import Laptop from "./brighton/Laptop";
import Coffee from "./barcelona/Coffee";
import PalmTree from "./barcelona/PalmTree";
import Books from "./barcelona/Books";
import Corkboard from "./brighton/Corkboard";
import Desk from "./brighton/Desk";
import Seagull from "./brighton/Seagull";
import GrassPatches from "./GrassPatch";
import Airplane from "./Airplane";

export default function Scene() {
  return (
    <>
      <fog attach="fog" args={["#f3d5c9", 10, 32]} />
      <hemisphereLight intensity={0.5} groundColor="#f0c7a5" />
      <directionalLight
        castShadow
        position={[-8, 10, -6]}
        intensity={1.05}
        color="#ffd7b0"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.00025}
      />

      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Platform />

        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.45}
          scale={14}
          blur={2.8}
          far={8}
        />

        {/* Netherlands */}
        <Cattail position={[-3.5, 0.1, -2]} rotation={[0, 0.7, 0]} />
        <Tree position={[-4, 2, -2]} rotation={[0, Math.PI / 4, 0]} />
        <Tree position={[-3.5, 2, -2.5]} />
        <Tulip position={[-2.1, 0, -2.8]} />
        <Tulip position={[-1.9, 0, -2.4]} />
        <Tulip position={[-2.5, 0, -2.4]} />
        <Grass position={[-3.5, 0, -2.2]} />
        <Windmill position={[-3, 0.8, -0.2]} rotation={[0, 0.4, 0]} />

        {/* UK */}
        <Menu position={[-0.3, 0.45, 2.6]} />
        <FireHydrant position={[-2.1, 0, 2.5]} rotation={[0, -1.5, 0]} />
        <Bench position={[-0.3, 0.3, 2.6]} rotation={[0, -1.5, 0]} />
        <Postbox position={[0.4, 0.45, 2.5]} />

        {/* Barcelona */}
        <LoungeChair position={[3, 0.25, 2]} rotation={[0, 7.8, 0]} />
        <Pots position={[2.2, 0, 3.3]} rotation={[0, 1.5, 0]} />
        <Coffee position={[3.7, 0.55, 2.2]} rotation={[0, 0.5, 0]} />
        <PalmTree position={[3.9, 0, 1.2]} rotation={[0, 1.5, 0]} />
        <Books position={[3.7, 0.2, 2.2]} rotation={[0, 2, 0]} />

        {/* Brighton */}
        <Laptop position={[1.12, 0.69, -2.2]} rotation={[0, 1.5, 0]} />
        <Corkboard position={[2.5, 0.9, -3.4]} />
        <Desk position={[2.5, 0.45, -3]} />
        <Seagull position={[2, 0.75, -3]} rotation={[0, 0.5, 0]} />

        {/* Other */}
        <GrassPatches
          patches={[
            {
              key: "grass1",
              position: [1, 0, -0.5],
              rotation: [0, -Math.PI / 2.25, 0],
            },
            {
              key: "grass2",
              position: [1, 0, 0],
              rotation: [0, -Math.PI / 2.25, 0],
            },
          ]}
        />
        <Bike position={[-1.5, 0, -3]} rotation={[-0.4, 0, 0]} />
        <Airplane position={[-0.2, 0.75, -3]} rotation={[0, 0, 0]} />
        {/* Fence top */}
        <Fence position={[-3, 0, -3.4]} />
        <Fence position={[-1.8, 0, -3.4]} />
        <Fence position={[1.8, 0, -3.4]} />
        <Fence position={[3, 0, -3.4]} />
        {/* left */}
        <Fence position={[4.2, 0, -2.2]} rotation={[0, 4.7, 0]} />
        <Fence position={[4.2, 0, 0.16]} rotation={[0, 4.7, 0]} />
        <Fence position={[4.2, 0, 2.49]} rotation={[0, 4.7, 0]} />
        {/* right */}
        <Fence position={[-4.2, 0, 2.49]} rotation={[0, 4.7, 0]} />
        <Fence position={[-4.2, 0, -2.2]} rotation={[0, 4.7, 0]} />
        <Fence position={[-4.2, 0, 0.16]} rotation={[0, 4.7, 0]} />
        {/* fence bottom */}
        <Fence position={[3, 0, 3.7]} />
        <Fence position={[-2.85, 0, 3.7]} />
        <Fence position={[-0.5, 0, 3.7]} />
        <Fence position={[1.81, 0, 3.7]} />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={5.5}
        maxDistance={10}
        minPolarAngle={0.65}
        maxPolarAngle={1.25}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        target={[0, 0.8, 0]}
      />
    </>
  );
}
