window.Class.Cube = class Cube {
    constructor(gl, shaderFactory) {
        this.isInitialized = false;
        this.init(gl, shaderFactory);
    }

    async init(gl, shaderFactory) {
        this.positionBuffer = this.createPositionBuffer(gl);
        this.indexBuffer = this.createIndexBuffer(gl);
        this.colorBuffer = this.createColorBuffer(gl);
        this.shader = await shaderFactory.loadShaderProgramAsync(
            'GradientColor',
            ['aVertexPosition', 'aVertexColor'],
            ['uProjectionMatrix', 'uModelViewMatrix']
        );

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
        var faceColors = [
            [1.0, 1.0, 1.0, 1.0],    // Front face: white
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],    // Left face: purple
        ];

        // Convert the array of colors into a table for all the vertices.
        var colors = [];

        for (var i = 0; i < faceColors.length; ++i) {
            var color = faceColors[i];
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(color, color, color, color);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
    }

    renderFrame(gl, frameData) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aVertexPosition, 3, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aVertexPosition);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aVertexColor, 4, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aVertexColor);

        gl.useProgram(this.shader.program);

        gl.uniformMatrix4fv(this.shader.uniformLocations.uProjectionMatrix, false, frameData.projection);
        gl.uniformMatrix4fv(this.shader.uniformLocations.uModelViewMatrix, false, frameData.position);

        var vertexCount = 36;
        var type = gl.UNSIGNED_SHORT;
        var arrayOffset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, arrayOffset);

        gl.useProgram(null);
        gl.disableVertexAttribArray(this.shader.attribLocations.aVertexColor);
        gl.disableVertexAttribArray(this.shader.attribLocations.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    setVertexAttributePointer(gl, index, componentsPerVertex, valueType) {
        gl.vertexAttribPointer(index, componentsPerVertex, valueType, false, 0, 0);
    }

    dispose(gl) {
        this.isInitialized = false;
        gl.deleteProgram(this.shader.shaderProgram);
        gl.deleteBuffer(this.positionBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteBuffer(this.colorBuffer);
    }
};