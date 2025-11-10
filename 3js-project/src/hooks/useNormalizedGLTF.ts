import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { normalizeObjectToHeight } from "../utils/normalizeObject3D";

type Options = { targetHeight?: number; sitOnGround?: boolean };

export function useNormalizedGLTF(url: string, opts: Options = {}) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const root = scene.clone(true);
    normalizeObjectToHeight(root, opts.targetHeight ?? 1, opts.sitOnGround ?? true);
    return root;
  }, [scene, opts.targetHeight, opts.sitOnGround]);
}
