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

const BEACON_LINKS: Record<string, string> = {
  codeop: "https://codeop.tech",
  bluecrest: "https://bluecrest.com",
};

function renderBeaconMessage(message: string): React.ReactNode {
  const paragraphs = message.split("\n\n");

  return paragraphs.map((paragraph, paragraphIndex) => {
    const lines = paragraph.split("\n");

    return (
      <p key={`paragraph-${paragraphIndex}`}>
        {lines.map((line, lineIndex) => {
          const segments = line.split(/(CodeOp|Bluecrest)/g);
          return (
            <React.Fragment key={`line-${paragraphIndex}-${lineIndex}`}>
              {segments.map((segment, segmentIndex) => {
                const href = BEACON_LINKS[segment.toLowerCase()];
                if (!href) return segment;

                return (
                  <a
                    key={`segment-${paragraphIndex}-${lineIndex}-${segmentIndex}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="popup__message-link"
                  >
                    {segment}
                  </a>
                );
              })}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </p>
    );
  });
}

export default function App(): JSX.Element {
  const isDev = import.meta.env.DEV;
  const isMobile = useMemo(() => /Mobi|Android/i.test(navigator.userAgent), []);
  const usesTouchControls = useMemo(() => {
    const ua = navigator.userAgent;
    const hasTouchPoints = navigator.maxTouchPoints > 0;
    const hasCoarsePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(any-pointer: coarse)").matches;
    const hasTouchEvent = "ontouchstart" in window;
    const isTabletUA =
      /iPad|Tablet|PlayBook|Silk|Kindle|Android(?!.*Mobile)/i.test(ua);

    return hasTouchPoints || hasCoarsePointer || hasTouchEvent || isTabletUA;
  }, []);
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
      canvas.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
        false,
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      webglListenerCleanupRef.current?.();
      webglListenerCleanupRef.current = null;
    };
  }, []);

  const tipMessage = useMemo(
    () => (
      <div className="popup__intro">
        {usesTouchControls ? (
          <div className="popup__intro-primary">
            📱 <strong>Touch</strong> &amp; <strong>drag</strong> to fly
          </div>
        ) : (
          <div className="popup__intro-primary">
            ⌨️ <strong>Use WASD</strong> or <strong>Arrow keys</strong> to fly
          </div>
        )}

        <p>Look out for glowing beacons to discover more.</p>
      </div>
    ),
    [usesTouchControls],
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
            inputMode={usesTouchControls ? "touch" : "keyboard"}
            onAirplaneMoveStart={handleAirplaneMoveStart}
            onReady={() => setSceneReady(true)}
            disablePostprocessing={isMobile}
          />{" "}
        </Suspense>
      </Canvas>

      {sceneReady && <TopMenu onEmailClick={() => setContactOpen(true)} />}
      {sceneReady && showTipPopup && (
        <Popup
          variant="toast"
          title="Take flight. Explore at your own pace 🌱"
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
          message={renderBeaconMessage(beaconPopup.message)}
          onClose={handleBeaconClose}
        />
      )}

      {contactOpen && (
        <Popup
          variant="modal"
          className="popup--contact"
          title="Send me a message 💬"
          message={<ContactForm onClose={() => setContactOpen(false)} />}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}
