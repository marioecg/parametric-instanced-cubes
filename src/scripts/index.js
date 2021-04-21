import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

class Sketch {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.scene = new THREE.Scene();

    this.canvas = null;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.clock = new THREE.Clock();

    this.resize();
    this.init();
  }

  init() {
    this.addCanvas();
    this.addEvents();
    this.makeInstancedStuff();
    this.render();
  }

  addCanvas() {
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);
  }

  addEvents() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  makeInstancedStuff() {
    const baseGeometry = new THREE.SphereGeometry(1);
    const instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry);
    const instanceCount = 1000;
    instancedGeometry.instanceCount = instanceCount;

    let aIndex = new Float32Array(instanceCount);
    
    for (let i = 0; i < aIndex.length; i++) {
      aIndex[i] = i / (aIndex.length - 1);
    }    

    instancedGeometry.setAttribute('aIndex', new THREE.InstancedBufferAttribute(aIndex, 1));
  
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(instancedGeometry, material);

    this.scene.add(mesh);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.controls.update();

    this.renderer.setAnimationLoop(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch();
