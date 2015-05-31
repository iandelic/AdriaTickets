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
            var gal = from gallery in AdriaTicketData.BK_ImageGalleries join images in AdriaTicketData.BK_Images on gallery.Id equals images.GalleryId where gallery.Id == id select new { gallery.NazivGalerije, images.Id, images.GalleryId, images.ImageAlt, images.ImageName };
            return Json(gal, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetGalleries()
        {
            var gal = from galleries in AdriaTicketData.BK_ImageGalleries select new { galleries.Id, galleries.NazivGalerije };
            return Json(gal, JsonRequestBehavior.AllowGet);
        }

    }
}
