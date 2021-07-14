using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using WebGL.Client.Interfaces;

namespace WebGL.Client.Graphics.Models
{
    internal class ObjModel : IObjModel
    {
        public float[] Positions { get; }
        public float[] TextureCoordinates { get; }
        public float[] Normals { get; }

        public ObjModel(string name)
        {
            var vertexData = Parse(ReadFromFile(name));
            this.Positions = vertexData.Positions;
            this.TextureCoordinates = vertexData.TexCoordinates;
            this.Normals = vertexData.Normals;
        }

        private static string ReadFromFile(string name)
        {
            using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"WebGL.Client.Graphics.Models.Obj.{name}.model.obj");
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }

        private (float[] Positions, float[] TexCoordinates, float[] Normals) Parse(string data)
        {
            var positions = new List<float[]>() { new float[] { 0f, 0f, 0f } };
            var texCoordinates = new List<float[]>() { new float[] { 0f, 0f } };
            var normals = new List<float[]>() { new float[] { 0f, 0f, 0f } };

            var faces = new List<TriangleFace>();

            var lines = data.Split('\n');
            foreach(var line in lines)
            {
                var fullLine = line.Trim();
                if (string.IsNullOrEmpty(fullLine) || fullLine.StartsWith('#')) continue;

                var lineParts = fullLine.Split(' ');
                if (lineParts.Length > 0)
                {
                    var lineData = lineParts.Skip(1).ToArray();
                    switch (lineParts[0])
                    {
                        case "v":
                            positions.Add(ParsePoint(lineData));
                            break;
                        case "vt":
                            texCoordinates.Add(ParsePoint(lineData));
                            break;
                        case "vn":
                            normals.Add(ParsePoint(lineData));
                            break;
                        case "f":
                            faces.AddRange(ParseFaces(lineData));
                            break;
                    }
                }
            }

            var meshPositions = new List<float>();
            var meshTexCoordinates = new List<float>();
            var meshNormals = new List<float>();

            foreach (var face in faces)
            {
                meshPositions.AddRange(face.GetPositions(positions));
                meshTexCoordinates.AddRange(face.GetTexCoordinates(texCoordinates));
                meshNormals.AddRange(face.GetNormals(normals));
            }

            return (
                meshPositions.ToArray(),
                meshTexCoordinates.ToArray(),
                meshNormals.ToArray()
            );
        }

        private static float[] ParsePoint(string[] data)
        {
            var vertex = new float[data.Length];
            for (int i = 0; i < vertex.Length; i++)
                vertex[i] = float.Parse(data[i].Trim());
            return vertex;
        }

        private static TriangleFace[] ParseFaces(string[] data)
        {
            var triangles = new List<TriangleFace>();
            var triangleCount = data.Length - 2;

            for(int i = 0; i < triangleCount; i++)
            {
                triangles.Add(new TriangleFace(
                    new FaceVertex(data[0]),
                    new FaceVertex(data[i + 1]),
                    new FaceVertex(data[i + 2])
                ));
            }

            return triangles.ToArray();
        }

        private class FaceVertex
        {
            public int PositionIndex { get; }
            public int TexCoordinateIndex { get; }
            public int NormalIndex { get; }

            public FaceVertex(string data)
            {
                var parts = data.Split('/');
                this.PositionIndex = int.Parse(parts[0]);
                this.TexCoordinateIndex = int.Parse(parts[1]);
                this.NormalIndex = int.Parse(parts[2]);
            }
        }

        private class TriangleFace
        {
            public FaceVertex[] Verticies { get; }

            public TriangleFace(FaceVertex p1, FaceVertex p2, FaceVertex p3)
            {
                this.Verticies = new FaceVertex[] { p1, p2, p3 };
            }

            public float[] GetPositions(List<float[]> lookup)
            {
                var positions = new List<float>();
                foreach (var vertex in this.Verticies)
                {
                    var lookupIndex = vertex.PositionIndex + (vertex.PositionIndex >= 0 ? 0 : lookup.Count); // not needed?
                    positions.AddRange(lookup[lookupIndex]);
                }

                return positions.ToArray();
            }

            public float[] GetTexCoordinates(List<float[]> lookup)
            {
                var texCoordinates = new List<float>();
                foreach (var vertex in this.Verticies)
                {
                    var lookupIndex = vertex.TexCoordinateIndex + (vertex.TexCoordinateIndex >= 0 ? 0 : lookup.Count); // not needed?
                    texCoordinates.AddRange(lookup[lookupIndex]);
                }

                return texCoordinates.ToArray();
            }

            public float[] GetNormals(List<float[]> lookup)
            {
                var normals = new List<float>();
                foreach (var vertex in this.Verticies)
                {
                    var lookupIndex = vertex.NormalIndex + (vertex.NormalIndex >= 0 ? 0 : lookup.Count); // not needed?
                    normals.AddRange(lookup[lookupIndex]);
                }

                return normals.ToArray();
            }
        }
    }
}