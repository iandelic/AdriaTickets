


adriaTicket.controller('HomeController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
        angular.forEach($scope.events, function (event) {
            event.EVE_Opis = $("<div/>").html(event.EVE_Opis).text();
        });
    }).error(function () { alert('error') });


}]);