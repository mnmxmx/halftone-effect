#define GLSLIFY 1
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

float bias;
uniform sampler2D shadowMap;
uniform vec2 shadowMapSize;

varying vec4 vShadowCoord;

float unpackDepth( const in vec4 rgba_depth ) {
  const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    return dot(rgba_depth, bit_shift);
}

float sampleVisibility( vec3 coord ) {
  return step( coord.z, unpackDepth( texture2D( shadowMap, coord.xy ) ) + bias );
}

float getShadow(vec3 normal, vec3 lightPos, vec4 _shadowCoord){
  bias = 0.0;//max(0.05 * (1.0 - dot(normal, lightPos)), 0.001);  

  float shadow = 0.0;
  vec3 shadowCoord = _shadowCoord.xyz / _shadowCoord.w;

  float step = 1.0;

  vec2 inc = vec2( step ) / shadowMapSize;

  shadow += sampleVisibility( shadowCoord + vec3(     -inc.x, -inc.y, 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(     0., -inc.y, 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(     inc.x, -inc.y, 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3( -inc.x,     0., 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(     -inc.x, inc.y, 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(     0., inc.y, 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(     inc.x, inc.y, 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(  inc.x,     0., 0. ) );
  shadow += sampleVisibility( shadowCoord + vec3(     0.,      0, 0. ) );
  shadow /= 9.;

  return shadow;
}

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