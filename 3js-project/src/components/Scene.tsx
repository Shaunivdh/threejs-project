import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import Platform from "./Platform";
import Tree from "./Tree";
import GrassPatch from "./GrassPatch";
import Tulip from "./Tulip";
import Fence from "./Fence";
import Grass from "./Grass";

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
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
        <Tree key="tree1" position={[-5, 2, -2]} rotation={[0, Math.PI / 4, 0]} />
        <Tree key="tree2" position={[-4, 2, -2.5]} />
        <GrassPatch key="grass" position={[-4, -0.20, -1]} rotation={[0, -Math.PI / 2.25, 0]} />
        <Tulip key="tulip1" position={[-2.5, 0, -1.5]} rotation={[0, Math.PI / 4, 0]} />
        <Fence key="fence1" position={[-4, 0, -3.2]}  />
        <Grass key="grass2" position={[4, 0, 3.2]}  />
      </Suspense>

      <OrbitControls enableDamping />
    </>
  );
}
