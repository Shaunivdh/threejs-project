import { vi } from "vitest";

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
