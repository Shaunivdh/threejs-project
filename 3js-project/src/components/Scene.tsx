import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import Platform from "./Platform";
import Tree from "./Tree";
import GrassPatch from "./GrassPatch";
import Tulip from "./Tulip";
import Fence from "./Fence";
import Grass from "./Grass";
import Bike from "./Bike";
import Windmill from "./Windmill";
import YellowBush from "./YellowBush";

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        castShadow
        position={[-10, 10, -10]}
        intensity={0.4}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Platform />
        {/* Netherlands */}
        <Tree
          key="tree1"
          position={[-5, 2, -2]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Tree key="tree2" position={[-4, 2, -2.5]} />
        <YellowBush
          key="yellowBush1"
          position={[-3.5, 0.7, -2.8]}
          rotation={[0, 0.4, 0]}
        />
        <Tulip key="tulip1" position={[-3.1, 0, -2.8]} />
        <Tulip key="tulip2" position={[-2.9, 0, -2.4]} />

        <Grass key="grass2" position={[-2.0, 0, 3.2]} />
        <Grass key="grass3" position={[-2.1, 0, 3.2]} />
        <Grass key="grass4" position={[-1.5, 0, 3.2]} />
        <Grass key="grass5" position={[-3.5, 0, 3.2]} />

        <Windmill
          key="windmill"
          position={[-4.2, 0.75, 0.6]}
          rotation={[0, 0.4, 0]}
        />
        {/* UK */}
        {/* CodeOp */}
        {/* Worthing */}
        {/* Other */}
        <GrassPatch
          key="grass"
          position={[1, -0.2, -0.5]}
          rotation={[0, -Math.PI / 2.25, 0]}
        />
        <Fence key="fence1" position={[-4, 0, -3.2]} />
        <Fence key="fence2" position={[-0.8, 0, -3.2]} />
        <Fence key="fence2" position={[1.6, 0, -3.2]} />
        <Bike key="bike" position={[0, 0, -3]} rotation={[-0.4, 0, 0]} />
      </Suspense>

      <OrbitControls enableDamping />
    </>
  );
}
