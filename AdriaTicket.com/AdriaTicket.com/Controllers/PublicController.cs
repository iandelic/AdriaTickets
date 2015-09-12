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
            var events = from g in AdriaTicketData.BK_MainSliderEvents select g.EventId;
            var ev = from e in AdriaTicketData.LK_Events where events.Contains(e.EVE_Id) select new { e.EVE_Id, e.EVE_ImagePath };
            List<Tuple<int, string>> Listimage = new List<Tuple<int, string>>();
            foreach (var t in ev)
            {
               Listimage.Add(new Tuple<int,string>(t.EVE_Id,t.EVE_ImagePath));
            }
            ViewBag.images = Listimage;
            return View("Home/Index");
        }
        public ActionResult GetSliderEvents()
        {
            var events = from g in AdriaTicketData.BK_MainSliderEvents select g.EventId;
            var ev = from e in AdriaTicketData.LK_Events where events.Contains(e.EVE_Id) select new { e.EVE_Id, e.EVE_ImagePath };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }
        public ActionResult getEvents()
        {
            var events = from e in AdriaTicketData.LK_Events where (e.EVE_PrikaziNaWebu == true && e.EVE_Datum > DateTime.Now)  
                         from dvorana in AdriaTicketData.LK_Dvoranas.Where(d => d.DVO_Id == e.EVE_DvoranaId).DefaultIfEmpty() 
                         orderby e.EVE_Datum descending select new { e.EVE_Id, e.EVE_Opis, e.EVE_Naziv, e.EVE_Datum, e.EVE_ImagePath, dvorana.DVO_Naziv };

            return Json(events, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Event()
        {
            return View("Home/Event");
        }

        public ActionResult Events()
        {
            return View("Home/Events");
        }

        public ActionResult Contact()
        {
            return View("Home/Contact");
        }
        public ActionResult Locations()
        {
            return View("Home/Locations");
        }

        public ActionResult TermsOfUse()
        {
            return View("Home/TOU");
        }
        public ActionResult PersonalData()
        {
            return View("Home/personalData");
        }
        public ActionResult AboutShop()
        {
            return View("Home/Places");
        }
        public ActionResult getEvent(int id)
        {
            var ev = from Event in AdriaTicketData.LK_Events
                     from statusEventa in AdriaTicketData.LK_StatusEventas.Where(s=> Event.EVE_StatusEventaId == s.SEV_Id).DefaultIfEmpty()
                     from organizator in AdriaTicketData.LK_Organizators.Where(o => o.ORG_Id == Event.EVE_OrganizatorId).DefaultIfEmpty() 
                     from video in AdriaTicketData.BK_VideoGalleries.Where(v=> v.eventID == Event.EVE_Id).DefaultIfEmpty()
                     from dvorana in AdriaTicketData.LK_Dvoranas.Where(d => d.DVO_Id== Event.EVE_DvoranaId).DefaultIfEmpty()
                     from mjesto in AdriaTicketData.LK_Mjestos.Where(m=>m.MJE_Id==Event.EVE_MjestoId).DefaultIfEmpty()
                     from drzava in AdriaTicketData.LK_Drzavas.Where(dr => dr.DRZ_Id == mjesto.MJE_DrzavaId).DefaultIfEmpty()
                     from gallery in AdriaTicketData.BK_REL_Event_ImageGalleries.Where(g => g.EventId == Event.EVE_Id).DefaultIfEmpty()
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
                         SEV_Stanje = statusEventa.SEV_Stanje == null ? '0' : statusEventa.SEV_Stanje,
                         SEV_Id = statusEventa.SEV_Id == null ? 0 : statusEventa.SEV_Id,
                         videoLink = video.videoLink == null ? "" : video.videoLink,
                         ImageGalleriesID = gallery.ImageGalleriesId == null ? 0 : gallery.ImageGalleriesId
                     };
            return Json(ev, JsonRequestBehavior.AllowGet);
        }
    }

}
