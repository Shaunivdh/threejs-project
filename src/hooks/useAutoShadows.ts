import { useLayoutEffect, useRef } from "react";
import type { Object3D } from "three";

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

    root.traverse((obj: any) => {
      if (!obj.isMesh) return;
      if (filter && !filter(obj)) return;

      obj.castShadow = cast;
      obj.receiveShadow = receive;
    });

    applied.current = true; 
  }, [root, cast, receive, filter]);
}
