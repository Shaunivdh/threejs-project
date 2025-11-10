import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import Platform from "./Platform";
import Tree from "./Tree";
import Grass from "./Grass";
import Tulip from "./Tulip";
import Fence from "./Fence";

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Platform />
        <Tree key="tree1" position={[-5, 2, -2]} rotation={[0, Math.PI / 4, 0]} />
        <Tree key="tree2" position={[-4, 2, -2.5]} />
        <Grass key="grass" position={[-4, -0.20, -1]} rotation={[0, -Math.PI / 2.25, 0]} />
        <Tulip key="tulip1" position={[-2.5, 0, -1.5]} rotation={[0, Math.PI / 4, 0]} />
        <Fence key="fence1" position={[-4, 0, -3.2]}  />
      </Suspense>

      <OrbitControls enableDamping />
    </>
  );
}
