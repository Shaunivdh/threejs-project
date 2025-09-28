import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Platform from './Platform.tsx' 

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color('#202020'), 1)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        <Suspense fallback={null}>
          <Platform /> 
        </Suspense>

        <OrbitControls enableDamping />
      </Canvas>
    </div>
  )
}
