import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import voxelsVertex from './shaders/voxels/vertex.glsl';
import voxelsFragment from './shaders/voxels/fragment.glsl';

import backgroundVertex from './shaders/background/vertex.glsl';
import backgroundFragment from './shaders/background/fragment.glsl';

class Sketch {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    // this.camera = new THREE.PerspectiveCamera(
    //   45,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );

    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.wide = 36;
    this.camera = new THREE.OrthographicCamera(- (this.wide / 2) * this.aspectRatio, (this.wide / 2) * this.aspectRatio, this.wide / 2, - this.wide / 2, 0.1, 100);

    this.camera.position.set(0, 0, 20);

    this.scene = new THREE.Scene();

    this.canvas = null;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.addCanvas();
    this.addEvents();
    this.addElements();
    this.render();
  }

  addCanvas() {
    this.canvas = this.renderer.domElement;
    document.body.appendChild(this.canvas);
  }

  addEvents() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  addElements() {
    // Voxels
    this.makeInstancedStuff();

    // Background
    const planeWidth = this.camera.right * 0.12;
    const planeHeight = this.camera.top * 0.12;
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertex,
      fragmentShader: backgroundFragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      }
    });

    this.background = new THREE.Mesh(planeGeometry, planeMaterial);

    this.scene.add(this.background);
  }

  makeInstancedStuff() {
    const n = 10;

    const baseGeometry = new THREE.BoxGeometry(1, 1, 1);
    const instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry);
    const instanceCount = n * n * n;
    instancedGeometry.instanceCount = instanceCount;

    // Position attribute
    let aPosition = new Float32Array(instanceCount * 3);
    let i = 0;
    let padding = 1.5;
    let middle = (n - 1) / 2;

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        for (let z = 0; z < 10; z++) {
          aPosition[i + 0] = (x - middle) * padding;
          aPosition[i + 1] = (y - middle) * padding;
          aPosition[i + 2] = (z - middle) * padding;
  
          i+=3;
        }
      }
    }

    instancedGeometry.setAttribute('aPosition', new THREE.InstancedBufferAttribute(aPosition, 3));

    // Index attribute
    let aIndex = new Float32Array(instanceCount);

    for (let i = 0; i < instanceCount; i++) {
      aIndex[i] = i;
    }    

    instancedGeometry.setAttribute('aIndex', new THREE.InstancedBufferAttribute(aIndex, 1));
  
    const material = new THREE.ShaderMaterial({
      vertexShader: voxelsVertex,
      fragmentShader: voxelsFragment,
      uniforms: {
        uTime: { value: 0 },
      },
      // wireframe: true,
    });
    this.voxels = new THREE.Mesh(instancedGeometry, material);
    this.voxels.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0);

    this.scene.add(this.voxels);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    this.aspectRatio = window.innerWidth / window.innerHeight;

    this.camera.left = -this.wide * this.aspectRatio / 2;
    this.camera.right = this.wide * this.aspectRatio / 2;
    this.camera.top = this.wide / 2;
    this.camera.bottom = -this.wide / 2;
    this.camera.updateProjectionMatrix();    

    this.background.material.uniforms.uResolution.value.x = window.innerWidth;
    this.background.material.uniforms.uResolution.value.y = window.innerHeight;
  }

  render() {
    this.controls.update();

    this.voxels.material.uniforms.uTime.value = this.clock.getElapsedTime();

    this.renderer.setAnimationLoop(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch();
