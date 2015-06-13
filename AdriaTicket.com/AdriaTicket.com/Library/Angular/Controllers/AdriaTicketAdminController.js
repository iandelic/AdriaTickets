adriaTicketAdmin.controller('LoginController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

    var siteUrl = "http://localhost:32718/";

    $scope.user = {};
    $scope.user.username = "";
    $scope.user.password = "";
    $scope.user.remember_me = false;
    $scope.error = {};
    $scope.error.show = "";


    
    $scope.submit = function (user) {
        $scope.callAtTimeout = function () { $scope.error.show = "";};
        

        var temp = 'u=' + user.username + '&p=' + user.password + '&r=' + user.remember_me;

        $http({
            method: 'POST',
            url: '/admin/login',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            if (data == "true") {
                jQuery(location).attr('href', siteUrl + "admin/home");
            }
            else {
                $scope.error.show = "admin-error-active";
                $timeout(function () { $scope.callAtTimeout(); }, 3000);
            }
        }).error(function () {
            $scope.error.show = "admin-error-active";
            $timeout(function () { $scope.callAtTimeout(); }, 3000);
        });
    };
      

}]);


adriaTicketAdmin.controller('AdminHomeController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";

}]);

adriaTicketAdmin.controller('AdminLocationsController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/data/GetWebLocations').success(function (data) {
        $scope.locations = data;
        }).error(function () { alert('error') });
}]);


adriaTicketAdmin.controller('AdminLocationController', ['$scope', '$http','$location', function ($scope, $http, $location) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.location = {}
    $scope.location.PMW_Telefon = "";
    $scope.location.PMW_Grad = "";
    $scope.location.PMW_Adresa = "";
    $scope.location.PMW_Naziv = "";
    $scope.location.BK_Lat = "43.507632";
    $scope.location.BK_Lng = "16.438379";


    if (parseInt(id)) {
        $http.get('/admin/getLocation/' + id).success(function (data) {
            $scope.location = data[0];
            map = new GMaps({
                div: '#map',
                lat: $scope.location.BK_Lat,
                lng: $scope.location.BK_Lng

            });

            map.addMarker({
                lat: $scope.location.BK_Lat,
                lng: $scope.location.BK_Lng
            });
        }).error(function () { alert('error event') });
    }
    else {
        map = new GMaps({
            div: '#map',
            lat: $scope.location.BK_Lat,
            lng: $scope.location.BK_Lng

        });

        map.addMarker({
            lat: $scope.location.BK_Lat,
            lng: $scope.location.BK_Lng
        });
    }

    $scope.save = function (Location)
    {
        var temp = 'Mjesto=' + Location.PMW_Grad;
        temp += '&Naziv=' + Location.PMW_Naziv;
        temp += '&Adresa=' + Location.PMW_Adresa;
        temp += '&Telefon=' + Location.PMW_Telefon;
        temp += '&Lng=' + Location.BK_Lng;
        temp += '&Lat=' + Location.BK_Lat;
        if (Location.PMW_Id != null)
            temp += '&Id=' + Location.PMW_Id;
        else
            temp += '&Id=0';
        $http({
            method: 'POST',
            url: '/admin/saveLocation',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function () {
                jQuery(location).attr('href', siteUrl + "admin/locations");
           
        }).error(function () {
           
        });
    }
}]);


adriaTicketAdmin.controller('AdriaTicketTownsController', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder, $q, $compile) {

    var siteUrl = "http://localhost:32718/";
    $scope.dodajGrad = function (id) {
        var temp = 'id=' + id;
        
        $http({
            method: 'POST',
            url: '/admin/SaveTown',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function () {
            jQuery(location).attr('href', siteUrl + "admin/eventtowns");

        }).error(function () {

        });
    }
        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            var deferred = $q.defer();
            $http.get('/data/GetAllTowns')
            .success(function (data) {
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        }).withPaginationType('full_numbers');
        $scope.dtOptions.fnCreatedRow = function (nRow, aData, iDataIndex) {
            $compile(nRow)($scope);
        }
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('MJE_Id').withTitle('Id'),
            DTColumnBuilder.newColumn('MJE_Naziv').withTitle('Naziv'),
            DTColumnBuilder.newColumn('MJE_ZIP').withTitle('Poštanski broj'),
            DTColumnBuilder.newColumn(null).withTitle('Prikaz').renderWith(function (data) {
                //data.MJE_Id
                return '<button class="btn btn-default" ng-click="dodajGrad('+ data.MJE_Id +')">Dodaj</button>';
            })
        ];

        
}]);