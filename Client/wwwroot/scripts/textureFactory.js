class TextureFactory {
    constructor(gl, blazorComponent) {
        this.gl = gl;
        this.blazorComponent = blazorComponent;
    }

    async loadTextureAsync(name) {
        var textureSource = await this.blazorComponent.invokeMethodAsync('GetTexture', name);

        var image = new Promise((resolve, reject) => {
            var element = new Image();
            element.src = 'data:image/png;base64, ' + textureSource.imageData;
            element.onload = function () {
                resolve(element);
            };
            element.onerror = reject;
        });

        var imgEl = await image;

        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        var level = 0;
        var internalFormat = this.gl.RGBA;
        var srcFormat = this.gl.RGBA;
        var srcType = this.gl.UNSIGNED_BYTE;
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, imgEl);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        return texture;
    }
}