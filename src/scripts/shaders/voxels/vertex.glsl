attribute vec3 aPosition;
attribute float aIndex;

uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normal;

  vec3 pos = position;
  pos *= cos(length(aPosition - 0.0) + uTime * 1.5) * 0.5 + 0.5;
  pos += aPosition;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}