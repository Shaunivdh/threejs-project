import { Suspense } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import Platform from './Platform'
import Tree from './Tree'
import Grass from './Grass'

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Platform />
        <Tree key="tree1" position={[-3, 1.3, -2]} scale={1} rotation={[0, Math.PI / 2, 0]} />
        <Tree key="tree2" position={[-4, 1.3, -3.2]} /> 
        <Grass key="grass" position={[-4, -0.15, -1]} scale={0.01} rotation={[0, -Math.PI / 2.25, 0]} />
      </Suspense>

      <OrbitControls enableDamping />
    </>
  )
}