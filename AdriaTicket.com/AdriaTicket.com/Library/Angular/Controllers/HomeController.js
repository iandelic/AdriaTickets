adriaTicket.controller('HomeController', ['$scope','$http', function ($scope,$http) {

    $http.get('home/getEvents').success(function (data) {
        $scope.events = data;
    }).error(function () { alert ('error')});
}]);