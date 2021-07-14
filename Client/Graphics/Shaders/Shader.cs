using System.IO;
using System.Reflection;
using WebGL.Client.Interfaces;

namespace WebGL.Client.Graphics.Shaders
{
    internal class Shader : IShader
    {
        public string VertexShader { get; }
        public string FragmentShader { get; }

        public Shader(string name)
        {
            this.VertexShader = ReadFromFile(name, "vert");
            this.FragmentShader = ReadFromFile(name, "frag");
        }

        private static string ReadFromFile(string name, string type)
        {
            using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"WebGL.Client.Graphics.Shaders.{name}.shader.{type}");
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }
    }
}