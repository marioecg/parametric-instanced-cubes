varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 color = vec3(0.9843, 0.6745, 0.8);
  vec3 lightDir = vec3(1.0, 1.0, 0.0);
  float light = dot(vNormal, lightDir);
  color += light * 0.2;

  gl_FragColor = vec4(color, 1.0);
}