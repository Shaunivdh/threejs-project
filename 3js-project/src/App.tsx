import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import Scene from "./components/Scene";
import "./app.css";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <Canvas
      className="r3f-canvas"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [5.2, 4.4, 4.0], fov: 38, near: 0.1, far: 80 }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.62;
        gl.outputColorSpace = SRGBColorSpace;
        gl.setClearColor(0xf8dfcc, 1);
      }}
    >
      <Scene />
      <OrbitControls
        enablePan={false}
        enableRotate={false}
        enableZoom
        minDistance={5.5}
        maxDistance={14}
      />
    </Canvas>
  );
}
