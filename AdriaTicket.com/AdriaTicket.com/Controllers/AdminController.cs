using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using AdriaTicket.com.Models;

namespace AdriaTicket.com.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        AdriaTicketDataClassesDataContext AdriaTicketData = new AdriaTicketDataClassesDataContext();

        public ActionResult Index()
        {
            if (Request.IsAuthenticated)
            {
                return RedirectToAction("home", "admin");
            }
            return View("Login");
        }

        static string GetString(byte[] x)
        {
            string temp = "";

            for (int i = 0; i < x.Count(); i++)
            {
                temp += x[i].ToString();
            }

            return temp;
        }

        [HttpPost]
        public ActionResult Login(string u, string p, bool r)
        {

            SEC_LK_Korisnik user = AdriaTicketData.SEC_LK_Korisniks.SingleOrDefault(e => e.KOR_Login == u);
          
            byte[] temps = new SHA256Managed().ComputeHash(Encoding.UTF8.GetBytes(p));
            string test = GetString(temps);

            if (user != null && String.Compare(user.KOR_Zaporka, test) == 0)
            {

                var authTicket = new FormsAuthenticationTicket(
                                1,
                                u,
                                DateTime.Now,
                                DateTime.Now.AddDays(10),
                                false,
                                "Admin",
                                FormsAuthentication.FormsCookiePath
                                );

                string encryptedTicket = FormsAuthentication.Encrypt(authTicket);

                HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                cookie.HttpOnly = true;

                if (r)
                {
                    cookie.Expires = DateTime.Now.AddYears(10);
                }

                Response.Cookies.Add(cookie);

                return Json("true", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }
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
