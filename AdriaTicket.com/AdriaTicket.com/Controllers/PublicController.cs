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
        EventDataClassDataContext eventData = new EventDataClassDataContext();
        public ActionResult Index()
        {
            return View("Home/Index");
        }

        public ActionResult getEvents()
        {
            var events = from e in eventData.LK_Events select e;

            return Json(events, JsonRequestBehavior.AllowGet);
        }
    }
}
