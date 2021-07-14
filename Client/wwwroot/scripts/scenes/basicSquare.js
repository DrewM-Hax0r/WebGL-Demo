﻿window.Class.BasicSquare = class BasicSquare {
    constructor(gl, shaderFactory) {
        this.isInitialized = false;
        this.init(gl, shaderFactory);
    }

    async init(gl, shaderFactory) {
        this.buffer = this.createBuffer(gl);
        this.shader = await shaderFactory.loadShaderProgramAsync(
            'SolidWhite',
            ['aVertexPosition'],
            ['uProjectionMatrix', 'uModelViewMatrix']
        );

        this.isInitialized = true;
    }

    createBuffer(gl) {
        var buffer = gl.createBuffer();
        var positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
    }

    renderFrame(gl, frameData) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aVertexPosition, 2, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aVertexPosition);

        gl.useProgram(this.shader.program);

        gl.uniformMatrix4fv(this.shader.uniformLocations.uProjectionMatrix, false, frameData.projection);
        gl.uniformMatrix4fv(this.shader.uniformLocations.uModelViewMatrix, false, frameData.position);

        var arrayOffset = 0;
        var vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, arrayOffset, vertexCount);

        gl.useProgram(null);
        gl.disableVertexAttribArray(this.shader.attribLocations.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    setVertexAttributePointer(gl, index, componentsPerVertex, valueType) {
        gl.vertexAttribPointer(index, componentsPerVertex, valueType, false, 0, 0);
    }

    dispose(gl) {
        this.isInitialized = false;
        gl.deleteProgram(this.shader.shaderProgram);
        gl.deleteBuffer(this.buffer);
    }
};