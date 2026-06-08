import * as THREE from 'three';
import { skillsData } from '../data/portfolioData';

export class SkillsVisual {
  public group: THREE.Group;
  private nodes: THREE.Group[] = [];
  private hoveredIndex: number | null = null;

  constructor() {
    this.group = new THREE.Group();
    // Offset this group to section 3 area
    this.group.position.set(0, -24, 0);
    this.createElements();
  }

  private createElements() {
    const numNodes = skillsData.length;
    
    // Distribute skills on a Fibonacci sphere for gorgeous spacing
    for (let i = 0; i < numNodes; i++) {
      const skill = skillsData[i];
      const nodeGroup = new THREE.Group();

      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const radius = 3.2; // Sphere size

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      nodeGroup.position.set(x, y, z);
      nodeGroup.userData = { name: skill.name, index: i, skill };

      // Sphere representing the skill
      const sphereGeo = new THREE.SphereGeometry(0.35, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(skill.color),
        roughness: 0.1,
        metalness: 0.8,
        emissive: new THREE.Color(skill.color),
        emissiveIntensity: 0.25,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.name = 'sphere';
      nodeGroup.add(sphereMesh);

      // Orbiting wireframe outer ring around each skill
      const ringGeo = new THREE.TorusGeometry(0.5, 0.02, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(skill.color),
        transparent: true,
        opacity: 0.4
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'ring';
      ringMesh.rotation.x = Math.random() * Math.PI;
      ringMesh.rotation.y = Math.random() * Math.PI;
      nodeGroup.add(ringMesh);

      this.group.add(nodeGroup);
      this.nodes.push(nodeGroup);
    }

    // Add a central glow in the middle of the skills constellation
    const coreGeo = new THREE.IcosahedronGeometry(0.6, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'constellation_core';
    this.group.add(core);
  }

  public setHovered(index: number | null) {
    this.hoveredIndex = index;
  }

  public update(time: number, mouse: THREE.Vector2) {
    // Slowly rotate the entire constellation
    this.group.rotation.y = time * 0.15 + mouse.x * 0.2;
    this.group.rotation.x = Math.sin(time * 0.1) * 0.1 - mouse.y * 0.1;

    // Animate individual nodes
    this.nodes.forEach((node, idx) => {
      const isHovered = this.hoveredIndex === idx;
      
      const targetScale = isHovered ? 1.6 : 1.0;
      const targetIntensity = isHovered ? 1.5 : 0.25;

      node.scale.setScalar(THREE.MathUtils.lerp(node.scale.x, targetScale, 0.15));

      // Retrieve materials to animate emissive glow
      const sphere = node.getObjectByName('sphere') as THREE.Mesh;
      if (sphere && sphere.material) {
        const mat = sphere.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, 0.15);
      }

      // Spin the rings around hovered skill nodes faster
      const ring = node.getObjectByName('ring') as THREE.Mesh;
      if (ring) {
        const spinSpeed = isHovered ? 3.0 : 0.5;
        ring.rotation.y += spinSpeed * 0.02;
        ring.rotation.z += spinSpeed * 0.01;
      }

      // Floating drift of each node in its position
      const offset = time * 0.5 + idx;
      node.position.y += Math.sin(offset) * 0.002;
    });

    const core = this.group.getObjectByName('constellation_core') as THREE.Mesh;
    if (core) {
      core.rotation.y = -time * 0.2;
      core.rotation.x = time * 0.1;
    }
  }
}
