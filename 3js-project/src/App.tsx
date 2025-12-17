import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import "./App.css";

const FOLLOW_IN_DEV = true;

function TopMenu() {
  return (
    <header className="topbar">
      <div className="topbar__brand">Your Name</div>
      <nav className="topbar__nav">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="app">
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
        <Scene follow={import.meta.env.PROD || FOLLOW_IN_DEV} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate
          enableZoom
          minDistance={5.5}
          maxDistance={14}
        />
      </Canvas>
      <TopMenu />
    </div>
  );
}
