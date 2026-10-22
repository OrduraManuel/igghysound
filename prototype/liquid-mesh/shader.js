// Original IgghySound study. Reference techniques are documented in REPORT.md.
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uSize;
  uniform float uDistortion;
  uniform float uDimming;
  uniform float uGrain;
  uniform vec3 uBase;
  uniform vec3 uViolet;
  uniform vec3 uMagenta;
  uniform vec3 uPink;
  uniform vec3 uBlue;
  uniform vec3 uCoral;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Soft, unbounded light fields. There are no visible blob silhouettes.
  float lightField(vec2 p, vec2 center, vec2 radius) {
    vec2 q = (p - center) / (radius * uSize);
    return exp(-dot(q, q) * 1.8);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float t = uTime;

    // Coupled traveling waves advect the light fields. Their changing phase
    // creates visible liquid motion without a moving mesh or hard outlines.
    float broadX = sin(p.y * 4.4 + t * 0.64 + 0.6 * sin(p.x * 2.5 - t * 0.31));
    float broadY = cos(p.x * 3.7 - t * 0.52 + 0.7 * sin(p.y * 3.1 + t * 0.37));
    vec2 wave = vec2(
      broadX + 0.42 * sin(p.y * 8.3 - p.x * 2.1 - t * 0.85),
      broadY + 0.38 * cos(p.x * 6.8 + p.y * 2.7 + t * 0.73)
    );
    p += wave * (0.105 * uDistortion);

    float left = -0.5 * aspect;
    float right = 0.5 * aspect;
    float mobile = 1.0 - smoothstep(0.7, 1.55, aspect);
    float edgeScale = mix(1.0, 0.82, mobile);
    vec3 color = uBase;

    // The voucher's luminous top-left and right rim anchor the composition.
    float violet = lightField(p, vec2(left + 0.14 * aspect + 0.065 * sin(t * 0.48), 0.33 + 0.055 * cos(t * 0.39)), vec2(0.36 * edgeScale, 0.38));
    float pink = lightField(p, vec2(left + 0.11 * aspect + 0.075 * sin(t * 0.57 + 0.8), 0.30 + 0.065 * cos(t * 0.51)), vec2(0.19 * edgeScale, 0.22));
    float rightMagenta = lightField(p, vec2(right - 0.09 * aspect + 0.09 * sin(t * 0.46 + 1.2), 0.015 + 0.075 * cos(t * 0.42)), vec2(0.27 * edgeScale, 0.38));
    float rightCore = lightField(p, vec2(right - 0.13 * aspect + 0.055 * sin(t * 0.54 + 1.8), 0.04 + 0.09 * cos(t * 0.48)), vec2(0.10 * edgeScale, 0.13));
    float blue = lightField(p, vec2(left + 0.02 * aspect + 0.055 * cos(t * 0.43), -0.41 + 0.055 * sin(t * 0.37)), vec2(0.26 * edgeScale, 0.27));
    float lowerPink = lightField(p, vec2(left + 0.09 * aspect + 0.065 * sin(t * 0.38), -0.55), vec2(0.29 * edgeScale, 0.19));
    float coral = lightField(p, vec2(right + 0.02 * aspect + 0.055 * sin(t * 0.36), 0.43 + 0.04 * cos(t * 0.47)), vec2(0.18 * edgeScale, 0.19));
    float lowerBlue = lightField(p, vec2(right - 0.02 * aspect + 0.05 * cos(t * 0.41), -0.50), vec2(0.26 * edgeScale, 0.20));

    color += uIntensity * (
      uViolet * violet * 0.85 + uPink * pink * 0.95
      + uMagenta * rightMagenta * 0.75 + uPink * rightCore * 0.70
      + uBlue * blue * 0.55 + uMagenta * lowerPink * 0.30
      + uCoral * coral * 0.46 + uBlue * lowerBlue * 0.36
    );

    // A broad dark mask protects the center, with a little room for the title.
    vec2 center = vec2(0.0, 0.005);
    vec2 q = (vec2((uv.x - 0.5) * aspect, uv.y - 0.5) - center) / vec2(0.46, 0.36);
    float centerMask = exp(-dot(q, q) * 1.55);
    color = mix(color, uBase, centerMask * uDimming);

    // Stable fine dither plus low amplitude animated monochrome grain.
    vec2 pixel = floor(uv * uResolution);
    float dither = hash21(pixel) - 0.5;
    float grain = hash21(pixel + vec2(mod(floor(t * 16.0), 1019.0) * 17.0, 91.0)) - 0.5;
    color += vec3(dither * 0.004 + grain * uGrain);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
