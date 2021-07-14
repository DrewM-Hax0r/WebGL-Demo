using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Threading.Tasks;
using WebGL.Client.Graphics.Shaders;
using WebGL.Client.Graphics.Textures;
using WebGL.Client.Interfaces;
using WebGL.Client.Scenes;

namespace WebGL.Client.Components
{
    public partial class AppCanvas
    {
        private DotNetObjectReference<AppCanvas> ComponentReference;
        private IScene CurrentScene;

        [Inject]
        protected IJSRuntime Js { get; set; }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                this.ComponentReference = DotNetObjectReference.Create(this);
                await this.Js.InvokeVoidAsync("window.startEngine", this.ComponentReference);
                await this.ChangeScene("BasicSquare");
            }
        }

        public async Task ChangeScene(string name)
        {
            this.CurrentScene = Scene.Create(name);
            await this.Js.InvokeVoidAsync("window.engine.changeScene", name);
        }

        [JSInvokable]
        public IScene StepFrame(double deltaTime, int viewWidth, int viewHeight)
        {
            return this.CurrentScene?.Step(deltaTime, viewWidth, viewHeight);
        }

        [JSInvokable]
        public IShader GetShader(string name)
        {
            return new Shader(name);
        }

        [JSInvokable]
        public ITexture GetTexture(string name)
        {
            return new Texture(name);
        }

        [JSInvokable]
        public IObjModel GetObjModel(string name)
        {
            return new Graphics.Models.ObjModel(name);
        }

        public void Dispose()
        {
            this.ComponentReference?.Dispose();
        }
    }
}