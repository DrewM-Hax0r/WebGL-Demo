using System;
using System.Numerics;
using WebGL.Client.Interfaces;

namespace WebGL.Client.Scenes
{
    internal abstract class Scene : IScene
    {
        protected Matrix4x4 ProjectionMatrix;
        public float[] Projection => ProjectionMatrix.ToArray();

        public IScene Step(double deltaTime, int viewWidth, int viewHeight)
        {
            UpdateProjection(viewWidth, viewHeight);
            ProcessStep(deltaTime);
            return this;
        }

        protected abstract void ProcessStep(double deltaTime);

        private void UpdateProjection(int viewWidth, int viewHeight)
        {
            var fieldOfView = 45 * (float)Math.PI / 180;   // in radians
            var aspect = (float)viewWidth / viewHeight;
            var near = 0.1f;
            var far = 100f;

            this.ProjectionMatrix = Matrix4x4.CreatePerspectiveFieldOfView(fieldOfView, aspect, near, far);
        }

        public static IScene Create(string name)
        {
            switch (name)
            {
                case "BasicSquare":
                    return new BasicSquare();
                case "GradientSquare":
                    return new GradientSquare();
                case "AnimatedSquare":
                    return new AnimatedSquare();
                case "Cube":
                    return new Cube();
                case "TexturedCube":
                    return new TexturedCube();
                case "ObjModel":
                    return new ObjModel();
                case "Lighting":
                    return new Lighting();
                default:
                    throw new NotImplementedException();
            }
        }
    }
}