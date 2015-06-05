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
            var status = (from t in AdriaTicketData.LK_Mjestos select new { t.MJE_Id, t.MJE_Naziv }).Take(100);
            return Json(status, JsonRequestBehavior.AllowGet);
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
            var pm = from p in AdriaTicketData.LK_ProdajnoMjestoWebs select new { 
            
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
       
    }
}
