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

    if (parseInt(id)) {
        $http.get('/admin/getLocation/' + id).success(function (data) {
            $scope.location = data[0];
            
        }).error(function () { alert('error event') });
    }

    $scope.save = function (Location)
    {
        var temp = 'Mjesto=' + Location.PMW_Grad;
        temp += '&Naziv=' + Location.PMW_Naziv;
        temp += '&Adresa=' + Location.PMW_Adresa;
        temp += '&Telefon=' + Location.PMW_Telefon;
        if (Location.PMW_Id != null)
            temp += '&Id=' + Location.PMW_Id;
        else
            temp += '&Id=0';
        console.log(temp)
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