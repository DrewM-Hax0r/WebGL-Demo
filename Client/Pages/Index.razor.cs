using WebGL.Client.Components;

namespace WebGL.Client.Pages
{
    public partial class Index
    {
        private AppCanvas Canvas;
        private bool DrawerOpen;

        private void ToggleDrawer()
        {
            this.DrawerOpen = !this.DrawerOpen;
        }

        private async void ChangeScene(string name)
        {
            this.DrawerOpen = false;
            await this.Canvas.ChangeScene(name);
        }
    }
}