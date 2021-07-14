using System.Numerics;

namespace WebGL.Client.Scenes
{
    internal class AnimatedSquare : Scene
    {
        private Matrix4x4 PositionMatrix;
        private Vector3 Coordinates;
        private double Rotation;

        public float[] Position => PositionMatrix.ToArray();

        public AnimatedSquare()
        {
            this.Coordinates = new Vector3(0, 0, -6);
            this.Rotation = 0;
            this.PositionMatrix = Matrix4x4.CreateTranslation(this.Coordinates);
        }

        protected override void ProcessStep(double deltaTime) {

            this.PositionMatrix = Matrix4x4.CreateRotationZ((float)this.Rotation) * Matrix4x4.CreateTranslation(this.Coordinates);
            this.Rotation += deltaTime;
        }
    }
}