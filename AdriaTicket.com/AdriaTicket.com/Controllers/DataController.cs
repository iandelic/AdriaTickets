using AdriaTicket.com.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AdriaTicket.com.Controllers
{
    public class DataController : Controller
    {
        //
        // GET: /Data/

        AdriaTicketDataClassesDataContext AdriaTicketData = new AdriaTicketDataClassesDataContext();

        public ActionResult GetAllTowns()
        {
            var gradovi = from g in AdriaTicketData.BK_TownsForWebs select g.TownId;
            var towns = from t in AdriaTicketData.LK_Mjestos.Where(x => !gradovi.Contains(x.MJE_Id) ) select new { t.MJE_Id, t.MJE_Naziv, t.MJE_ZIP };
            return Json(towns, JsonRequestBehavior.AllowGet);
        }

        public ActionResult getEvents()
        {
            var events = from e in AdriaTicketData.LK_Events where e.EVE_PrikaziNaWebu == true orderby e.EVE_Datum descending select new { e.EVE_Id, e.EVE_Naziv, e.EVE_Datum };

            return Json(events, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSliderEvents()
        {
            var events = from g in AdriaTicketData.BK_MainSliderEvents select g.EventId;
            var ev = from e in AdriaTicketData.LK_Events where events.Contains(e.EVE_Id) select new { e.EVE_Id,e.EVE_Naziv, e.EVE_Datum };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetEventStatuses()
        {
            var status = from stat in AdriaTicketData.LK_StatusEventas select new { stat.SEV_Id, stat.SEV_Naziv };
            return Json(status, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetEventOrganisers()
        {
            var status = from org in AdriaTicketData.LK_Organizators select new { org.ORG_Id, org.ORG_Naziv };
            return Json(status, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetEventLocations()
        {
            var status = from d in AdriaTicketData.LK_Dvoranas select new { d.DVO_Id, d.DVO_Naziv };
            return Json(status, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetEventTowns()
        {

            var gradovi = from g in AdriaTicketData.BK_TownsForWebs select g.TownId;
            var rezultat = from t in AdriaTicketData.LK_Mjestos where gradovi.Contains(t.MJE_Id) select new { t.MJE_Id, t.MJE_Naziv, t.MJE_ZIP };

            return Json(rezultat, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult GetGallery(int id)
        {
            var gal = from gallery in AdriaTicketData.BK_ImageGalleries 
                      from images in AdriaTicketData.BK_Images.Where(g=> g.GalleryId == id).DefaultIfEmpty()
                      where gallery.Id == id select new { gallery.NazivGalerije,
                          Id = images.Id == null ? 0 : images.Id,
                          galleryID = gallery.Id, 
                          images.ImageAlt,
                          images.ImageName };
            return Json(gal, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult GetImages(int id)
        {
            var gal = from images in AdriaTicketData.BK_Images where images.GalleryId == id select new { images.Id, images.ImageAlt, images.ImageName };
            return Json(gal, JsonRequestBehavior.AllowGet);
        }

        [Authorize]
        public ActionResult GetGalleries()
        {
            var gal = from galleries in AdriaTicketData.BK_ImageGalleries select new { galleries.Id, galleries.NazivGalerije };
            return Json(gal, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetWebLocations()
        {
            var pm = from p in AdriaTicketData.LK_ProdajnoMjestoWebs 
            orderby p.PMW_Grad        
            select new { 
            
            p.PMW_Adresa,
            p.PMW_Grad,
            p.PMW_Id,
            p.PMW_Naziv,
            p.PMW_Telefon,
            p.BK_Lat,
            p.BK_Lng
            
            };
            return Json(pm, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetWebPlaces()
        {
            var pm = (from p in AdriaTicketData.LK_ProdajnoMjestoWebs
                     orderby p.PMW_Grad
                     select  new
                     {
                         p.PMW_Grad
                     }).Distinct();
           
            return Json(pm, JsonRequestBehavior.AllowGet);
        }
    }
}
