
adriaTicket.controller('EventController', ['$scope', '$location', '$rootElement', '$http','$sce', function ($scope, $location, $rootElement, $http,$sce) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.event = {}

    if (parseInt(id)) {
        $http.get('/public/getEvent/' + id).success(function (data) {
            $scope.event = data[0];
            $scope.addEditEvent = "Uredi događaj: " + $scope.event.EVE_Naziv;
            $scope.saveUpdate = "Spremi";
            $scope.renderHtml = function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            };
            $scope.event.EVE_Datum = moment($scope.event.EVE_Datum).format('DD.MM.YYYY');
            $scope.event.EVE_DatumOdProdaja = moment($scope.event.EVE_DatumOdProdaja).format('DD.MM.YYYY');
            $scope.event.EVE_DatumOdPretprodaja = moment($scope.event.EVE_DatumOdPretprodaja).format('DD.MM.YYYY');

        }).error(function () { alert('error event') });
    }




}]);