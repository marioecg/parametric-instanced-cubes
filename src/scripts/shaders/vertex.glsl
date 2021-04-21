attribute vec3 aPosition;
attribute float aIndex;

uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position + aPosition;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}