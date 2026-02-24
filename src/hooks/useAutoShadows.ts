import { useLayoutEffect, useRef } from "react";
import type { Mesh, Object3D } from "three";

type Options = {
  cast?: boolean;               
  receive?: boolean;            
  filter?: (o: Object3D) => boolean;
};

export function useAutoShadows(
  root: Object3D | null | undefined,
  options: Options = {}
) {
  const { cast = true, receive = true, filter } = options;
  const applied = useRef(false);

  useLayoutEffect(() => {
    if (!root || applied.current) return;

    root.traverse((obj: Object3D) => {
      if (!("isMesh" in obj) || !obj.isMesh) return;
      const mesh = obj as Mesh;
      if (filter && !filter(mesh)) return;

      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
    });

    applied.current = true; 
  }, [root, cast, receive, filter]);
}
