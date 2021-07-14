using System.Numerics;

namespace WebGL.Client.Scenes
{
    internal class ObjModel : Scene
    {
        private Matrix4x4 PositionMatrix;
        private Vector3 Coordinates;
        private double Rotation;

        public float[] Position => PositionMatrix.ToArray();

        public ObjModel()
        {
            this.Coordinates = new Vector3(0, -1.5f, -6);
            this.Rotation = -1.57;
            this.PositionMatrix = Matrix4x4.CreateTranslation(this.Coordinates);
        }

        protected override void ProcessStep(double deltaTime) {

            this.PositionMatrix = Matrix4x4.CreateScale(2)
                * Matrix4x4.CreateRotationY((float)this.Rotation)
                * Matrix4x4.CreateTranslation(this.Coordinates);
            this.Rotation += deltaTime * 0.75;
        }
    }
}