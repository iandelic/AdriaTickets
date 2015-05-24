using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using AdriaTicket.com.Models;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net;
using System.IO;

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
                return Json(test, JsonRequestBehavior.AllowGet);
            }
        }

        [Authorize]
        public ActionResult Home()
        {
            return View("Home");
        }

        [Authorize]
        public ActionResult LogOff()
        {
            Session.Abandon();
            System.Web.Security.FormsAuthentication.SignOut();
            return Redirect("/");
        }
        [Authorize]
        public ActionResult Events()
        {
            return View();
        }

        [Authorize]
        public ActionResult Event()
        {
            return View();
        }
        public ActionResult getEvent(int id)
        {
            var ev = from Event in AdriaTicketData.LK_Events join statusEventa in AdriaTicketData.LK_StatusEventas on Event.EVE_StatusEventaId equals statusEventa.SEV_Id 
                     join organizator in AdriaTicketData.LK_Organizators on Event.EVE_OrganizatorId equals organizator.ORG_Id
                     where Event.EVE_Id == id 
                     select new { Event.EVE_Naziv, Event.EVE_Opis, Event.EVE_ImagePath, Event.EVE_ImageSmallPath, Event.EVE_Datum, Event.EVE_DatumOdProdaja, Event.EVE_DatumOdPretprodaja,
                         Event.EVE_PostotakProvizije, Event.EVE_DvoranaId, organizator.ORG_Naziv,organizator.ORG_Id, statusEventa.SEV_Stanje, statusEventa.SEV_Id,Event.EVE_PrikaziNaWebu,
                         Event.EVE_MjestoId   };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getEvents()
        {
            var events = from e in AdriaTicketData.LK_Events  orderby e.EVE_Datum descending select new { e.EVE_Id, e.EVE_Opis, e.EVE_Naziv };

            return Json(events, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ContentResult Upload(HttpPostedFileBase file)
        {
            var filename = Path.GetFileName(file.FileName);
            var path = Path.Combine(Server.MapPath("~/uploads"), filename);
            file.SaveAs(path);

            return new ContentResult{
                ContentType = "text/plain",
                Content = filename,
                ContentEncoding = Encoding.UTF8
               };
        }

    }
}