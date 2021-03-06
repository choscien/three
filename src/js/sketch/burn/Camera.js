import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.cameraResolution = new THREE.Vector2();
  }
  start() {
    this.aspect = 3 / 2;
    this.far = 100000;
    this.setFocalLength(50);
    this.position.set(0, 0, 50);
    this.lookAt(new THREE.Vector3());
  }
  update(time) {
    // 업데이트
    
  }
  resize(resolution) {
    this.aspect = resolution.x / resolution.y;
    this.updateProjectionMatrix();
  }
}
