attribute vec3 aPosition;
attribute float aIndex;

uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;

  vec3 rotationAxis = vec3(0.3, 0.1, 0.0);
  float angle = aIndex * 0.5 + uTime;

  vNormal = rotate(normal, rotationAxis, angle);

  vec3 pos = position;
  pos = rotate(pos, rotationAxis, angle);
  pos *= 2.0 * cos(length(aPosition) - uTime * 1.5) * 0.5 + 0.5;
  pos += aPosition;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}