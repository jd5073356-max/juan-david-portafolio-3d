import * as THREE from 'three';
import { type Project, projectsData } from '../data/portfolioData';

interface ProjectVisual {
  id: string;
  group: THREE.Group; // procedural visual floating above the card
}

export class ProjectsVisual {
  public group: THREE.Group;
  private cards: THREE.Group[] = [];
  private visuals: ProjectVisual[] = [];
  private hoveredIndex: number | null = null;

  // Arc layout configuration (curved carousel) — scales to any number of cards
  private readonly arcRadius = 9;
  private readonly anglePerCard = 0.32; // radians between adjacent cards (~18°)

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
    const count = projectsData.length;

    projectsData.forEach((project, idx) => {
      const projectGroup = new THREE.Group();

      // Distribute cards along a frontal arc so any amount of them stays framed
      const theta = (idx - (count - 1) / 2) * this.anglePerCard;
      const x = Math.sin(theta) * this.arcRadius;
      const z = Math.cos(theta) * this.arcRadius - this.arcRadius;
      const baseRotY = -theta; // each card turns to face the center / camera

      projectGroup.position.set(x, 0, z);
      projectGroup.rotation.y = baseRotY;

      // Store reference metadata on the group for Raycasting + animation
      projectGroup.userData = { id: project.id, index: idx, baseRotY };

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

      // 3. Unique Procedural 3D Visual floating above each card
      this.addProceduralVisual(projectGroup, project, cardHeight);

      this.group.add(projectGroup);
      this.cards.push(projectGroup);
    });
  }

  private addProceduralVisual(parent: THREE.Group, project: Project, cardHeight: number) {
    const visualY = cardHeight / 2 + 1.2;
    const visual = new THREE.Group();
    visual.position.set(0, visualY, 0.2);
    const color = new THREE.Color(project.color);

    switch (project.id) {
      case 'quantum':
        this.buildQuantum(visual, color);
        break;
      case 'aetheria':
        this.buildNodeWeb(visual, color);
        break;
      case 'chronos':
        this.buildDbColumns(visual, color);
        break;
      case 'athena':
        this.buildAthena(visual, color);
        break;
      case 'aula':
        this.buildMosaic(visual, color);
        break;
      case 'nexguard':
        this.buildShield(visual, color);
        break;
      case 'neural':
        this.buildNeuralNet(visual, color);
        break;
    }

    parent.add(visual);
    this.visuals.push({ id: project.id, group: visual });
  }

  // --- MAX: quantum particle swarm ---
  private buildQuantum(visual: THREE.Group, color: THREE.Color) {
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.5 + Math.random() * 0.7;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const swarm = new THREE.Points(pGeo, pMat);
    swarm.name = 'swarm';
    visual.add(swarm);
  }

  // --- AutoFlow: node web ---
  private buildNodeWeb(visual: THREE.Group, color: THREE.Color) {
    const nodes = new THREE.Group();
    nodes.name = 'nodes';

    const nodeCount = 5;
    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
    });

    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 1.5;
      const z = (Math.random() - 0.5) * 0.8;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, y, z);
      nodes.add(node);
      positions.push(new THREE.Vector3(x, y, z));
    }

    const lineIndices: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (positions[i].distanceTo(positions[j]) < 1.3) {
          lineIndices.push(i, j);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(positions);
    lineGeo.setIndex(new THREE.BufferAttribute(new Uint16Array(lineIndices), 1));
    const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.name = 'nodelines';
    nodes.add(lines);

    visual.add(nodes);
  }

  // --- Casa de Software: database columns ---
  private buildDbColumns(visual: THREE.Group, color: THREE.Color) {
    const grid = new THREE.Group();
    grid.name = 'grid';

    const boxGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const boxMat = new THREE.MeshStandardMaterial({ color, roughness: 0.1, metalness: 0.9 });

    const cols = 3;
    const rows = 3;
    const spacing = 0.45;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = (c - (cols - 1) / 2) * spacing;
        const z = (r - (rows - 1) / 2) * spacing;
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(x, 0, z);
        grid.add(box);
      }
    }
    visual.add(grid);
  }

  // --- Athena: knowledge gem (icosahedron core + orbiting ring) ---
  private buildAthena(visual: THREE.Group, color: THREE.Color) {
    const coreSolid = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.4, 0),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.8 })
    );
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.6, 0),
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.4 })
    );
    const core = new THREE.Group();
    core.name = 'core';
    core.add(coreSolid, coreWire);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.025, 8, 48),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
    );
    ring.rotation.x = Math.PI / 2.5;
    ring.name = 'ring';

    visual.add(core, ring);
  }

  // --- Aula Inclusiva: mosaic of diverse blocks ---
  private buildMosaic(visual: THREE.Group, color: THREE.Color) {
    const mosaic = new THREE.Group();
    mosaic.name = 'mosaic';

    // A small accessible palette conveying diversity / inclusion
    const palette = [color.getHex(), 0xffd166, 0xef476f, 0x118ab2, 0xffffff, 0x06d6a0];
    const pieceCount = 6;
    const radius = 0.7;
    const pieceGeo = new THREE.BoxGeometry(0.26, 0.26, 0.26);

    for (let i = 0; i < pieceCount; i++) {
      const a = (i / pieceCount) * Math.PI * 2;
      const pieceColor = palette[i % palette.length];
      const piece = new THREE.Mesh(
        pieceGeo,
        new THREE.MeshStandardMaterial({
          color: pieceColor,
          emissive: pieceColor,
          emissiveIntensity: 0.3,
          roughness: 0.3,
          metalness: 0.4,
        })
      );
      piece.position.set(Math.cos(a) * radius, Math.sin(a) * radius * 0.6, 0);
      piece.rotation.set(a, a * 0.5, 0);
      mosaic.add(piece);
    }
    visual.add(mosaic);
  }

  // --- NexGuard: security shield + scanning ring ---
  private buildShield(visual: THREE.Group, color: THREE.Color) {
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.45, 0),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.7 })
    );
    core.name = 'ncore';

    const shield = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 })
    );

    const scan = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.02, 8, 48),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75 })
    );
    scan.rotation.x = Math.PI / 2;
    scan.name = 'scan';

    visual.add(core, shield, scan);
  }

  // --- Neural-Sync: layered neural network ---
  private buildNeuralNet(visual: THREE.Group, color: THREE.Color) {
    const net = new THREE.Group();
    net.name = 'net';

    const nodeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 });

    const layers = [3, 2]; // input -> output
    const layerX = [-0.5, 0.5];
    const nodePos: THREE.Vector3[][] = [];

    layers.forEach((n, li) => {
      const layerNodes: THREE.Vector3[] = [];
      for (let i = 0; i < n; i++) {
        const y = (i - (n - 1) / 2) * 0.55;
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(layerX[li], y, 0);
        net.add(node);
        layerNodes.push(node.position.clone());
      }
      nodePos.push(layerNodes);
    });

    // Fully connect adjacent layers
    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodePos[0].length; i++) {
      for (let j = 0; j < nodePos[1].length; j++) {
        linePoints.push(nodePos[0][i], nodePos[1][j]);
      }
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
    net.add(new THREE.LineSegments(lineGeo, lineMat));

    visual.add(net);
  }

  public setHovered(index: number | null) {
    this.hoveredIndex = index;
  }

  public update(time: number, scrollY: number) {
    // 1. Card hover + drift animations
    this.cards.forEach((card, idx) => {
      const isHovered = this.hoveredIndex === idx;
      const baseRotY = (card.userData.baseRotY as number) ?? 0;

      // Pull hovered card toward the camera (group +Z) and scale it up
      const targetZOffset = isHovered ? 1.0 : 0;
      const baseZ = Math.cos((idx - (this.cards.length - 1) / 2) * this.anglePerCard) * this.arcRadius - this.arcRadius;
      card.position.z = THREE.MathUtils.lerp(card.position.z, baseZ + targetZOffset, 0.1);

      const targetScale = isHovered ? 1.08 : 1.0;
      card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, targetScale, 0.1));

      // Straighten hovered card to read it head-on, otherwise keep its arc angle
      const targetRotY = isHovered ? 0 : baseRotY;
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, targetRotY, 0.1);

      // Gentle floating drift
      card.position.y = Math.sin(time * 1.2 + idx * 2.0) * 0.06;

      const border = card.getObjectByName('card_border') as THREE.Mesh | undefined;
      if (border && border.material) {
        const mat = border.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHovered ? 0.85 : 0.3, 0.1);
      }
      const backing = card.getObjectByName('card_back') as THREE.Mesh | undefined;
      if (backing && backing.material) {
        const mat = backing.material as THREE.MeshStandardMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, isHovered ? 0.9 : 0.75, 0.1);
      }
    });

    // 2. Per-project procedural visual animations
    this.visuals.forEach((v) => {
      switch (v.id) {
        case 'quantum': {
          const swarm = v.group.getObjectByName('swarm');
          if (swarm) {
            swarm.rotation.y = time * 0.3;
            swarm.rotation.z = time * 0.1;
            const s = 1.0 + Math.sin(time * 2) * 0.05;
            swarm.scale.set(s, s, s);
          }
          break;
        }
        case 'aetheria': {
          const nodes = v.group.getObjectByName('nodes');
          if (nodes) {
            nodes.children.forEach((node, i) => {
              if (node instanceof THREE.Mesh) {
                node.position.y += Math.sin(time * 2 + i) * 0.003;
                node.position.x += Math.cos(time * 1.5 + i) * 0.002;
              }
            });
            const lines = nodes.getObjectByName('nodelines');
            if (lines) lines.rotation.y = time * 0.1;
          }
          break;
        }
        case 'chronos': {
          const grid = v.group.getObjectByName('grid');
          if (grid) {
            grid.children.forEach((cube, i) => {
              const speed = 1.5 + i * 0.1;
              const h = Math.sin(time * speed) * 0.4 + 0.6;
              cube.scale.y = THREE.MathUtils.lerp(cube.scale.y, h, 0.1);
              cube.position.y = (cube.scale.y * 0.6) / 2 - 0.3;
            });
          }
          break;
        }
        case 'athena': {
          const core = v.group.getObjectByName('core');
          const ring = v.group.getObjectByName('ring');
          if (core) {
            core.rotation.y = time * 0.6;
            core.rotation.x = time * 0.25;
          }
          if (ring) {
            ring.rotation.z = time * 0.5;
            ring.rotation.y = Math.sin(time * 0.4) * 0.3;
          }
          break;
        }
        case 'aula': {
          const mosaic = v.group.getObjectByName('mosaic');
          if (mosaic) {
            mosaic.rotation.y = time * 0.4;
            mosaic.children.forEach((piece, i) => {
              piece.rotation.x += 0.01;
              piece.rotation.y += 0.012;
              piece.position.z = Math.sin(time * 1.5 + i) * 0.12;
            });
          }
          break;
        }
        case 'nexguard': {
          const core = v.group.getObjectByName('ncore');
          const scan = v.group.getObjectByName('scan');
          if (core) {
            core.rotation.y = time * 0.5;
            core.rotation.x = time * 0.3;
          }
          if (scan) {
            // sweeping radar tilt
            scan.rotation.z = time * 1.6;
            scan.rotation.y = Math.sin(time) * 0.5;
          }
          break;
        }
        case 'neural': {
          const net = v.group.getObjectByName('net');
          if (net) {
            net.rotation.y = Math.sin(time * 0.5) * 0.3;
            net.children.forEach((node, i) => {
              if (node instanceof THREE.Mesh) {
                const pulse = 1.0 + Math.sin(time * 3 + i * 0.8) * 0.25;
                node.scale.setScalar(pulse);
              }
            });
          }
          break;
        }
      }
    });

    // Gentle idle sway of the whole section (kept subtle, independent of scroll spin)
    this.group.rotation.y = Math.sin(time * 0.2) * 0.04;
    // Keep scrollY referenced for future parallax without overpowering the arc
    void scrollY;
  }
}
