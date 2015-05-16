


adriaTicket.controller('HomeController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
    }).error(function () { alert('error') });


}]);