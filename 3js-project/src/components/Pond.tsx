import { useEffect } from "react";
import { DoubleSide } from "three";
import { useNormalizedGLTF } from "../hooks/useNormalizedGLTF";
import { useAutoShadows } from "../hooks/useAutoShadows";

export default function Pond(props) {
  const root = useNormalizedGLTF("/models/pond.glb", {
    targetHeight: 1,
    sitOnGround: true,
  });
  useAutoShadows(root);

  useEffect(() => {
    root.traverse((o: any) => {
      if (
        o.isMesh &&
        /water/i.test((o.name || "") + (o.material?.name || ""))
      ) {
        o.material.side = DoubleSide; // show from top & bottom
        o.material.transparent = true; // typical for water
        o.material.depthWrite = false; // helps with blending order
        o.renderOrder = 1; // draw after ground
      }
    });
  }, [root]);

  return <primitive object={root} {...props} />;
}
