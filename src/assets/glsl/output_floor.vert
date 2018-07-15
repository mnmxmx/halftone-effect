uniform mat4 shadowP;
uniform mat4 shadowV;
uniform vec3 uDirLightPos;

uniform vec3 uEyePosition;
uniform float uFogNear;
uniform float uFogFar;
uniform float uFogStart;
uniform float uFogEnd;

uniform float uOffsetHeight;

varying vec3 vNormal;

varying vec4 vShadowCoord;
varying float vFogFactor;

const float PI = 3.1415926;

const mat4 biasMatrix = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

void main(){
  vec3 pos = position + vec3(0.0, uOffsetHeight, 0.0);

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldPosition; 

  float fogLinerDepth = 1.0 / (uFogFar - uFogNear);

  float fogLinerPos = length(uEyePosition - pos) * fogLinerDepth;
  vFogFactor = clamp((uFogEnd - fogLinerPos) / (uFogEnd - uFogStart), 0.0, 1.0);

  vNormal = normal;

  // vDotDiffuse = dot(normal, uDirLightPos) * 0.5 + 0.5;

  vShadowCoord = biasMatrix * shadowP * shadowV * worldPosition;
}