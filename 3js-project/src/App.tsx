import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import Scene from "./components/Scene";
import "./app.css";

export default function App() {
  return (
    <div className="scene-wrap">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [6, 3.5, 7], fov: 38, near: 0.1, far: 80 }}
        onCreated={({ gl, scene }) => {
          scene.background = null;

          gl.setClearAlpha(0);
          gl.setClearColor(0x000000, 0);

          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;

          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.7;

          gl.outputColorSpace = SRGBColorSpace;
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
