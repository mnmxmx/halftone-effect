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
