uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vUv;
  uv -= 0.5;
  uv.x *= aspect;
  float gradient = length(uv);
  vec3 pink1 = vec3(0.9843, 0.6745, 0.8);
  vec3 pink2 = vec3(0.9725, 0.4588, 0.6666);
  vec3  color = mix(pink1, pink2, gradient);
  gl_FragColor = vec4(vec3(0.0), 1.0);
}