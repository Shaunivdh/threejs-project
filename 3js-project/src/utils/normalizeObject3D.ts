import * as THREE from "three";

export function normalizeObjectToHeight(
  obj: THREE.Object3D,
  targetHeight = 1,
  sitOnGround = true
) {
  obj.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);

  if (size.y > 0) {
    const factor = targetHeight / size.y;
    obj.scale.multiplyScalar(factor);
    obj.updateWorldMatrix(true, true);
  }

  if (sitOnGround) {
    const after = new THREE.Box3().setFromObject(obj);
    const minY = after.min.y;
    if (isFinite(minY)) obj.position.y -= minY; 
    

  }

  obj.updateWorldMatrix(true, true);
}
