import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import Platform from "./Platform";
import Tree from "./Tree";
import GrassPatch from "./GrassPatch";
import Fence from "./Fence";
import Grass from "./Grass";
import Bike from "./netherlands/Bike";
import Windmill from "./netherlands/Windmill";
import YellowBush from "./YellowBush";
import Trunk from "./Trunk";
import Path from "./Path";
import Cattail from "./netherlands/Cattail";
import Menu from "./uk/Menu";
import FireHydrant from "./uk/FireHydrant";
import Bench from "./uk/Bench";
import Postbox from "./uk/Postbox";
import Tulip from "./netherlands/Tulip";
import LoungeChair from "./barcelona/LoungeChair";
import Pots from "./barcelona/Pots";
import Laptop from "./barcelona/Laptop";
import Coffee from "./barcelona/Coffee";
import PalmTree from "./barcelona/PalmTree";
import Books from "./barcelona/Books";
import Corkboard from "./brighton/Corkboard";
import Desk from "./brighton/Desk";
import Seagull from "./brighton/Seagull";

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
        {/* Path */}
        <Path key="path1" position={[-0, -0.02, -3]} />
        <Path key="path2" position={[-0, -0.02, -2]} rotation={[0, 0, 0]} />
        {/* Netherlands */}
        <Cattail
          key="cattail1"
          position={[-3.5, 0.1, -2]}
          rotation={[0, 0.7, 0]}
        />
        <Tree
          key="tree1"
          position={[-4, 2, -2]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Tree key="tree2" position={[-3.5, 2, -2.5]} />
        <YellowBush
          key="yellowBush1"
          position={[-2.5, 0.6, -2.8]}
          rotation={[0, 0.4, 0]}
        />
        <Tulip key="tulip1" position={[-2.1, 0, -2.8]} />
        <Tulip key="tulip2" position={[-1.9, 0, -2.4]} />
        <Tulip key="tulip3" position={[-2.5, 0, -2.4]} />
        <Grass key="grass2" position={[-3.5, 0, -2.2]} />
        <Windmill
          key="windmill"
          position={[-3, 0.8, -0.2]}
          rotation={[0, 0.4, 0]}
        />
        {/* UK */}
        <Menu key="menu" position={[-0.3, 0.45, 2.6]} rotation={[0, 0, 0]} />
        <FireHydrant
          key="fireHydrant"
          position={[-2.1, 0, 2.5]}
          rotation={[0, -1.5, 0]}
        />
        <Bench
          key="bench"
          position={[-0.3, 0.3, 2.6]}
          rotation={[0, -1.5, 0]}
        />
        <Postbox key="postbox" position={[0.4, 0.45, 2.5]} />
        {/* CodeOp */}
        <LoungeChair
          key="loungeChair"
          position={[3, 0.25, 2]}
          rotation={[0, 7.8, 0]}
        />
        <Pots key="pots" position={[2.2, 0, 3.3]} rotation={[0, 1.5, 0]} />
        <Laptop
          key="laptop"
          position={[4.1, 0.38, 1.6]}
          rotation={[0, -1.33, 0]}
        />
        <Coffee
          key="coffee"
          position={[3.7, 0.55, 2.2]}
          rotation={[0, 0.5, 0]}
        />
        <PalmTree
          key="palmTree"
          position={[3.9, 0, 1.2]}
          rotation={[0, 1.5, 0]}
        />
        <Books key="books" position={[3.7, 0.2, 2.2]} rotation={[0, 2, 0]} />
        {/* Brighton */}
        <Corkboard
          key="corkboard"
          position={[-1.5, 0.7, 0]}
          rotation={[0, 1.5, 0]}
        />
        <Desk key="desk" position={[-1.5, 0, 0]} rotation={[0, 1.5, 0]} />
        <Seagull
          key="seagull"
          position={[-0.5, 2, -1]}
          rotation={[0, 0.5, 0]}
        />
        {/* Other */}
        <GrassPatch
          key="grass"
          position={[1, -0.2, -0.5]}
          rotation={[0, -Math.PI / 2.25, 0]}
        />
        <Bike key="bike" position={[-1.5, -0, -3]} rotation={[-0.4, 0, 0]} />
        <Trunk key="trunk" position={[-3.6, 0.2, 2.6]} />;{/* fence top */}
        <Fence key="fence1" position={[-3, 0, -3.4]} />
        <Fence key="fence2" position={[-1.8, 0, -3.4]} />
        <Fence key="fence3" position={[1.8, 0, -3.4]} />
        <Fence key="fence4" position={[3, 0, -3.4]} />
        {/* left */}
        <Fence key="fence5" position={[4.2, 0, -2.2]} rotation={[0, 4.7, 0]} />
        <Fence key="fence6" position={[4.2, 0, 0.16]} rotation={[0, 4.7, 0]} />
        <Fence key="fence7" position={[4.2, 0, 2.49]} rotation={[0, 4.7, 0]} />
        {/* right */}
        <Fence key="fence8" position={[-4.2, 0, 2.49]} rotation={[0, 4.7, 0]} />
        <Fence key="fence9" position={[-4.2, 0, -2.2]} rotation={[0, 4.7, 0]} />
        <Fence
          key="fence10"
          position={[-4.2, 0, 0.16]}
          rotation={[0, 4.7, 0]}
        />
        {/* fence bottom */}
        <Fence key="fence11" position={[3, 0, 3.7]} />
        <Fence key="fence12" position={[-2.85, 0, 3.7]} />
        <Fence key="fence13" position={[-0.5, 0, 3.7]} />
        <Fence key="fence14" position={[1.81, 0, 3.7]} />
      </Suspense>

      <OrbitControls enableDamping />
    </>
  );
}
