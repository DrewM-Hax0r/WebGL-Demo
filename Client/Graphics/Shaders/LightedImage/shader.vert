attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vLighting;

void main(void) {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	vTextureCoord = aTextureCoord;
	
	vec3 ambientLight = vec3(0.2, 0.2, 0.2);
	vec3 lightPosition = vec3(0.0, -5.0, 10.0);
	vec3 lightColor = vec3(1, 1, 1);
	
	vec3 surfaceWorldPosition = (uProjectionMatrix * uModelViewMatrix * aVertexPosition).xyz;
	vec3 directionalVector = lightPosition - surfaceWorldPosition;

	vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
	
	float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0) * 0.5;
	vLighting = ambientLight + (lightColor * directional);
}