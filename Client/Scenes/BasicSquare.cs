using System.Numerics;

namespace WebGL.Client.Scenes
{
    internal class BasicSquare : Scene
    {
        private Matrix4x4 PositionMatrix;

        public float[] Position => PositionMatrix.ToArray();

        public BasicSquare()
        {
            this.PositionMatrix = Matrix4x4.CreateTranslation(new Vector3(0, 0, -6));
        }

        protected override void ProcessStep(double deltaTime) { }
    }
}