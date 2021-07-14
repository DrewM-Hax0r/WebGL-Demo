window.Class.TexturedCube = class TexturedCube {
    constructor(gl, shaderFactory, textureFactory) {
        this.isInitialized = false;
        this.init(gl, shaderFactory, textureFactory);
    }

    async init(gl, shaderFactory, textureFactory) {
        this.positionBuffer = this.createPositionBuffer(gl);
        this.indexBuffer = this.createIndexBuffer(gl);
        this.colorBuffer = this.createColorBuffer(gl);
        this.shader = await shaderFactory.loadShaderProgramAsync(
            'BasicImage',
            ['aVertexPosition', 'aTextureCoord'],
            ['uProjectionMatrix', 'uModelViewMatrix', 'uSampler']
        );
        this.texture = await textureFactory.loadTextureAsync('WebGL');

        this.isInitialized = true;
    }

    createPositionBuffer(gl) {
        var buffer = gl.createBuffer();
        var positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
    }

    createIndexBuffer(gl) {
        var buffer = gl.createBuffer();

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        var indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return buffer;
    }

    createColorBuffer(gl) {
        var buffer = gl.createBuffer();

        var textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
    }

    renderFrame(gl, frameData) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aVertexPosition, 3, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aVertexPosition);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aTextureCoord, 2, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aTextureCoord);

        gl.useProgram(this.shader.program);

        gl.uniformMatrix4fv(this.shader.uniformLocations.uProjectionMatrix, false, frameData.projection);
        gl.uniformMatrix4fv(this.shader.uniformLocations.uModelViewMatrix, false, frameData.position);

        gl.activeTexture(gl.TEXTURE0); // Tell WebGL we want to affect texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture); // Bind the texture to texture unit 0
        gl.uniform1i(this.shader.uniformLocations.uSampler, 0); // Tell the shader we bound the texture to texture unit 0

        var vertexCount = 36;
        var type = gl.UNSIGNED_SHORT;
        var arrayOffset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, arrayOffset);

        gl.useProgram(null);
        gl.disableVertexAttribArray(this.shader.attribLocations.aVertexPosition);
        gl.disableVertexAttribArray(this.shader.attribLocations.aTextureCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    setVertexAttributePointer(gl, index, componentsPerVertex, valueType) {
        gl.vertexAttribPointer(index, componentsPerVertex, valueType, false, 0, 0);
    }

    dispose(gl) {
        this.isInitialized = false;
        gl.deleteProgram(this.shader.shaderProgram);
        gl.deleteTexture(this.texture);
        gl.deleteBuffer(this.positionBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteBuffer(this.colorBuffer);
    }
};