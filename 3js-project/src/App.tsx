import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Platform from './Platform'
import './app.css' 

export default function App() {
  return (
    <div className="scene-wrap">
      <Canvas
        gl={{ antialias: true, alpha: true }} 
        style={{ background: 'transparent' }} 
        camera={{ position: [10, 10, 10], fov: 50 }}
        onCreated={(state) => {
          state.scene.background = null
          state.gl.setClearAlpha(0)
          state.gl.setClearColor(0x000000, 0)
        }}
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
