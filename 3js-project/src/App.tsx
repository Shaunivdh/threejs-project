import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import Scene from "./components/Scene";
import "./app.css";

export default function App() {
  return (
    <Canvas
      className="r3f-canvas"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [6, 5, 7], fov: 38, near: 0.1, far: 80 }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;

        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.7;

        gl.outputColorSpace = SRGBColorSpace;

        gl.setClearColor(0xf8dfcc, 1);
      }}
    >
      <Scene />
    </Canvas>
  );
}
