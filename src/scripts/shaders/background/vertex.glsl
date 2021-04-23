varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_Position = vec4(pos, 1.0);
}