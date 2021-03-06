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
        public ActionResult AddTown()
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
        public ActionResult Locations()
        {
            return View();
        }
        [Authorize]
        public ActionResult Event()
        {
            
            return View();
        }

        [Authorize]
        public ActionResult List()
        {

            return View("OrganizatoriLista");
        }

        [Authorize]
        public ActionResult Objave()
        {

            return View();
        }

        [Authorize]
        public ActionResult urediOrganizatora()
        {

            return View();
        }

        [Authorize]
        public ActionResult dodaj()
        {

            return View("urediOrganizatora");
        }

        [Authorize]
        public ActionResult editTown()
        {

            return View("addTown");
        }


        [Authorize]
        public ActionResult getOrganizator(int id)
        {

            var org = from o in AdriaTicketData.LK_Organizators where o.ORG_Id == id
                           select new
                           {
                               o.ORG_Id,
                               o.ORG_Naziv,
                               o.ORG_OIB,
                               o.ORG_Adresa,
                               o.ORG_FlagPDV
                           };

            return Json(org, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult getAnnouncements()
        {

            var ann = from a in AdriaTicketData.BK_Announcements
                      select new
                      {
                          a.Id,
                          a.Announcement,
                          a.ShowOnPage
                      };

            return Json(ann, JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        [HttpPost]
        public ActionResult SaveAnnounecement(int Id, string text, bool showOnPage)
        {
            if (Id > 0)
            {
                BK_Announcement a = AdriaTicketData.BK_Announcements.FirstOrDefault(x => x.Id == Id);
                a.Announcement = text;
                a.ShowOnPage = showOnPage;
            }
            else
            {
                BK_Announcement a = new BK_Announcement();
                a.Announcement = text;
                a.ShowOnPage = showOnPage;
                AdriaTicketData.BK_Announcements.InsertOnSubmit(a);
            }


            AdriaTicketData.SubmitChanges();

            return Json("completed", JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        [HttpPost]
        public ActionResult DeleteAnnounecement(int Id)
        {

            BK_Announcement a = AdriaTicketData.BK_Announcements.FirstOrDefault(x => x.Id == Id);
            AdriaTicketData.BK_Announcements.DeleteOnSubmit(a);
            AdriaTicketData.SubmitChanges();

            return Json("completed", JsonRequestBehavior.AllowGet);
        }
        [Authorize]
        public ActionResult NewGallery()
        {

            return View();
        }

        [Authorize]
        public ActionResult Location()
        {

            return View();
        }

        [Authorize]
        public ActionResult SliderEvents()
        {

            return View();
        }

        [Authorize]
        public ActionResult getLocation(int id)
        {
            var location = from s in AdriaTicketData.LK_ProdajnoMjestoWebs
                          where s.PMW_Id == id
                          select new
                          {
                              s.PMW_Id,
                              s.PMW_Grad,
                              s.PMW_Adresa,
                              s.PMW_Naziv,
                              s.PMW_Telefon,
                              s.BK_Lat,
                              s.BK_Lng
                          };

            return Json(location, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult getTown(int id)
        {
            var grad = from g in AdriaTicketData.LK_Mjestos
                           where g.MJE_Id == id
                           select new
                           {
                               g.MJE_Id,g.MJE_Naziv,g.MJE_ZIP,g.MJE_DrzavaId
                           };

            return Json(grad, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult getOrganiatori()
        {
            var org = from o in AdriaTicketData.LK_Organizators
                           select new
                           {
                               o.ORG_Id,
                               o.ORG_Naziv,
                               o.ORG_OIB,
                               o.ORG_Adresa,
                               o.ORG_FlagPDV
                           };

            return Json(org, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        [HttpPost]
        public ActionResult saveLocation(int Id,string Adresa, string Mjesto, string Telefon, string Naziv, string Lng, string Lat)
        {
            if (Id > 0)
            {
                LK_ProdajnoMjestoWeb pm = AdriaTicketData.LK_ProdajnoMjestoWebs.FirstOrDefault(x => x.PMW_Id == Id);
                pm.PMW_Adresa = Adresa;
                pm.PMW_Naziv = Naziv;
                pm.PMW_Grad = Mjesto;
                pm.PMW_Telefon = Telefon;
                pm.BK_Lat = Lat;
                pm.BK_Lng = Lng;
            }
            else
            {
                LK_ProdajnoMjestoWeb pm = new LK_ProdajnoMjestoWeb();
                pm.PMW_Adresa = Adresa;
                pm.PMW_Naziv = Naziv;
                pm.PMW_Grad = Mjesto;
                pm.PMW_Telefon = Telefon;
                pm.BK_Lng = Lng;
                pm.BK_Lat = Lat;
                AdriaTicketData.LK_ProdajnoMjestoWebs.InsertOnSubmit(pm);
            }


            AdriaTicketData.SubmitChanges();
            
            return Json("completed", JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        [HttpPost]
        public ActionResult SpremiOrganizatora(int Id, string Adresa, string Naziv, string OIB, bool pdv)
        {
            if (Id > 0)
            {
                LK_Organizator org = AdriaTicketData.LK_Organizators.FirstOrDefault(x => x.ORG_Id == Id);
                org.ORG_Naziv = Naziv;
                org.ORG_FlagPDV = pdv;
                org.ORG_Adresa = Adresa;
                org.ORG_OIB = OIB;
            }
            else
            {
                LK_Organizator org = new LK_Organizator();
                org.ORG_Naziv = Naziv;
                org.ORG_FlagPDV = pdv;
                org.ORG_Adresa = Adresa;
                org.ORG_OIB = OIB;
                org.ORG_Stanje = 'A';
                org.ORG_Timestamp = DateTime.Now;
                AdriaTicketData.LK_Organizators.InsertOnSubmit(org);
            }


            AdriaTicketData.SubmitChanges();

            return Json("completed", JsonRequestBehavior.AllowGet);
        }


        [Authorize]
        [HttpPost]
        public ActionResult InsertUpdateTown(int Id, string Naziv, string ZIP,int DrzavaId)
        {
            if (Id > 0)
            {
                LK_Mjesto grad = AdriaTicketData.LK_Mjestos.FirstOrDefault(x => x.MJE_Id == Id);
                grad.MJE_Naziv = Naziv;
                grad.MJE_DrzavaId = DrzavaId;
                grad.MJE_ZIP = ZIP;
            }
            else
            {
                LK_Mjesto grad =  new LK_Mjesto();
                grad.MJE_Naziv = Naziv;
                grad.MJE_DrzavaId = DrzavaId;
                grad.MJE_ZIP = ZIP;
                grad.MJE_Timestamp = DateTime.Now;
                grad.MJE_Stanje = 'A';
                AdriaTicketData.LK_Mjestos.InsertOnSubmit(grad);
            }


            AdriaTicketData.SubmitChanges();

            return Json("completed", JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEvent(int id)
        {
            var ev = from EVE in AdriaTicketData.LK_Events
                     from statusEventa in AdriaTicketData.LK_StatusEventas.Where(x => x.SEV_Id == EVE.EVE_StatusEventaId).DefaultIfEmpty()
                     from organizator in AdriaTicketData.LK_Organizators.Where(o => o.ORG_Id == EVE.EVE_OrganizatorId).DefaultIfEmpty()
                     from video in AdriaTicketData.BK_VideoGalleries.Where(v=> v.eventID == EVE.EVE_Id).DefaultIfEmpty() 
                     from gallery in AdriaTicketData.BK_REL_Event_ImageGalleries.Where(g=> g.EventId == EVE.EVE_Id).DefaultIfEmpty()
                     where EVE.EVE_Id == id
                     select new
                     {
                         EVE.EVE_Naziv,
                         EVE.EVE_Id,
                         EVE.EVE_Opis,
                         EVE.EVE_ImagePath,
                         EVE.EVE_ImageSmallPath,
                         EVE.EVE_Datum,
                         EVE.EVE_DatumOdProdaja,
                         EVE.EVE_DatumOdPretprodaja,
                         EVE.EVE_PostotakProvizije,
                         EVE.EVE_DvoranaId,
                         organizator.ORG_Naziv,
                         organizator.ORG_Id,
                         SEV_Stanje = statusEventa.SEV_Stanje== null ? '0' : statusEventa.SEV_Stanje,
                         EVE_StatusEventaId = EVE.EVE_StatusEventaId == null ? 0 : EVE.EVE_StatusEventaId,
                         EVE.EVE_PrikaziNaWebu,
                         MjestoId = EVE.EVE_MjestoId == null ? 0 : EVE.EVE_MjestoId,
                         videoLink = video.videoLink == null ? "" : video.videoLink,
                         ImageGalleriesID = gallery.ImageGalleriesId == null ? 0 : gallery.ImageGalleriesId
                     };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEvents()
        {
            var events = from e in AdriaTicketData.LK_Events where e.EVE_Datum > DateTime.Now.AddMonths(-2) orderby e.EVE_Datum descending select new { e.EVE_Id, e.EVE_Datum, e.EVE_Opis, e.EVE_Naziv };

            return Json(events, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEventSectors(int id)
        {
            var sectors = from s in AdriaTicketData.LK_Sektors
                          from d in AdriaTicketData.LK_Dvoranas.Where(x=> x.DVO_Id == id)
                          where s.SEK_DvoranaId == id
                          select new
                          {
                              s.SEK_Id,
                              s.SEK_Kapacitet,
                              s.SEK_Naziv,
                              d.DVO_Naziv
                          };

            return Json(sectors, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEventPrices(int id)
        {
            var sectors = from s in AdriaTicketData.LK_Cijenas
                          from c in AdriaTicketData.LK_Sektors.Where(x=> x.SEK_Id == s.CIJ_SektorId)
                          where s.CIJ_EventId == id
                          select new
                          {
                              s.CIJ_EventId,
                              s.CIJ_Id,
                              s.CIJ_IznosNaDan,
                              s.CIJ_IznosPopusta,
                              s.CIJ_IznosPretprodaja,
                              s.CIJ_IznosProdaja,
                              s.CIJ_SektorId,
                              c.SEK_Naziv,
                              c.SEK_Kapacitet
                          };

            return Json(sectors, JsonRequestBehavior.AllowGet);
        }

        public ActionResult editPrices(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult SaveEvent(string naziv, string opis, string datum, string datumOdpretprodaja, string datumOdProdaja, int organizator, decimal postotakprovizije, int mjesto, int dvorana, int status, Boolean prikaznaWebu, int id, string image, string videoLink, int? galleryId)
        {
            LK_Event ev = AdriaTicketData.LK_Events.FirstOrDefault(x => x.EVE_Id == id);
            if (ev == null)
                ev = new LK_Event();
            if(datum != "undefined")
            ev.EVE_Datum = DateTime.ParseExact(datum, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            if (datumOdpretprodaja != "undefined")
            ev.EVE_DatumOdPretprodaja = DateTime.ParseExact(datumOdpretprodaja, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            if (datumOdProdaja != "undefined")
            ev.EVE_DatumOdProdaja = DateTime.ParseExact(datumOdProdaja, "dd.MM.yyyy HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
            ev.EVE_DvoranaId = dvorana;
            ev.EVE_FlagOnlineProdaja = true;
            ev.EVE_MjestoId = mjesto;
            ev.EVE_Naziv = naziv;
            ev.EVE_Opis =HttpUtility.HtmlDecode(opis);
            ev.EVE_ImageExist = true;
            ev.EVE_ImagePath = image;
            ev.EVE_ReklamaExist = false;
            ev.EVE_Stanje = 'A';
            ev.EVE_Timestamp = DateTime.Now;
            ev.EVE_OrganizatorId = organizator;
            ev.EVE_PostotakProvizije = postotakprovizije;
            ev.EVE_PrikaziNaWebu = prikaznaWebu;
            ev.EVE_StatusEventaId = status;
            string msg = "";
            if (id == 0)
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
            else if(id == 0 && videoLink != null)
            {
                LK_Event temp = AdriaTicketData.LK_Events.FirstOrDefault(x=> x.EVE_Naziv == naziv);
                BK_VideoGallery video = new BK_VideoGallery();
                video.eventID = temp.EVE_Id;
                video.videoLink = videoLink;
                AdriaTicketData.BK_VideoGalleries.InsertOnSubmit(video);

            }
            if (id > 0 && galleryId != null)
            {
                var galery = AdriaTicketData.BK_REL_Event_ImageGalleries.FirstOrDefault(x => x.EventId == id);
                if(galery != null)
                {
                    galery.EventId = id;
                    galery.ImageGalleriesId = Convert.ToInt16(galleryId);
                }else
                {
                    galery = new BK_REL_Event_ImageGallery();
                    galery.EventId = id;
                    galery.ImageGalleriesId = Convert.ToInt16(galleryId);
                    AdriaTicketData.BK_REL_Event_ImageGalleries.InsertOnSubmit(galery);
                }
            }
            else if (galleryId != null)
            {
                LK_Event temp = AdriaTicketData.LK_Events.FirstOrDefault(x => x.EVE_Naziv == naziv);
                BK_REL_Event_ImageGallery galery = new BK_REL_Event_ImageGallery();
                galery.EventId = temp.EVE_Id;
                galery.ImageGalleriesId = Convert.ToInt16(galleryId);
                AdriaTicketData.BK_REL_Event_ImageGalleries.InsertOnSubmit(galery);
            }
            AdriaTicketData.SubmitChanges();
           return Json(msg, JsonRequestBehavior.AllowGet);
        }
                
        [HttpPost]
        public ContentResult Upload(HttpPostedFileBase file, string name, string type)
        {
            var filename = Path.GetFileName(file.FileName);
            Directory.CreateDirectory(Server.MapPath("~/Uploads/"+type));
            Directory.CreateDirectory(Server.MapPath("~/Uploads/"+type+"/"+name+"/"));
            var path = Path.Combine(Server.MapPath("~/Uploads/"+type+"/"+name+"/"), filename);
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
        public ActionResult SavePrices(string action, int Eventid, int sektorid, decimal? iznosnadan, decimal iznospretprodaja, decimal? iznosprodaja, decimal? iznospopusta)
        {
            if (action == "update")
            {
                LK_Cijena cijena = AdriaTicketData.LK_Cijenas.FirstOrDefault(x => x.CIJ_SektorId == sektorid && x.CIJ_EventId == Eventid);
                cijena.CIJ_IznosNaDan = iznosnadan;
                cijena.CIJ_IznosPopusta = iznospopusta;
                cijena.CIJ_IznosPretprodaja = iznospretprodaja;
                cijena.CIJ_IznosProdaja = iznosprodaja;
            }
            else if (action == "insert")
            {
                LK_Cijena cijena = new LK_Cijena();
                cijena.CIJ_EventId = Eventid;
                cijena.CIJ_SektorId = sektorid;
                cijena.CIJ_IznosNaDan = iznosnadan;
                cijena.CIJ_IznosPopusta = iznospopusta;
                cijena.CIJ_IznosPretprodaja = iznospretprodaja;
                cijena.CIJ_IznosProdaja = iznosprodaja;
                AdriaTicketData.LK_Cijenas.InsertOnSubmit(cijena);
            }

            AdriaTicketData.SubmitChanges();
            return Json("inserted", JsonRequestBehavior.AllowGet);
        }


        [Authorize]
        [HttpPost]
        public ActionResult SaveGallery(string gallery)
        {
            BK_ImageGallery g = new BK_ImageGallery();
            g.NazivGalerije = gallery;
            AdriaTicketData.BK_ImageGalleries.InsertOnSubmit(g);
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
            return Json("deleted", JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult EventTowns()
        {
            return View("TownsForWeb");
        }

        [Authorize]
        [HttpPost]
        public ActionResult SaveTown(int id)
        {
            BK_TownsForWeb town = new BK_TownsForWeb();
            town.TownId = id;
            AdriaTicketData.BK_TownsForWebs.InsertOnSubmit(town);
            AdriaTicketData.SubmitChanges();
            return Json("town inserted", JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        [HttpPost]
        public ActionResult SaveSliderEvents(string id)
        {
            AdriaTicketData.ExecuteCommand("DELETE FROM BK_MainSliderEvents");
            string[] array = id.Split(new string[] { "$%$" }, StringSplitOptions.RemoveEmptyEntries);
            int counter =1;
            foreach (string item in array)
            {
                BK_MainSliderEvent i = new BK_MainSliderEvent();
                i.EventId = Convert.ToInt16(item);
                i.Id = counter;
                counter++;
                AdriaTicketData.BK_MainSliderEvents.InsertOnSubmit(i);
            }

            AdriaTicketData.SubmitChanges();
            return Json("inserted", JsonRequestBehavior.AllowGet);
        }

    }
}