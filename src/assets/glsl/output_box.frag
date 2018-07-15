uniform float uTick;
uniform vec3 uDirLightPos;
uniform float uDotScale;
uniform float uLineScale;
uniform int uTonePattern;

uniform vec3 uFogColor;


varying vec3 vPos;
varying vec3 vNormal;

varying vec3 vColor;
varying vec3 vToneColor;

varying float vFogFactor;

#pragma glslify: import("./utils/getShadow.glsl")
#pragma glslify: import("./utils/blendSoftlight.glsl")
#pragma glslify: import("./utils/blendOverlay.glsl")



const float PI = 3.1415926;

// hemisphere ground color
const vec3 hemiLight_g = vec3(1.0, 0.96, 0.8);

// hemisphere sky color
const vec3 hemiLight_s_1 = vec3(0.9,0.8,0.6);
const vec3 hemiLight_s_2 = vec3(0.9,0.6,0.7);

const vec3 hemiLightPos_1 = vec3(-100.0, -100.0, 100.0);
const vec3 hemiLightPos_2 = vec3(-100.0, 100.0, -100.0);

// directional light color
const vec3 dirLight_1 = vec3(1.0);


vec3 calcIrradiance_hemi(vec3 newNormal, vec3 lightPos, vec3 grd, vec3 sky){
  float dotNL = clamp(dot(newNormal, normalize(lightPos)), 0.0, 1.0);

  return mix(grd, sky, dotNL);
}

vec3 calcIrradiance_dir(vec3 normal, vec3 lightPos, vec3 light){
  float dotNL = dot(normal, normalize(lightPos));

  return light * max(dotNL, 0.0);
}


float getScreenToneEffect(float dotDiffuse){

  vec2 v_dot;
  vec2 v_line;

  float f_dot;
  float f_line;
  float g_line;

  float result;

  if(uTonePattern == 1){
    v_dot = gl_FragCoord.xy * uDotScale;
    f_dot = max(sin(v_dot.x) * cos(v_dot.y) * 1.5, 0.0);

    if(dotDiffuse > 0.6){
      result = 1.0;
    }else if(dotDiffuse > 0.2){
      result = 1.0 - (pow(f_dot, 1.0));
    }else{
      result = pow(f_dot, 2.0);
    }

  } else if(uTonePattern == 2){
    v_line = gl_FragCoord.xy * uLineScale;
    f_line = max(sin(v_line.x + v_line.y), 0.0);
    g_line = max(sin(v_line.x - v_line.y), 0.0);


    if(dotDiffuse > 0.6){
      result = 0.8;
    }else if(dotDiffuse > 0.2){
      result = 1.0 - pow(f_line, 2.0);
    }else{
      result = 1.0 - (pow(f_line, 2.0) + pow(g_line, 2.0));
    }
  }

  result = clamp(result, 0.0, 1.0);

  return result;
}



void main(){
  vec3 dirColor = vec3(0.0);

  float dirColorRatio = 0.2;
  dirColor += calcIrradiance_dir(vNormal, uDirLightPos, dirLight_1) * dirColorRatio;

  vec3 hemiColor = vec3(0.0);
  hemiColor += calcIrradiance_hemi(vNormal, hemiLightPos_1, hemiLight_g, hemiLight_s_1) * (0.7 - dirColorRatio) * 0.5;
  hemiColor += calcIrradiance_hemi(vNormal, hemiLightPos_2, hemiLight_g, hemiLight_s_2) * (0.7 - dirColorRatio) * 0.5;

  float shadow = getShadow(vNormal, uDirLightPos, vShadowCoord);


  vec3 _color = vColor * 0.8;
  vec3 ambient = _color;

  vec3 color = (ambient + shadow * dirColor) * (1.0 + hemiColor); 


  // half-tone effect
  float dotDiffuse = clamp(dot(vNormal, normalize(uDirLightPos)), 0.0, 1.0);
  dotDiffuse *= shadow;

  float f = getScreenToneEffect(dotDiffuse);

  vec3 dotColor = vToneColor;//blendOverlay(color, vToneColor);


  color = mix(dotColor, color, f);
  color = mix(uFogColor, color, min(1.0, vFogFactor));


  gl_FragColor = vec4(color, 1.0);
}