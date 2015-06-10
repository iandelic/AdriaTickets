

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

adriaTicket.controller('ContactController', ['$scope', '$http', function ($scope, $http) {


}]);

adriaTicket.controller('LocationsController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/data/GetWebLocations').success(function (data) {
        $scope.webLocations=data;
    }).error(function () { alert('error') });
}]);


adriaTicket.controller('mainController', ['$scope', '$http','Page', function ($scope, $http,Page) {
    $scope.search = "";
    $scope.Page = Page;
    Page.setTitle('Adria Tickets');
}]);

