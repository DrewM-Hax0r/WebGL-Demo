using System.Numerics;

namespace WebGL.Client.Scenes
{
    internal class TexturedCube : Scene
    {
        private Matrix4x4 PositionMatrix;
        private Vector3 Coordinates;
        private double YRotation;
        private double ZRotation;

        public float[] Position => PositionMatrix.ToArray();

        public TexturedCube()
        {
            this.Coordinates = new Vector3(0, 0, -6);
            this.YRotation = 0;
            this.ZRotation = 0;
            this.PositionMatrix = Matrix4x4.CreateTranslation(this.Coordinates);
        }

        protected override void ProcessStep(double deltaTime) {

            this.PositionMatrix = Matrix4x4.CreateRotationY((float)this.YRotation)
                * Matrix4x4.CreateRotationZ((float)this.ZRotation)
                * Matrix4x4.CreateTranslation(this.Coordinates);

            this.YRotation += 0.7 * deltaTime;
            this.ZRotation += deltaTime;
        }
    }
}