

adriaTicket.controller('HomeController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
        angular.forEach($scope.events, function (event) {
            event.vrijeme = moment(event.EVE_Datum).format('HH:mm');
            event.EVE_Opis = $("<div/>").html(event.EVE_Opis).text();
            event.EVE_Datum = moment(event.EVE_Datum).format('DD.MM');
        });
    }).error(function () { alert('error') });


}]);

adriaTicket.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    $scope.search = "";
}]);

adriaTicket.controller('ContactController', ['$scope', '$http', function ($scope, $http) {


}]);


adriaTicket.controller('LocationsController', ['$scope', '$http', 'uiGmapGoogleMapApi', function ($scope, $http, uiGmapGoogleMapApi) {

    $http.get('/data/GetWebLocations').success(function (data) {
        $scope.webLocations=data;
    }).error(function () { alert('error') });
    $http.get('/data/GetWebPlaces').success(function (data) {
        $scope.webPlaces = data;

    }).error(function () { alert('error') });
    $scope.control = {};
    $scope.$watch("webLocations", function ()
    {
        uiGmapGoogleMapApi.then(function (maps) {
            var styleArray = [ //any style array defined in the google documentation you linked
              {
                  featureType: "all",
                  stylers: [
                    { saturation: -80 }
                  ]
              }, {
                  featureType: "road.arterial",
                  elementType: "geometry",
                  stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                  ]
              }, {
                  featureType: "poi.business",
                  elementType: "labels",
                  stylers: [
                    { visibility: "off" }
                  ]
              }
            ];
            $scope.options = {
                styles: styleArray
            };
            $scope.map = { center: { latitude: 44.8, longitude: 16.5 }, zoom: 7 };
            $scope.map.control = {};
            $scope.markers = [];


            angular.forEach($scope.webLocations, function (value, key) {
                $scope.marker = {
                    id: key,
                    coords: {
                        latitude: value.BK_Lat,
                        longitude: value.BK_Lng
                    }
                };
                $scope.markers.push($scope.marker);
            });


        });
    });

    $scope.townFilter = "";
    $scope.townClick = function (town) {
        $scope.townFilter = town;
        // po gradu ispisati sve ovo
        $scope.map = { center: { latitude: 45.8, longitude: 16 }, zoom: 12 };
    }
    
    
}]);






