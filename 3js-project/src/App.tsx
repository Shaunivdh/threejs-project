import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./app.css";

export default function App() {
  return (
    <div className="scene-wrap">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        camera={{ position: [6, 4, 7], fov: 40 }}
        onCreated={(state) => {
          state.scene.background = null;
          state.gl.setClearAlpha(0);
          state.gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
