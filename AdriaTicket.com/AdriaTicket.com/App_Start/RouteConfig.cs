using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AdriaTicket.com
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.LowercaseUrls = true;


            routes.MapRoute(
               name: "Admin-Event-edit",
               url: "{controller}/events/{action}/{id}",
               defaults: new { controller = "Admin", action = "Edit" }
           );
            routes.MapRoute(
               name: "Admin-gallery-edit",
               url: "{controller}/galleries/{action}/{id}",
               defaults: new { controller = "Admin", action = "Edit" }
           );
            routes.MapRoute(
                name: "Admin",
                url: "Admin/{action}",
                defaults: new { controller = "Admin", action = "Index" }
            );
            routes.MapRoute(
                name: "Data",
                url: "Data/{action}",
                defaults: new { controller = "Data", action = "GetGalleries" }
            );
            routes.MapRoute(
               name: "Public",
               url: "{action}",
               defaults: new { controller = "Public", action = "Index" }
            );
            routes.MapRoute(
               name: "Event",
               url: "Event/{id}",
               defaults: new { controller = "Public", action = "Event" }
            );
            routes.MapRoute(
                name: "Default",
                url: "{Controller}/{action}",
                defaults: new { controller = "Public", action = "Index" }
            );

            routes.MapRoute(
               name: "default-with-id",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Admin", action = "Events" }
           );



        }
    }
}