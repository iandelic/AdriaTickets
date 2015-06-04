using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdriaTicket.com.Models;

namespace AdriaTicket.com.Controllers
{
    public class PublicController : Controller
    {
        //
        // GET: /Home/
        AdriaTicketDataClassesDataContext AdriaTicketData = new AdriaTicketDataClassesDataContext();
        public ActionResult Index()
        {
            return View("Home/Index");
        }

        public ActionResult getEvents()
        {
            var events = from e in AdriaTicketData.LK_Events where e.EVE_PrikaziNaWebu == true orderby e.EVE_Datum descending select new { e.EVE_Id, e.EVE_Opis, e.EVE_Naziv, e.EVE_Datum };

            return Json(events, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Event()
        {
            return View("Home/Event");
        }

        public ActionResult getEvent(int id)
        {
            var ev = from Event in AdriaTicketData.LK_Events
                     join statusEventa in AdriaTicketData.LK_StatusEventas on Event.EVE_StatusEventaId equals statusEventa.SEV_Id
                     join organizator in AdriaTicketData.LK_Organizators on Event.EVE_OrganizatorId equals organizator.ORG_Id
                     join video in AdriaTicketData.BK_VideoGalleries on Event.EVE_Id equals video.eventID
                     join dvorana in AdriaTicketData.LK_Dvoranas on Event.EVE_DvoranaId equals dvorana.DVO_Id
                     join mjesto in AdriaTicketData.LK_Mjestos on Event.EVE_MjestoId equals mjesto.MJE_Id
                     join drzava in AdriaTicketData.LK_Drzavas on mjesto.MJE_DrzavaId equals drzava.DRZ_Id
                     join gallery in AdriaTicketData.BK_REL_Event_ImageGalleries on Event.EVE_Id equals gallery.EventId
                     where Event.EVE_Id == id
                     select new
                     {
                         Event.EVE_Naziv,
                         Event.EVE_Id,
                         Event.EVE_Opis,
                         Event.EVE_ImagePath,
                         Event.EVE_ImageSmallPath,
                         Event.EVE_Datum,
                         Event.EVE_DatumOdProdaja,
                         Event.EVE_DatumOdPretprodaja,
                         Event.EVE_PostotakProvizije,
                         dvorana.DVO_Naziv,
                         mjesto.MJE_Naziv,
                         mjesto.MJE_ZIP,
                         drzava.DRZ_Naziv,
                         organizator.ORG_Naziv,
                         statusEventa.SEV_Stanje,
                         video.videoLink,
                         gallery.ImageGalleriesId
                     };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }
    }

}
