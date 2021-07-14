using Microsoft.AspNetCore.Mvc;
using WebGL.Server.Dtos;

namespace WebGL.Server.Controllers
{
    [Route("[controller]")]
    public class ApplicationController : Controller
    {
        [HttpGet("index")]
        public IActionResult Index()
        {
            var viewModel = new ApplicationIndexDto()
            {
                BasePath = this.HttpContext.Request.PathBase + "/"
            };
            return View("Index", viewModel);
        }
    }
}