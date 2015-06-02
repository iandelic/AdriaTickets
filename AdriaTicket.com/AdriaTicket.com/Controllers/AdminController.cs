﻿using System;
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
        public ActionResult Galleries()
        {
            return View();
        }
        public ActionResult Gallery(int id)
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
                     join video in AdriaTicketData.BK_VideoGalleries on Event.EVE_Id equals video.eventID
                     where Event.EVE_Id == id 
                     select new { Event.EVE_Naziv, Event.EVE_Id,Event.EVE_Opis, Event.EVE_ImagePath, Event.EVE_ImageSmallPath, Event.EVE_Datum, Event.EVE_DatumOdProdaja, Event.EVE_DatumOdPretprodaja,
                         Event.EVE_PostotakProvizije, Event.EVE_DvoranaId, organizator.ORG_Naziv,organizator.ORG_Id, statusEventa.SEV_Stanje, statusEventa.SEV_Id,Event.EVE_PrikaziNaWebu,
                         Event.EVE_MjestoId, video.videoLink   };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEvents()
        {
            var events = from e in AdriaTicketData.LK_Events where e.EVE_Datum > DateTime.Now.AddMonths(-2) orderby e.EVE_Datum descending select new { e.EVE_Id, e.EVE_Datum, e.EVE_Opis, e.EVE_Naziv };

            return Json(events, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveEvent(string naziv, string opis, string datum, string datumOdpretprodaja, string datumOdProdaja, int organizator, decimal postotakprovizije, int mjesto, int dvorana, int status, Boolean prikaznaWebu, int id, string image, string videoLink)
        {
            LK_Event ev = new LK_Event();
            ev = AdriaTicketData.LK_Events.FirstOrDefault(x => x.EVE_Id == id);
            ev.EVE_Datum = DateTime.ParseExact(datum, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            ev.EVE_DatumOdPretprodaja = DateTime.ParseExact(datum, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            ev.EVE_DatumOdProdaja = DateTime.ParseExact(datum, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            ev.EVE_DvoranaId = dvorana;
            ev.EVE_FlagOnlineProdaja = true;
            ev.EVE_MjestoId = mjesto;
            ev.EVE_Naziv = naziv;
            ev.EVE_Opis =HttpUtility.HtmlDecode(opis);
            ev.EVE_ImageExist = true;
            ev.EVE_ImagePath = image;
            ev.EVE_ReklamaExist = false;
            ev.EVE_FlagOnlineProdaja = true;
            ev.EVE_Stanje = 'A';
            ev.EVE_Timestamp = DateTime.Now;
            ev.EVE_OrganizatorId = organizator;
            ev.EVE_PostotakProvizije = postotakprovizije;
            ev.EVE_PrikaziNaWebu = prikaznaWebu;
            ev.EVE_StatusEventaId = status;
            string msg = "";
            if (id == null)
            {
                msg = "insert";
                AdriaTicketData.LK_Events.InsertOnSubmit(ev);
            }
            else
            {
                msg = "update";
            }
            AdriaTicketData.SubmitChanges();
            if (id > 0 && videoLink != null)
            {
                BK_VideoGallery video = new BK_VideoGallery();
                video.eventID = id;
                video.videoLink = videoLink;
                AdriaTicketData.BK_VideoGalleries.InsertOnSubmit(video);
            }
            else if(id > 0 && videoLink == null)
            {
                BK_VideoGallery video = AdriaTicketData.BK_VideoGalleries.FirstOrDefault(x => x.eventID == id);
                    AdriaTicketData.BK_VideoGalleries.DeleteOnSubmit(video);
            }
            else{
            LK_Event temp = AdriaTicketData.LK_Events.FirstOrDefault(x=> x.EVE_Naziv == naziv);
                BK_VideoGallery video = new BK_VideoGallery();
                video.eventID = temp.EVE_Id;
                video.videoLink = videoLink;
                AdriaTicketData.BK_VideoGalleries.InsertOnSubmit(video);

            }

            AdriaTicketData.SubmitChanges();
           return Json(msg, JsonRequestBehavior.AllowGet);
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

        [Authorize]
        [HttpPost]
        public ActionResult SaveImage(string image, int id)
        {
            string[] array = image.Split(new string[] { "$%$" },StringSplitOptions.RemoveEmptyEntries);
            foreach(string item in array )
            {
                BK_Image i = new BK_Image();
                i.ImageName = item;
                i.ImageAlt = null;
                i.GalleryId = id;
                AdriaTicketData.BK_Images.InsertOnSubmit(i);
            }
            
            AdriaTicketData.SubmitChanges();
            return Json("inserted", JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        [HttpPost]
        public ActionResult DeleteImage(int id)
        {
            BK_Image i = AdriaTicketData.BK_Images.FirstOrDefault(x => x.Id == id);
            AdriaTicketData.BK_Images.DeleteOnSubmit(i);
            AdriaTicketData.SubmitChanges();
            return Json("inserted", JsonRequestBehavior.AllowGet);
        }

    }
}