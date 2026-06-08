import * as THREE from 'three';

export class ContactVisual {
  public group: THREE.Group;
  private coreSphere!: THREE.Mesh;
  private particleSystem!: THREE.Points;
  private accretionRing!: THREE.Mesh;
  private particleCount = 200;
  private radiusArray: Float32Array;
  private speedArray: Float32Array;
  private angleArray: Float32Array;
  private heightArray: Float32Array;
  private isAbsorbing = false;

  constructor() {
    this.group = new THREE.Group();
    // Offset to section 4 area
    this.group.position.set(0, -36, 0);

    this.radiusArray = new Float32Array(this.particleCount);
    this.speedArray = new Float32Array(this.particleCount);
    this.angleArray = new Float32Array(this.particleCount);
    this.heightArray = new Float32Array(this.particleCount);

    this.createElements();
  }

  private createElements() {
    // 1. Central Singularity: Matte Black Sphere
    const sphereGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x05050c,
    });
    this.coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.coreSphere);

    // 2. Accretion ring wireframe (The event horizon ring)
    const ringGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0xff3366,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9
    });
    this.accretionRing = new THREE.Mesh(ringGeo, ringMat);
    this.accretionRing.rotation.x = Math.PI / 2;
    this.group.add(this.accretionRing);

    // 3. Accretion Swarm: Swirling particles around the singularity
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const c1 = new THREE.Color(0xffaa00); // orange-hot
    const c2 = new THREE.Color(0xbd34fe); // purple edge

    for (let i = 0; i < this.particleCount; i++) {
      // Initialize helical parameters
      const r = 1.6 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 0.4; // thin disk

      this.radiusArray[i] = r;
      this.angleArray[i] = angle;
      this.speedArray[i] = 1.0 + Math.random() * 2.0; // angular speed multiplier
      this.heightArray[i] = h;

      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = r * Math.sin(angle);

      // Gradient based on distance
      const ratio = (r - 1.6) / 2.8;
      const finalColor = c1.clone().lerp(c2, ratio);
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    this.particleSystem = new THREE.Points(pGeo, pMat);
    this.group.add(this.particleSystem);

    // Dynamic light inside
    const pullLight = new THREE.PointLight(0xff3366, 4, 10);
    this.group.add(pullLight);
  }

  public setAbsorbing(absorbing: boolean) {
    this.isAbsorbing = absorbing;
  }

  public update(time: number, mouse: THREE.Vector2) {
    const positionAttr = this.particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
    const positions = positionAttr.array as Float32Array;

    const baseSpeedMultiplier = this.isAbsorbing ? 6.0 : 1.0;

    for (let i = 0; i < this.particleCount; i++) {
      // Swirl angle
      const speed = (0.015 * this.speedArray[i]) * baseSpeedMultiplier;
      this.angleArray[i] += speed;

      // Pull radius in or restore
      if (this.isAbsorbing) {
        this.radiusArray[i] = THREE.MathUtils.lerp(this.radiusArray[i], 1.25, 0.03);
      } else {
        // Natural pulsation
        const targetRadius = this.radiusArray[i];
        this.radiusArray[i] = THREE.MathUtils.lerp(
          this.radiusArray[i],
          targetRadius + Math.sin(time + i) * 0.005,
          0.05
        );
      }

      const r = this.radiusArray[i];
      const angle = this.angleArray[i];

      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = this.heightArray[i] + Math.sin(time * 2 + r) * 0.05;
      positions[i * 3 + 2] = r * Math.sin(angle);
    }

    positionAttr.needsUpdate = true;

    // Wobble singularity
    const wobble = Math.sin(time * 3) * 0.05;
    this.coreSphere.scale.set(1 + wobble, 1 - wobble, 1 + wobble);

    // Accretion disk tilts in response to mouse
    this.group.rotation.x = -Math.PI / 6 + mouse.y * 0.25;
    this.group.rotation.y = time * 0.15 + mouse.x * 0.25;
  }
}
