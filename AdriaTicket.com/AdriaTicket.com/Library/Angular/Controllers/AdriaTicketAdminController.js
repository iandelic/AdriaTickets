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