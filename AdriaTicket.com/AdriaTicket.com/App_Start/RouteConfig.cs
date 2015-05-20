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

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}",
                defaults: new { controller = "Public", action = "Index"}
            );

            routes.MapRoute(
                name: "Admin-Prijava",
                url: "{controller}/{action}",
                defaults: new { controller = "Admin", action = "Index"}
            );

            routes.MapRoute(
               name: "Admin-Home",
               url: "{controller}/{action}",
               defaults: new { controller = "Admin", action = "Home" }
           );
            routes.MapRoute(
               name: "Admin-Events-edit",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Admin", action = "Edit"}
           );
            routes.MapRoute(
               name: "Admin-Event-edit",
               url: "{controller}/events/{action}/{id}",
               defaults: new { controller = "Admin", action = "Edit" }
           );

        }
    }
}