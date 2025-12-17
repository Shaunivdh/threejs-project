import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mock2d = {
  createRadialGradient: () => ({ addColorStop: vi.fn() }),
  fillRect: vi.fn(),
  clearRect: vi.fn(),
};

vi.stubGlobal("HTMLCanvasElement", HTMLCanvasElement);
HTMLCanvasElement.prototype.getContext = vi.fn((type: string) => {
  if (type === "2d") return mock2d as any;
  return null;
});

vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => {
  const useGLTF: any = () => ({ scene: null, nodes: {}, materials: {} });
  useGLTF.preload = vi.fn();

  return {
    Environment: () => null,
    ContactShadows: () => null,
    useGLTF,
  };
});

vi.mock("@react-three/postprocessing", () => ({
  EffectComposer: ({ children }: any) => <>{children}</>,
  Bloom: () => null,
  Vignette: () => null,
  HueSaturation: () => null,
  BrightnessContrast: () => null,
  SMAA: () => null,
  ToneMapping: () => null,
  Noise: () => null,
}));

vi.mock("../components/waypoints/FlightWaypoints", () => ({
  default: () => null,
}));

vi.mock("../components/Platform", () => ({
  default: () => <group data-testid="platform" />,
}));

vi.mock("../components/Airplane", () => ({
  default: React.forwardRef((props: any, ref: any) => (
    <group ref={ref} data-testid="airplane" {...props} />
  )),
}));

vi.mock("../components/Tree", () => ({ default: () => null }));
vi.mock("../components/Fence", () => ({ default: () => null }));
vi.mock("../components/Grass", () => ({ default: () => null }));
vi.mock("../components/netherlands/Bike", () => ({ default: () => null }));
vi.mock("../components/netherlands/Windmill", () => ({ default: () => null }));
vi.mock("../components/netherlands/Cattail", () => ({ default: () => null }));
vi.mock("../components/uk/Menu", () => ({ default: () => null }));
vi.mock("../components/uk/FireHydrant", () => ({ default: () => null }));
vi.mock("../components/uk/Bench", () => ({ default: () => null }));
vi.mock("../components/uk/Postbox", () => ({ default: () => null }));
vi.mock("../components/netherlands/Tulip", () => ({ default: () => null }));
vi.mock("../components/barcelona/LoungeChair", () => ({ default: () => null }));
vi.mock("../components/barcelona/Pots", () => ({ default: () => null }));
vi.mock("../components/brighton/Laptop", () => ({ default: () => null }));
vi.mock("../components/barcelona/Coffee", () => ({ default: () => null }));
vi.mock("../components/barcelona/PalmTree", () => ({ default: () => null }));
vi.mock("../components/barcelona/Books", () => ({ default: () => null }));
vi.mock("../components/brighton/Corkboard", () => ({ default: () => null }));
vi.mock("../components/brighton/Desk", () => ({ default: () => null }));
vi.mock("../components/brighton/Seagull", () => ({ default: () => null }));
vi.mock("../components/GrassPatch", () => ({ default: () => null }));
vi.mock("../components/brighton/Montsera", () => ({ default: () => null }));

import Scene from "../components/Scene";

describe("<Scene />", () => {
  it("loads the Platform", () => {
    render(<Scene />);
    expect(screen.getByTestId("platform")).toBeTruthy();
  });

  it("loads the Airplane", () => {
    render(<Scene />);
    expect(screen.getByTestId("airplane")).toBeTruthy();
  });
});
