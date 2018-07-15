// #pragma glslify: snoise = require("./noise2D")
attribute float aNum;
attribute float aRandom;

attribute float aColorNum;

attribute vec3 aDefTranslate;
attribute vec3 aTranslate;
attribute vec3 aScale;
attribute float aRotateY;

uniform float uRange;

uniform float uTick;
uniform vec3 uTileSize;

uniform mat4 shadowP;
uniform mat4 shadowV;
uniform vec3 uDirLightPos;

uniform vec3 uEyePosition;
uniform float uFogNear;
uniform float uFogFar;
uniform float uFogStart;
uniform float uFogEnd;

uniform float uOffsetHeight;

uniform vec3 uColorArray[2];
uniform vec3 uToneColorArray[2];

varying vec3 vColor;
varying vec3 vToneColor;
varying vec3 vNormal;

varying vec3 vPos;
varying vec4 vShadowCoord;
varying float vFogFactor;



const float PI = 3.1415926;


const mat4 biasMatrix = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

mat2 calcRotate2D(float _radian){
  float _sin = sin(_radian);
  float _cos = cos(_radian);
  return mat2(_cos, _sin, -_sin, _cos);
}

float parabola( float x) {
  return 4.0 * (1.0 - x) * x;
}

mat3 calcLookAtMatrix(vec3 vector, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(vector);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, ww, vv);
}



void main(){

  vec3 pos = (position + vec3(0.0, uTileSize.y / 2.0, 0.0)) * aScale * (1.0 + aRandom - 0.5);
  pos.xz = calcRotate2D(aRotateY * 2.0 * PI) * pos.xz;
  pos += aTranslate + aDefTranslate + vec3(0.0, uOffsetHeight, 0.0);

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);

	gl_Position = projectionMatrix * viewMatrix * worldPosition; 

  vPos = worldPosition.xyz;
  vColor = uColorArray[int(aColorNum)];
  vToneColor = uToneColorArray[int(aColorNum)];

  vNormal = normal;
  vNormal.xz = calcRotate2D(aRotateY * 2.0 * PI) * vNormal.xz;

  // vDotDiffuse = dot(normal, uDirLightPos);

  float fogLinerDepth = 1.0 / (uFogFar - uFogNear);

  float fogLinerPos = length(uEyePosition - pos) * fogLinerDepth;
  vFogFactor = clamp((uFogEnd - fogLinerPos) / (uFogEnd - uFogStart), 0.0, 1.0);

  vShadowCoord = biasMatrix * shadowP * shadowV * worldPosition;
}