import * as THREE from 'three';
import { HeroVisual } from './HeroVisual';
import { ProjectsVisual } from './ProjectsVisual';
import { SkillsVisual } from './SkillsVisual';
import { ContactVisual } from './ContactVisual';

export class SceneManager {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private clock!: THREE.Clock;

  // Sub-visual components
  private heroVisual!: HeroVisual;
  private projectsVisual!: ProjectsVisual;
  private skillsVisual!: SkillsVisual;
  private contactVisual!: ContactVisual;

  // Starfield background
  private starfield!: THREE.Points;

  // Lights
  private dirLight1!: THREE.DirectionalLight;
  private dirLight2!: THREE.DirectionalLight;

  // Interaction State
  private mouse = new THREE.Vector2(0, 0);
  private raycaster = new THREE.Raycaster();
  private scrollY = 0;
  private targetScrollY = 0;

  // Particle Cursor Trail Pool
  private trailPool: THREE.Mesh[] = [];
  private activeTrail: { mesh: THREE.Mesh; velocity: THREE.Vector3; age: number; maxAge: number }[] = [];
  private lastMousePos = new THREE.Vector2();

  // Callbacks to UI
  public onProjectHover: (index: number | null) => void = () => {};
  public onSkillHover: (name: string | null) => void = () => {};

  constructor(container: HTMLDivElement) {
    this.container = container;
    
    // Create canvas dynamically
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'scene-canvas';
    this.container.appendChild(this.canvas);

    this.init();
    this.createBackground();
    this.createSections();
    this.createTrailPool();
    this.addEventListeners();
    this.animate();
  }

  private init() {
    this.scene = new THREE.Scene();
    
    // Background fog to fade elements out in the distance elegantly
    this.scene.fog = new THREE.FogExp2(0x0a0a14, 0.025);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Initial position
    this.camera.position.set(0, 0, 7.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();

    // Setup beautiful studio lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    this.scene.add(ambientLight);

    this.dirLight1 = new THREE.DirectionalLight(0x00ffcc, 1.5);
    this.dirLight1.position.set(5, 5, 4);
    this.scene.add(this.dirLight1);

    this.dirLight2 = new THREE.DirectionalLight(0xff3366, 1.2);
    this.dirLight2.position.set(-5, -5, 2);
    this.scene.add(this.dirLight2);
  }

  private createBackground() {
    // Elegant drifting starfield
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const c1 = new THREE.Color(0x00ffcc);
    const c2 = new THREE.Color(0xbd34fe);
    const c3 = new THREE.Color(0xffffff);

    for (let i = 0; i < starCount; i++) {
      // Scatter in a massive box around camera
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90 - 15; // stretch down through sections
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;

      // Color variation
      const rand = Math.random();
      let color = c3;
      if (rand < 0.2) color = c1;
      else if (rand < 0.45) color = c2;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  private createSections() {
    // 1. Hero
    this.heroVisual = new HeroVisual();
    this.scene.add(this.heroVisual.group);

    // 2. Projects
    this.projectsVisual = new ProjectsVisual();
    this.scene.add(this.projectsVisual.group);

    // 3. Skills
    this.skillsVisual = new SkillsVisual();
    this.scene.add(this.skillsVisual.group);

    // 4. Contact
    this.contactVisual = new ContactVisual();
    this.scene.add(this.contactVisual.group);
  }

  private createTrailPool() {
    // Initialize particle pool for mouse cursor trailing
    const trailGeo = new THREE.IcosahedronGeometry(0.08, 0);
    for (let i = 0; i < 45; i++) {
      const trailMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.8
      });
      const m = new THREE.Mesh(trailGeo, trailMat);
      m.visible = false;
      this.scene.add(m);
      this.trailPool.push(m);
    }
  }

  private addEventListeners() {
    window.addEventListener('mousemove', (e) => {
      // Calculate normalized device coordinates
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => this.onResize());

    // Track scroll
    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    });
  }

  private onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public triggerContactAbsorb(absorbing: boolean) {
    if (this.contactVisual) {
      this.contactVisual.setAbsorbing(absorbing);
    }
  }

  public changeTheme(theme: 'quantum' | 'helios' | 'abyss') {
    let color1 = 0x00ffcc;
    let color2 = 0xff3366;
    let fogColor = 0x0a0a14;

    if (theme === 'helios') {
      color1 = 0xffaa00;
      color2 = 0xff3300;
      fogColor = 0x140a05;
    } else if (theme === 'abyss') {
      color1 = 0x05ff8a;
      color2 = 0x0088ff;
      fogColor = 0x050e14;
    }

    // Smoothly apply light colors and fog color
    this.dirLight1.color.setHex(color1);
    this.dirLight2.color.setHex(color2);
    
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color.setHex(fogColor);
    }
    
