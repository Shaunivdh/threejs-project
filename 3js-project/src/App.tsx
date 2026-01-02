import { useState, type JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import "./App.css";

const FOLLOW_IN_DEV = false;

function TopMenu(): JSX.Element {
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

interface PopupProps {
  title?: string;
  message: string;
  onClose: () => void;
  variant?: "toast" | "modal";
}

function Popup({
  title,
  message,
  onClose,
  variant = "toast",
}: PopupProps): JSX.Element {
  if (variant === "modal") {
    return (
      <div className="popup-overlay">
        <div className="popup popup--modal">
          {title && <div className="popup__title">{title}</div>}
          <div className="popup__message">{message}</div>
          <button
            type="button"
            className="popup__close popup__close--modal"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup popup--toast" role="status" aria-live="polite">
      <div className="popup__message">
        {title && <div className="popup__title">{title}</div>}
        <div>{message}</div>
      </div>
      <button
        type="button"
        className="popup__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

type BeaconPopupState = {
  open: boolean;
  title: string;
  message: string;
};

export default function App(): JSX.Element {
  const [showTipPopup, setShowTipPopup] = useState(true);
  const [beaconPopup, setBeaconPopup] = useState<BeaconPopupState>({
    open: false,
    title: "",
    message: "",
  });
  const [beaconDismissed, setBeaconDismissed] = useState(false);

  return (
    <div className="app">
      <Canvas
        className="r3f-canvas"
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [5.2, 4.4, 4.0], fov: 38, near: 0.1, far: 80 }}
        onCreated={({ gl, scene }) => {
          scene.background = null;

          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;

          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.78;
          gl.outputColorSpace = SRGBColorSpace;

          gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene
          follow={import.meta.env.PROD || FOLLOW_IN_DEV}
          onBeaconEnter={({ title, message }) => {
            if (beaconDismissed) return;
            setBeaconPopup({ open: true, title, message });
          }}
          onBeaconExit={() => {
            setBeaconPopup((p) => ({ ...p, open: false }));
            setBeaconDismissed(false);
          }}
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={5.5}
          maxDistance={14}
        />
      </Canvas>

      <TopMenu />

      {showTipPopup && (
        <Popup
          variant="toast"
          message="Tip: drag to orbit, scroll to zoom."
          onClose={() => setShowTipPopup(false)}
        />
      )}

      {beaconPopup.open && (
        <Popup
          variant="modal"
          title={beaconPopup.title}
          message={beaconPopup.message}
          onClose={() => {
            setBeaconPopup((p) => ({ ...p, open: false }));
            setBeaconDismissed(true);
          }}
        />
      )}
    </div>
  );
}
