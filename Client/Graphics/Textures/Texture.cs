using System.IO;
using System.Reflection;
using WebGL.Client.Interfaces;

namespace WebGL.Client.Graphics.Textures
{
    public class Texture : ITexture
    {
        public byte[] ImageData { get; }

        public Texture(string name)
        {
            this.ImageData = ReadFromFile(name);
        }

        private static byte[] ReadFromFile(string name)
        {
            using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"WebGL.Client.Graphics.Textures.Images.{name}.png");
            using var memoryStream = new MemoryStream();
            stream.CopyTo(memoryStream);
            return memoryStream.ToArray();
        }
    }
}