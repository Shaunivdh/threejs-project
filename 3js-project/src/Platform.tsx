import * as THREE from "three";
import { OrthographicCamera, useGLTF } from "@react-three/drei";
import type { JSX } from "react";


type GLTFResult = {
  nodes: {
    Platform: THREE.Mesh;
  };
  materials: Record<string, THREE.Material>;
};

export default function Platform(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF("/models/platform.gltf") as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group name="Container" position={[-1, 59, 2]} scale={[8, 0.2, 6]}>
          <mesh
            name="Platform"
            geometry={nodes.Platform.geometry}
            position={[-0.125, -10, 0.333]}
          >
     
            <meshStandardMaterial color="#7cb342" />
          </mesh>
        </group>

        <OrthographicCamera
          makeDefault={false}
          far={100000}
          near={0.1}
          position={[-636.655, 247.809, -451.012]}
          rotation={[-2.252, -0.589, -2.541]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/platform.gltf");
