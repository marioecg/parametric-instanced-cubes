attribute vec3 aPosition;
attribute float aIndex;

uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;
  pos *= sin(length(aPosition - 0.0) + uTime * 1.5) * 0.5 + 0.5;
  pos += aPosition;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}