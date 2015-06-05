

adriaTicket.controller('HomeController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
        angular.forEach($scope.events, function (event) {
            event.vrijeme = moment(event.EVE_Datum).format('HH:mm');
            event.EVE_Opis = $("<div/>").html(event.EVE_Opis).text();
            event.EVE_Datum = moment(event.EVE_Datum).format('DD.MM.YYYY');
        });
    }).error(function () { alert('error') });


}]);