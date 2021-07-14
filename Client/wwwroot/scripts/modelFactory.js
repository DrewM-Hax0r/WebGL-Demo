class ModelFactory {
    constructor(gl, blazorComponent) {
        this.gl = gl;
        this.blazorComponent = blazorComponent;
    }

    async loadObjModelAsync(name) {
        var data = await this.blazorComponent.invokeMethodAsync('GetObjModel', name);

        return {
            vertexCount: data.positions.length / 3,
            positionBuffer: this.getBuffer(data.positions),
            colorBuffer: this.getBuffer(data.textureCoordinates),
            normalBuffer: this.getBuffer(data.normals)
        }
    }

    getBuffer(data) {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        return buffer;
    }
}