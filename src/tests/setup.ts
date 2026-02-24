import { vi } from "vitest";

const mock2d: Partial<CanvasRenderingContext2D> = {
  createRadialGradient: () => ({ addColorStop: vi.fn() }),
  fillRect: vi.fn(),
  clearRect: vi.fn(),
};

vi.stubGlobal("HTMLCanvasElement", HTMLCanvasElement);
const getContextMock: HTMLCanvasElement["getContext"] = ((type: string) => {
  if (type === "2d") return mock2d as CanvasRenderingContext2D;
  return null;
}) as HTMLCanvasElement["getContext"];

HTMLCanvasElement.prototype.getContext = vi.fn(getContextMock) as HTMLCanvasElement["getContext"];
