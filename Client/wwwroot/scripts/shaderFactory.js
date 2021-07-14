class ShaderFactory {
    constructor(gl, blazorComponent) {
        this.gl = gl;
        this.blazorComponent = blazorComponent;
    }

    async loadShaderProgramAsync(name, attribParams, uniformParams) {
        var shaderSource = await this.blazorComponent.invokeMethodAsync('GetShader', name);

        var vertexShader = this.compileShader(this.gl.VERTEX_SHADER, shaderSource.vertexShader);
        var fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, shaderSource.fragmentShader);

        var shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        var attribLocations = {};
        if (attribParams) {
            for (var i = 0; i < attribParams.length; i++) {
                attribLocations[attribParams[i]] = this.gl.getAttribLocation(shaderProgram, attribParams[i]);
            }
        }

        var uniformLocations = {};
        if (uniformParams) {
            for (var i = 0; i < uniformParams.length; i++) {
                uniformLocations[uniformParams[i]] = this.gl.getUniformLocation(shaderProgram, uniformParams[i]);
            }
        }

        return {
            program: shaderProgram,
            attribLocations: attribLocations,
            uniformLocations: uniformLocations
        };
    }

    compileShader(type, source) {
        var shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}