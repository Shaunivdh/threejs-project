import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Box() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(() => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#77c36b" />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 60 }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color('#202020'), 1)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Box />
      </Canvas>
    </div>
  )
}
