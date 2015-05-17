using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace AdriaTicket.com.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/

        public ActionResult Index()
        {
            if (Request.IsAuthenticated)
            {
                return RedirectToAction("home", "admin");
            }
            return View("Login");
        }
        [HttpPost]
        public ActionResult Login()
        {
            var authTicket = new FormsAuthenticationTicket(
                            1,
                            "testuser",
                            DateTime.Now,
                            DateTime.Now.AddMinutes(2),
                            false,
                            "Admin",
                            FormsAuthentication.FormsCookiePath                       
                            );

            string encryptedTicket = FormsAuthentication.Encrypt(authTicket);

            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
              cookie.HttpOnly = true; 
              Response.Cookies.Add(cookie);
            return Json("logged in", JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        public ActionResult Home()
        {
            return View("Home");
        }

        public ActionResult LogOff()
        {
            Session.Abandon();
            System.Web.Security.FormsAuthentication.SignOut();
            return Redirect("/");
        }

    }
}
