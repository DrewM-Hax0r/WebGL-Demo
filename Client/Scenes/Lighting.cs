using System.Numerics;

namespace WebGL.Client.Scenes
{
    internal class Lighting : Scene
    {
        private Matrix4x4 PositionMatrix;
        private Matrix4x4 NormalMatrix;
        private Vector3 Coordinates;
        private Vector3 RotationOrigin;
        private double Rotation;

        public float[] Position => PositionMatrix.ToArray();
        public float[] Normals => NormalMatrix.ToArray();

        public Lighting()
        {
            this.Coordinates = new Vector3(0, -1.5f, -14);
            this.RotationOrigin = new Vector3(0, 0, -7);
            this.Rotation = -1.57;
            this.PositionMatrix = Matrix4x4.CreateTranslation(this.Coordinates);
        }

        protected override void ProcessStep(double deltaTime) {

            this.PositionMatrix = Matrix4x4.CreateScale(2)
                * Matrix4x4.CreateRotationY((float)this.Rotation)
                * Matrix4x4.CreateTranslation(this.RotationOrigin)
                * Matrix4x4.CreateRotationY((float)-this.Rotation)
                * Matrix4x4.CreateTranslation(this.Coordinates);

            Matrix4x4 inverse;
            Matrix4x4.Invert(this.PositionMatrix, out inverse);
            this.NormalMatrix = Matrix4x4.Transpose(inverse);

            this.Rotation += deltaTime * 0.75;
        }
    }
}