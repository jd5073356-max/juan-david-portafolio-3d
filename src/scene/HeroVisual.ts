import * as THREE from 'three';

export class HeroVisual {
  public group: THREE.Group;
  private coreMesh!: THREE.Mesh;
  private ringMesh!: THREE.Mesh;
  private outerWireframe!: THREE.Mesh;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.createElements();
  }

  private createElements() {
    // Central Core: Glowing Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      roughness: 0.1,
      metalness: 0.8,
      flatShading: true,
      wireframe: false,
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    // Inner wireframe sphere
    const wireGeo = new THREE.IcosahedronGeometry(1.61, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(wireMesh);

    // Outer orbiting ring (Torus)
    const ringGeo = new THREE.TorusGeometry(2.6, 0.08, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xbd34fe,
      roughness: 0.2,
      metalness: 0.9,
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.rotation.x = Math.PI / 3;
    this.group.add(this.ringMesh);

    // Outer abstract bounding wireframe Octahedron
    const outerGeo = new THREE.OctahedronGeometry(3.5, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    this.outerWireframe = new THREE.Mesh(outerGeo, outerMat);
    this.group.add(this.outerWireframe);

    // Add local point light for internal glow
    const pointLight = new THREE.PointLight(0x00ffcc, 5, 8);
    pointLight.position.set(0, 0, 0);
    this.group.add(pointLight);
  }

  public update(time: number, mouse: THREE.Vector2) {
    // Gentle rotation
    this.coreMesh.rotation.y = time * 0.2;
    this.coreMesh.rotation.x = time * 0.1;

    this.ringMesh.rotation.z = -time * 0.4;
    this.ringMesh.rotation.y = time * 0.15;

    this.outerWireframe.rotation.y = -time * 0.05;
    this.outerWireframe.rotation.x = -time * 0.03;

    // Pulse scale gently
    const scale = 1 + Math.sin(time * 1.5) * 0.04;
    this.coreMesh.scale.set(scale, scale, scale);

    // Interactive response to mouse
    this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, mouse.x * 0.5, 0.05);
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, -mouse.y * 0.5, 0.05);
  }
}
