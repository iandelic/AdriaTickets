adriaTicketAdmin.controller('AdminEventController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminEventEditController', ['$scope', '$location', '$rootElement', '$http', function ($scope, $location,$rootElement, $http) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $http.get('/admin/getEvent/'+id).success(function (data) {
        $scope.event = data;
    }).error(function () { alert('error') });

}]);