    this.renderer.setClearColor(fogColor, 0);
  }

  private spawnTrailParticle() {
    // Check if mouse moved enough to spawn a particle
    const dist = this.mouse.distanceTo(this.lastMousePos);
    if (dist < 0.02) return;
    this.lastMousePos.copy(this.mouse);

    // Get a free mesh from the pool
    const mesh = this.trailPool.find(m => !m.visible);
    if (!mesh) return;

    // Get mouse 3D position by unprojecting
    const tempV = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    tempV.unproject(this.camera);
    // Direction from camera to mouse 3D position
    const dir = tempV.sub(this.camera.position).normalize();
    // Position at depth Z=4 relative to camera
    const distance = 4.2; 
    const spawnPos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    mesh.position.copy(spawnPos);
    mesh.scale.set(1, 1, 1);
    mesh.visible = true;

    // Subtle drift speed
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4
    );

    // Matches the active primary light color (matches current theme)
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.color.copy(this.dirLight1.color);

    this.activeTrail.push({
      mesh,
      velocity,
      age: 0,
      maxAge: 30 + Math.random() * 20
    });
  }

  private handleInteractions() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Raycast over projects
    const projectIntersects = this.raycaster.intersectObjects(this.projectsVisual.group.children, true);
    let activeProjIndex: number | null = null;
    
    if (projectIntersects.length > 0) {
      // Find the project container group
      let parent: THREE.Object3D | null = projectIntersects[0].object;
      while (parent && parent !== this.scene && parent.userData.index === undefined) {
        parent = parent.parent;
      }
      if (parent && parent.userData.index !== undefined) {
        activeProjIndex = parent.userData.index;
      }
    }
    
    this.projectsVisual.setHovered(activeProjIndex);
    this.onProjectHover(activeProjIndex);

    // 2. Raycast over skills
    const skillsIntersects = this.raycaster.intersectObjects(this.skillsVisual.group.children, true);
    let activeSkillName: string | null = null;
    let activeSkillIndex: number | null = null;

    if (skillsIntersects.length > 0) {
      let parent: THREE.Object3D | null = skillsIntersects[0].object;
      while (parent && parent !== this.scene && parent.userData.index === undefined) {
        parent = parent.parent;
      }
      if (parent && parent.userData.index !== undefined) {
        activeSkillName = parent.userData.name;
        activeSkillIndex = parent.userData.index;
      }
    }

    this.skillsVisual.setHovered(activeSkillIndex);
    this.onSkillHover(activeSkillName);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Smooth scroll interpolation (lerp)
    this.scrollY = THREE.MathUtils.lerp(this.scrollY, this.targetScrollY, 0.07);

    // Determine target camera Y and Z based on scrollY
    // 4 sections total, each 100vh. Compute scroll progress in VH units
    const progress = this.scrollY / window.innerHeight;

    let targetCamY = 0;
    let targetCamZ = 7.5;

    if (progress < 1.0) {
      // Interpolate from Hero (0, 0, 7.5) to Projects (0, -12, 8.5)
      const t = progress;
      targetCamY = THREE.MathUtils.lerp(0, -12, t);
      targetCamZ = THREE.MathUtils.lerp(7.5, 8.5, t);
    } else if (progress < 2.0) {
      // Interpolate from Projects (0, -12, 8.5) to Skills (0, -24, 7.5)
      const t = progress - 1.0;
      targetCamY = THREE.MathUtils.lerp(-12, -24, t);
      targetCamZ = THREE.MathUtils.lerp(8.5, 7.5, t);
    } else {
      // Interpolate from Skills (0, -24, 7.5) to Contact (0, -36, 7.2)
      const t = Math.min(progress - 2.0, 1.0);
      targetCamY = THREE.MathUtils.lerp(-24, -36, t);
      targetCamZ = THREE.MathUtils.lerp(7.5, 7.2, t);
    }

    // Camera inertia + subtle mouse parallax tracking
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * 0.7, 0.05);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY - this.mouse.y * 0.5, 0.05);
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, 0.05);

    // Spawn and update trail particles
    this.spawnTrailParticle();
    for (let i = this.activeTrail.length - 1; i >= 0; i--) {
      const p = this.activeTrail[i];
      p.age++;
      p.mesh.position.addScaledVector(p.velocity, 0.015);
      
      const lifeRatio = p.age / p.maxAge;
      const rem = 1.0 - lifeRatio;
      
      p.mesh.scale.set(rem, rem, rem);
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = rem * 0.8;

      if (p.age >= p.maxAge) {
        p.mesh.visible = false;
        this.activeTrail.splice(i, 1);
      }
    }

    // Sub-visual updates
    this.heroVisual.update(time, this.mouse);
    this.projectsVisual.update(time, this.scrollY);
    this.skillsVisual.update(time, this.mouse);
    this.contactVisual.update(time, this.mouse);

    // Starfield drift
    if (this.starfield) {
      this.starfield.rotation.y = time * 0.015;
      this.starfield.rotation.x = Math.sin(time * 0.005) * 0.02;
    }

    this.handleInteractions();

    this.renderer.render(this.scene, this.camera);
  }
}
