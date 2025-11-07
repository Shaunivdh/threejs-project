import { Suspense } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import Platform from './Platform'
import Tree from './Tree'

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Platform />
        <Tree position={[0, 1.3, 0]} scale={1} />
      </Suspense>

      <OrbitControls enableDamping />
    </>
  )
}