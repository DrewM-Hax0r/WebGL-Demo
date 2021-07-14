namespace WebGL.Client.Interfaces
{
    public interface IScene {
        IScene Step(double deltaTime, int viewWidth, int viewHeight);
    }
}