import * as THREE from 'three';
import { type Project, projectsData } from '../data/portfolioData';

export class ProjectsVisual {
  public group: THREE.Group;
  private cards: THREE.Group[] = [];
  private hoveredIndex: number | null = null;
  private particleSwarm!: THREE.Points;
  private nodeSpheres: THREE.Mesh[] = [];
  private nodeLines!: THREE.LineSegments;
  private dbCubes: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    // Offset this group to section 2 area
    this.group.position.set(0, -12, 0);
    this.createElements();
  }

  private createElements() {
    const cardWidth = 3.5;
    const cardHeight = 4.5;
    const cardDepth = 0.1;
    const spacing = 5.2;

    projectsData.forEach((project, idx) => {
      const projectGroup = new THREE.Group();
      // Place horizontally
      const xOffset = (idx - 1) * spacing;
      projectGroup.position.set(xOffset, 0, 0);
      
      // Store reference metadata on the group for Raycasting
      projectGroup.userData = { id: project.id, index: idx };

      // 1. Semi-transparent Glass Card Backing
      const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
      const cardMat = new THREE.MeshStandardMaterial({
        color: 0x111625,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.75,
        bumpScale: 0.05,
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardMesh.name = 'card_back';
      projectGroup.add(cardMesh);

      // 2. Colored Glowing Wireframe Border
      const borderGeo = new THREE.BoxGeometry(cardWidth + 0.05, cardHeight + 0.05, cardDepth + 0.01);
      const borderMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(project.color),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.name = 'card_border';
      projectGroup.add(borderMesh);

      // 3. Unique Procedural 3D Visual inside/above each card
      this.addProceduralVisual(projectGroup, project, cardHeight);

      this.group.add(projectGroup);
      this.cards.push(projectGroup);
    });
  }

  private addProceduralVisual(parent: THREE.Group, project: Project, cardHeight: number) {
    const visualY = cardHeight / 2 + 1.2;

    if (project.id === 'quantum') {
      // Quantum Particle Swarm
      const pCount = 80;
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const colors = new Float32Array(pCount * 3);
      const baseColor = new THREE.Color(project.color);

      for (let i = 0; i < pCount; i++) {
        // Spherical distribution
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.5 + Math.random() * 0.7;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        colors[i * 3] = baseColor.r;
        colors[i * 3 + 1] = baseColor.g;
        colors[i * 3 + 2] = baseColor.b;
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });

      this.particleSwarm = new THREE.Points(pGeo, pMat);
      this.particleSwarm.position.set(0, visualY, 0.2);
      parent.add(this.particleSwarm);

    } else if (project.id === 'aetheria') {
      // Aetheria Node Web
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(0, visualY, 0.2);

      const nodeCount = 5;
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.5,
      });

      const positions: THREE.Vector3[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const x = (Math.random() - 0.5) * 1.5;
        const y = (Math.random() - 0.5) * 1.5;
        const z = (Math.random() - 0.5) * 0.8;
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x, y, z);
        nodeGroup.add(node);
        this.nodeSpheres.push(node);
        positions.push(new THREE.Vector3(x, y, z));
      }

      // Connect nodes with lines
      const lineIndices: number[] = [];
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (positions[i].distanceTo(positions[j]) < 1.3) {
            lineIndices.push(i, j);
          }
        }
      }

      const lineGeo = new THREE.BufferGeometry().setFromPoints(positions);
      const lineIndicesAttr = new Uint16Array(lineIndices);
      lineGeo.setIndex(new THREE.BufferAttribute(lineIndicesAttr, 1));

      const lineMat = new THREE.LineBasicMaterial({
        color: project.color,
        transparent: true,
        opacity: 0.4
      });

      this.nodeLines = new THREE.LineSegments(lineGeo, lineMat);
      nodeGroup.add(this.nodeLines);
      parent.add(nodeGroup);

    } else if (project.id === 'chronos') {
      // Chronos DB: a tiny grid of columns
      const gridGroup = new THREE.Group();
      gridGroup.position.set(0, visualY, 0.2);

      const boxGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
      const boxMat = new THREE.MeshStandardMaterial({
        color: project.color,
        roughness: 0.1,
        metalness: 0.9,
      });

      const cols = 3;
      const rows = 3;
      const spacing = 0.45;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = (c - (cols - 1) / 2) * spacing;
          const z = (r - (rows - 1) / 2) * spacing;
          const box = new THREE.Mesh(boxGeo, boxMat);
          box.position.set(x, 0, z);
          gridGroup.add(box);
          this.dbCubes.push(box);
        }
      }

      parent.add(gridGroup);
    }
  }

  public setHovered(index: number | null) {
    this.hoveredIndex = index;
  }

  public update(time: number, scrollY: number) {
    // 1. Hover Animations (Animate cards towards the viewer when hovered)
    this.cards.forEach((card, idx) => {
      const isHovered = this.hoveredIndex === idx;
      
      // Target position
      const targetZ = isHovered ? 0.8 : 0;
      const targetScale = isHovered ? 1.05 : 1.0;
      
      card.position.z = THREE.MathUtils.lerp(card.position.z, targetZ, 0.1);
      card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, targetScale, 0.1));

      // Floating drift effect
      const driftOffset = Math.sin(time * 1.2 + idx * 2.0) * 0.08;
      card.position.y = driftOffset;

      // Card border opacity adjustment
      const border = card.getObjectByName('card_border') as THREE.Mesh;
      if (border && border.material) {
        const mat = border.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHovered ? 0.8 : 0.3, 0.1);
      }

      // Card backing glow
      const backing = card.getObjectByName('card_back') as THREE.Mesh;
      if (backing && backing.material) {
        const mat = backing.material as THREE.MeshStandardMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHovered ? 0.9 : 0.75, 0.1);
      }
    });

    // 2. Animate Quantum particles
    if (this.particleSwarm) {
      this.particleSwarm.rotation.y = time * 0.3;
      this.particleSwarm.rotation.z = time * 0.1;
      
      // Animate scale gently
      const scale = 1.0 + Math.sin(time * 2) * 0.05;
      this.particleSwarm.scale.set(scale, scale, scale);
    }

    // 3. Animate Node Web spheres
    if (this.nodeSpheres.length > 0) {
      this.nodeSpheres.forEach((node, i) => {
        node.position.y += Math.sin(time * 2 + i) * 0.003;
        node.position.x += Math.cos(time * 1.5 + i) * 0.002;
      });
      if (this.nodeLines) {
        this.nodeLines.rotation.y = time * 0.1;
      }
    }

    // 4. Animate Database Columns
    if (this.dbCubes.length > 0) {
      this.dbCubes.forEach((cube, i) => {
        const speed = 1.5 + i * 0.1;
        const heightMultiplier = Math.sin(time * speed) * 0.4 + 0.6;
        cube.scale.y = THREE.MathUtils.lerp(cube.scale.y, heightMultiplier, 0.1);
        cube.position.y = (cube.scale.y * 0.6) / 2 - 0.3; // align to base
      });
    }

    // Responsive position adjust on scroll (gently rotate entire section group)
    this.group.rotation.y = Math.sin(time * 0.2) * 0.05 + (scrollY * 0.01);
  }
}
