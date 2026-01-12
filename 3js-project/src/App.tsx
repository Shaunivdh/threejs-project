import { useState, type JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { NoToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import "./App.css";
import linkedinIcon from "./assets/icons/linkedin.svg";
import githubIcon from "./assets/icons/github.svg";
import mailIcon from "./assets/icons/mail.svg";

const FOLLOW_IN_DEV = false;

function TopMenu(): JSX.Element {
  return (
    <div className="hud" aria-label="Social links">
      <div className="hud__actions" aria-label="Social links">
        <a
          href="https://www.linkedin.com/in/shaunivanderhorst/"
          className="hud__icon"
          aria-label="LinkedIn"
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={linkedinIcon} alt="" aria-hidden="true" />
        </a>

        <a
          href="https://github.com/Shaunivdh"
          className="hud__icon"
          aria-label="GitHub"
          title="GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubIcon} alt="" aria-hidden="true" />
        </a>

        <a
          href="mailto:youremail@example.com"
          className="hud__icon"
          aria-label="Email"
          title="Email"
        >
          <img src={mailIcon} alt="" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

interface PopupProps {
  title?: string;
  message: React.ReactNode;
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
          {title && (
            <div className="popup__title" style={{ color: "rgb(18, 18, 18)" }}>
              {title}
            </div>
          )}
          <div className="popup__message" style={{ color: "rgb(18, 18, 18)" }}>
            {message}
          </div>
          <button
            type="button"
            className="popup__close popup__close--modal"
            onClick={onClose}
            aria-label="Close"
            style={{ color: "rgb(18, 18, 18)" }}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup popup--toast" role="status" aria-live="polite">
      <div className="popup__message" style={{ color: "rgb(18, 18, 18)" }}>
        {title && (
          <div className="popup__title" style={{ color: "rgb(18, 18, 18)" }}>
            {title}
          </div>
        )}
        <div>{message}</div>
      </div>
      <button
        type="button"
        className="popup__close"
        onClick={onClose}
        aria-label="Close"
        style={{ color: "rgb(18, 18, 18)" }}
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
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
          depth: true,
        }}
        camera={{ position: [5.2, 4.4, 4.0], fov: 38, near: 0.1, far: 80 }}
        onCreated={({ gl, scene }) => {
          scene.background = null;

          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;

          gl.toneMapping = NoToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.outputColorSpace = SRGBColorSpace;

          gl.setClearColor(0xffffff, 0);
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
          title="Welcome to my garden 🌱"
          message={
            <div className="popup__intro">
              <p>Explore my interactive portfolio.</p>

              <ul>
                <li>
                  🖱 <strong>Drag</strong> to rotate
                </li>
                <li>
                  🔍 <strong>Scroll</strong> to zoom
                </li>
                <li>
                  ⌨️ <strong>WASD</strong> or <strong>Arrow keys</strong> to
                  move
                </li>
              </ul>

              <p>Look out for glowing beacons to discover more.</p>
            </div>
          }
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
