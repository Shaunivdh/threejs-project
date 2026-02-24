import React, {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import { NoToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import Scene from "./components/Scene";
import { CloudOverlay } from "./components/CloudOverlay";
import "./App.css";
import linkedinIcon from "./assets/icons/linkedin.svg";
import githubIcon from "./assets/icons/github.svg";
import mailIcon from "./assets/icons/mail.svg";
import ContactForm from "./components/forms/ContactForm";
import SceneLoader from "./components/SceneLoader";
import MusicPlayer from "./components/MusicPlayer";
import trackUrl from "./assets/audio/misguided.mp3";

const TopMenu = memo(function TopMenu({
  onEmailClick,
}: {
  onEmailClick: () => void;
}): JSX.Element {
  return (
    <div className="hud" aria-label="Navigation">
      <div className="hud__actions" aria-label="Social links">
        <MusicPlayer src={trackUrl} />

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

        <button
          type="button"
          className="hud__icon hud__icon--button"
          aria-label="Email"
          title="Email"
          onClick={onEmailClick}
        >
          <img src={mailIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

interface PopupProps {
  title?: string;
  message: React.ReactNode;
  onClose: () => void;
  variant?: "toast" | "modal";
  className?: string;
  isLeaving?: boolean;
  onToastExited?: () => void;
}

const Popup = memo(function Popup({
  title,
  message,
  onClose,
  variant = "toast",
  className = "",
  isLeaving = false,
  onToastExited,
}: PopupProps): JSX.Element {
  if (variant === "modal") {
    return (
      <div className="popup-overlay" role="dialog" aria-modal="true">
        <div className={`popup popup--modal ${className}`.trim()}>
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
    <div
      className={`popup popup--toast ${isLeaving ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      onAnimationEnd={() => {
        if (isLeaving) onToastExited?.();
      }}
    >
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
});

type BeaconPopupState = { open: boolean; title: string; message: string };
const EMPTY_BEACON: BeaconPopupState = { open: false, title: "", message: "" };
type BeaconPayload = { title: string; message: string };

type RendererPrecision = "highp" | "mediump" | "lowp";

type RenderDiagnostics = {
  noPost: boolean;
  shadowMapSize?: number;
  precision?: RendererPrecision;
  composerMultisampling?: number;
  noMipmapBlur: boolean;
  logWebgl: boolean;
};

function parseDiagnosticsFromQuery(): RenderDiagnostics {
  const params = new URLSearchParams(window.location.search);

  const precisionRaw = params.get("precision");
  const precision =
    precisionRaw === "highp" ||
    precisionRaw === "mediump" ||
    precisionRaw === "lowp"
      ? precisionRaw
      : undefined;

  const shadowRaw = Number(params.get("shadow"));
  const shadowMapSize =
    Number.isFinite(shadowRaw) && shadowRaw >= 256 && shadowRaw <= 4096
      ? Math.round(shadowRaw)
      : undefined;

  const msaaRaw = Number(params.get("msaa"));
  const composerMultisampling =
    Number.isFinite(msaaRaw) && msaaRaw >= 0 && msaaRaw <= 8
      ? Math.round(msaaRaw)
      : undefined;

  return {
    noPost: params.get("noPost") === "1",
    shadowMapSize,
    precision,
    composerMultisampling,
    noMipmapBlur: params.get("noMipmapBlur") === "1",
    logWebgl: params.get("logWebgl") === "1",
  };
}

export default function App(): JSX.Element {
  const isDev = import.meta.env.DEV;
  const diagnostics = useMemo(() => parseDiagnosticsFromQuery(), []);
  const webglListenerCleanupRef = useRef<(() => void) | null>(null);

  const [contactOpen, setContactOpen] = useState(false);

  const [sceneReady, setSceneReady] = useState(false);
  const [showTipPopup, setShowTipPopup] = useState(false);

  const [tipLeaving, setTipLeaving] = useState(false);

  const [beaconPopup, setBeaconPopup] =
    useState<BeaconPopupState>(EMPTY_BEACON);
  const [beaconDismissed, setBeaconDismissed] = useState(false);
  const [useOrbit, setUseOrbit] = useState(false);

  useEffect(() => {
    if (!isDev) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyO") setUseOrbit((v) => !v);
      if (e.code === "Escape") setContactOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDev]);

  const follow = useMemo(() => (!isDev ? true : !useOrbit), [isDev, useOrbit]);

  const closeTip = useCallback(() => {
    setShowTipPopup(false);
    setTipLeaving(false);
  }, []);

  const requestTipClose = useCallback(() => {
    setTipLeaving(true);
  }, []);

  const handleBeaconEnter = useCallback(
    ({ title, message }: BeaconPayload) => {
      if (beaconDismissed) return;
      setBeaconPopup({ open: true, title, message });
    },
    [beaconDismissed],
  );

  const handleBeaconExit = useCallback(() => {
    setBeaconPopup((p) => ({ ...p, open: false }));
    setBeaconDismissed(false);
  }, []);

  const handleBeaconClose = useCallback(() => {
    setBeaconPopup((p) => ({ ...p, open: false }));
    setBeaconDismissed(true);
  }, []);

  const handleCanvasCreated = useCallback((state: RootState) => {
    const { gl, scene } = state;
    scene.background = null;

    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap;

    gl.toneMapping = NoToneMapping;
    gl.toneMappingExposure = 1.0;
    gl.outputColorSpace = SRGBColorSpace;

    gl.setClearColor(0xffffff, 0);

    const canvas = gl.domElement;
    const onContextLost = (event: Event) => {
      (event as WebGLContextEvent).preventDefault();
      console.error("[WebGL] context lost", {
        when: new Date().toISOString(),
        href: window.location.href,
        renderer: gl.capabilities.isWebGL2 ? "webgl2" : "webgl1",
      });
    };
    const onContextRestored = () => {
      console.warn("[WebGL] context restored", {
        when: new Date().toISOString(),
        href: window.location.href,
      });
    };

    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);
    webglListenerCleanupRef.current?.();
    webglListenerCleanupRef.current = () => {
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
      canvas.removeEventListener("webglcontextrestored", onContextRestored, false);
    };

    if (diagnostics.logWebgl) {
      console.info("[WebGL] diagnostics", {
        dpr: Math.min(window.devicePixelRatio, 2),
        precision: diagnostics.precision ?? "highp(default)",
        noPost: diagnostics.noPost,
        shadowMapSize: diagnostics.shadowMapSize ?? 4096,
        msaa: diagnostics.composerMultisampling ?? 2,
        noMipmapBlur: diagnostics.noMipmapBlur,
      });
    }
  }, [diagnostics]);

  useEffect(() => {
    return () => {
      webglListenerCleanupRef.current?.();
      webglListenerCleanupRef.current = null;
    };
  }, []);

  const isMobile = useMemo(() => /Mobi|Android/i.test(navigator.userAgent), []);

  const tipMessage = useMemo(
    () => (
      <div className="popup__intro">
        <p>Explore my interactive portfolio.</p>

        {isMobile ? (
          <ul>
            <li>
              📱 <strong>Touch</strong> &amp; <strong>drag</strong> to fly
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              🖱 <strong>Drag</strong> to rotate
            </li>
            <li>
              🔍 <strong>Scroll</strong> to zoom
            </li>
            <li>
              ⌨️ <strong>WASD</strong> or <strong>Arrow keys</strong> to move
            </li>
          </ul>
        )}

        <p>Look out for glowing beacons to discover more.</p>
      </div>
    ),
    [isMobile],
  );

  const handleAirplaneMoveStart = useCallback(() => {
    requestTipClose();
  }, [requestTipClose]);

  useEffect(() => {
    if (sceneReady) {
      setShowTipPopup(true);
      setTipLeaving(false);
    }
  }, [sceneReady]);

  return (
    <div className="app">
      <CloudOverlay />

      <Canvas
        dpr={Math.min(window.devicePixelRatio, 2)}
        className="r3f-canvas"
        shadows
        gl={{
          antialias: false,
          alpha: true,
          premultipliedAlpha: true,
          precision: diagnostics.precision,
        }}
        camera={{ position: [5.2, 4.4, 4.0], fov: 38, near: 0.1, far: 80 }}
        onCreated={(state) => {
          handleCanvasCreated(state);
          state.gl.setClearColor(0x000000, 0);
          state.gl.clearDepth();
        }}
      >
        <Suspense fallback={<SceneLoader />}>
          <Scene
            follow={follow}
            onBeaconEnter={handleBeaconEnter}
            onBeaconExit={handleBeaconExit}
            inputMode={isMobile ? "touch" : "keyboard"}
            onAirplaneMoveStart={handleAirplaneMoveStart}
            onReady={() => setSceneReady(true)}
            diagnostics={diagnostics}
          />{" "}
        </Suspense>
      </Canvas>

      {sceneReady && <TopMenu onEmailClick={() => setContactOpen(true)} />}
      {sceneReady && showTipPopup && (
        <Popup
          variant="toast"
          title="Welcome to my garden 🌱"
          message={tipMessage}
          onClose={requestTipClose}
          isLeaving={tipLeaving}
          onToastExited={closeTip}
        />
      )}

      {beaconPopup.open && (
        <Popup
          variant="modal"
          className="popup--beacon"
          title={beaconPopup.title}
          message={beaconPopup.message}
          onClose={handleBeaconClose}
        />
      )}

      {contactOpen && (
        <Popup
          variant="modal"
          title="Send me a message"
          message={<ContactForm onClose={() => setContactOpen(false)} />}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}
