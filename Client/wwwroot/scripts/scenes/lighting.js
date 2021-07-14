window.Class.Lighting = class Lighting {
    constructor(gl, shaderFactory, textureFactory, modelFactory) {
        this.isInitialized = false;
        this.init(gl, shaderFactory, textureFactory, modelFactory);
    }

    async init(gl, shaderFactory, textureFactory, modelFactory) {
        this.shader = await shaderFactory.loadShaderProgramAsync(
            'LightedImage',
            ['aVertexPosition', 'aTextureCoord', 'aVertexNormal'],
            ['uProjectionMatrix', 'uModelViewMatrix', 'uNormalMatrix', 'uSampler']
        );
        this.texture = await textureFactory.loadTextureAsync('Rappy');
        this.model = await modelFactory.loadObjModelAsync('Rappy');

        this.isInitialized = true;
    }

    renderFrame(gl, frameData) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.positionBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aVertexPosition, 3, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aVertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.normalBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aVertexNormal, 3, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aVertexNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.model.colorBuffer);
        this.setVertexAttributePointer(gl, this.shader.attribLocations.aTextureCoord, 2, gl.FLOAT);
        gl.enableVertexAttribArray(this.shader.attribLocations.aTextureCoord);

        gl.useProgram(this.shader.program);

        gl.uniformMatrix4fv(this.shader.uniformLocations.uProjectionMatrix, false, frameData.projection);
        gl.uniformMatrix4fv(this.shader.uniformLocations.uModelViewMatrix, false, frameData.position);
        gl.uniformMatrix4fv(this.shader.uniformLocations.uNormalMatrix, false, frameData.normals);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.shader.uniformLocations.uSampler, 0);

        var arrayOffset = 0;
        gl.drawArrays(gl.TRIANGLES, arrayOffset, this.model.vertexCount);

        gl.useProgram(null);
        gl.disableVertexAttribArray(this.shader.attribLocations.aVertexPosition);
        gl.disableVertexAttribArray(this.shader.attribLocations.aTextureCoord);
        gl.disableVertexAttribArray(this.shader.attribLocations.aVertexNormal);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    setVertexAttributePointer(gl, index, componentsPerVertex, valueType) {
        gl.vertexAttribPointer(index, componentsPerVertex, valueType, false, 0, 0);
    }

    dispose(gl) {
        this.isInitialized = false;
        gl.deleteProgram(this.shader.shaderProgram);
        gl.deleteTexture(this.texture);
        gl.deleteBuffer(this.model.positionBuffer);
        gl.deleteBuffer(this.model.colorBuffer);
        gl.deleteBuffer(this.model.normalBuffer);
    }
};