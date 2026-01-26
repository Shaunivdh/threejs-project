import { Html, useProgress } from "@react-three/drei";

export default function SceneLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="popup popup--modal">
        Loading garden… {progress.toFixed(0)}%
      </div>
    </Html>
  );
}
