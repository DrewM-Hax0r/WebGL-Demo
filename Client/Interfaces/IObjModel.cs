namespace WebGL.Client.Interfaces
{
    public interface IObjModel
    {
        float[] Positions { get; }
        float[] TextureCoordinates { get; }
        float[] Normals { get; }
    }
}