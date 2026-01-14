import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { normalizeObjectToHeight } from "../utils/normalizeObject3D";

type Options = { targetHeight?: number; sitOnGround?: boolean };

function withBaseUrl(path: string) {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;

  return `${import.meta.env.BASE_URL}${clean}`;
}

export function useNormalizedGLTF(path: string, opts: Options = {}) {
  const url = withBaseUrl(path);
  const { scene } = useGLTF(url);

  return useMemo(() => {
    const root = scene.clone(true);
    normalizeObjectToHeight(
      root,
      opts.targetHeight ?? 1,
      opts.sitOnGround ?? true
    );
    return root;
  }, [scene, opts.targetHeight, opts.sitOnGround]);
}
