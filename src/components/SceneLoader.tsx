import { Html, useProgress } from "@react-three/drei";

export default function SceneLoader() {
  const { progress } = useProgress();

  const icons = [
    { emoji: "🌱", showAt: 20 },
    { emoji: "🌻", showAt: 40 },
    { emoji: "🪴", showAt: 60 },
  ];

  return (
    <Html center>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontSize: "1.1rem",
            textAlign: "center",
          }}
        >
          Loading garden… {progress.toFixed(0)}%
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            lineHeight: 1,
          }}
        >
          {icons.map(({ emoji, showAt }) => {
            const visible = progress >= showAt;

            return (
              <span
                key={showAt}
                style={{
                  fontSize: "1.8rem",
                  transition: "opacity 350ms ease, transform 350ms ease",
                  willChange: "opacity, transform",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                }}
              >
                {emoji}
              </span>
            );
          })}
        </div>
      </div>
    </Html>
  );
}
