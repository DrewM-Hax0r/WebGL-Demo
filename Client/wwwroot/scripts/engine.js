window.startEngine = function(blazorComponent) {
    window.engine = new Engine(blazorComponent);
    window.processFrame(0);
};

window.processFrame = function(frameNumber) {
    window.engine.processFrame(frameNumber);
    requestAnimationFrame(window.processFrame);
};

window.addEventListener('resize', function () {
    window.engine.autosize();
});

class Engine {
    constructor(blazorComponent) {
        this.blazorComponent = blazorComponent;
        this.canvasElm = document.getElementById('AppCanvas');

        this.gl = this.canvasElm.getContext('webgl');
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        this.lastTime = 0;

        this.shaderFactory = new ShaderFactory(this.gl, this.blazorComponent);
        this.textureFactory = new TextureFactory(this.gl, this.blazorComponent);
        this.modelFactory = new ModelFactory(this.gl, this.blazorComponent);

        this.scene = {
            isInitialized: false
        };

        this.autosize();
    }

    autosize() {
        var view = document.getElementById('AppCanvasBounds');
        this.canvasElm.width = view.clientWidth;
        this.canvasElm.height = view.clientHeight;
    }

    changeScene(name) {
        if (this.scene.isInitialized) { this.scene.dispose(this.gl); }
        this.scene = new Class[name](this.gl, this.shaderFactory, this.textureFactory, this.modelFactory);
    }

    async processFrame(frameNumber) {
        // Convert to seconds, calculate deltaTime
        var currentTime = frameNumber * 0.001; // Convert to seconds
        var deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        var frameData = null;
        if (this.scene.isInitialized) {
            frameData = await this.blazorComponent.invokeMethodAsync('StepFrame', deltaTime, this.canvasElm.width, this.canvasElm.height);
        }

        this.renderFrame(frameData);
    }

    renderFrame(frameData) {
        this.gl.viewport(0, 0, this.canvasElm.width, this.canvasElm.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Render scene
        if (frameData) {
            this.scene.renderFrame(this.gl, frameData);
        }

        // Empty gl context
        this.gl.flush();
    }
}