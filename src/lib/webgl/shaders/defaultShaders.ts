export const defaultVertexShader = `#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out vec3 vNormal;
out vec2 vUv;

void main() {
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`;

export const defaultFragmentShader = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec2 vUv;

uniform vec3 color;
uniform float opacity;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    float light = dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
    fragColor = vec4(color * light, opacity);
}`;