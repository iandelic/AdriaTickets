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
        AdriaTicketDataClassesDataContext eventData = new AdriaTicketDataClassesDataContext();
        public ActionResult Index()
        {
            return View("Home/Index");
        }

        public ActionResult getEvents()
        {
            var events = from e in eventData.LK_Events  where e.EVE_PrikaziNaWebu == true orderby e.EVE_Datum descending select new { e.EVE_Id,e.EVE_Opis,e.EVE_Naziv};

            return Json(events, JsonRequestBehavior.AllowGet);
        }
    }
}
