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

        public ActionResult GetEventStatus()
        {
            var status = from stat in AdriaTicketData.LK_StatusEventas select new { stat.SEV_Id, stat.SEV_Naziv };
            return Json(status, JsonRequestBehavior.AllowGet);
        }

    }
}
