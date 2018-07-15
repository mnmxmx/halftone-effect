uniform float uTick;
uniform vec3 uDirLightPos;
uniform float uDotScale;
uniform float uLineScale;
uniform vec3 uFloorToneColor;

uniform int uTonePattern;




varying vec3 vNormal;

uniform vec3 uFogColor;
varying float vFogFactor;


const float PI = 3.1415926;

#pragma glslify: import("./utils/getShadow.glsl")

float getHalfToneEffect(float dotDiffuse){
  vec2 v_dot;
  vec2 v_line;

  float f_dot;
  float f_line;
  float g_line;

  float result;

  if(uTonePattern == 1){
    v_dot = gl_FragCoord.xy * uDotScale;
    f_dot = max(sin(v_dot.x) * cos(v_dot.y) * 1.5, 0.0);

    if(dotDiffuse > 0.2){
      result = 1.0;
    } else{
      result = f_dot;
    }

  } else if(uTonePattern == 2){
    v_line = gl_FragCoord.xy * uLineScale;
    f_line = max(sin(v_line.x + v_line.y), 0.0);
    g_line = max(sin(v_line.x - v_line.y), 0.0);

    if(dotDiffuse > 0.2){
      result = 1.0;
    } else{
      result = (pow(f_line, 2.0) + pow(g_line, 2.0));
    }
  }

  
  

  result = min(1.0, result);

  return result;
}


void main(){
  float shadow = getShadow(vNormal, uDirLightPos, vShadowCoord);

  // half tone effect
  float dotDiffuse = clamp(dot(vNormal, normalize(uDirLightPos)), 0.0, 1.0);
  dotDiffuse *= shadow;

  float f = getHalfToneEffect(dotDiffuse);

  vec3 color = uFogColor;

  color = mix(uFloorToneColor, color, f);
  color = mix(uFogColor, color, min(1.0, vFogFactor));

  gl_FragColor = vec4(color, 1.0);
}