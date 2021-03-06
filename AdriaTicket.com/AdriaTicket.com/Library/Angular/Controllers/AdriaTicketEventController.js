﻿
adriaTicket.controller('EventController', ['$scope', '$location', '$rootElement', '$http', '$sce', 'SiteData', function ($scope, $location, $rootElement, $http, $sce, SiteData) {

    var siteUrl = SiteData.url;
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
            var temp = $scope.event.EVE_Datum;
            $scope.event.EVE_Datum = moment(temp).format('DD.MM');
            $scope.event.EVE_Vrijeme = moment(temp).format('HH:mm');
            $scope.event.EVE_DatumOdProdaja = moment($scope.event.EVE_DatumOdProdaja).format('DD.MM.YYYY');
            $scope.event.EVE_DatumOdPretprodaja = moment($scope.event.EVE_DatumOdPretprodaja).format('DD.MM.YYYY');

        }).error(function () { alert('error event') });
    }



}]);



adriaTicket.controller('allEventsPublicController', ['$scope', '$location', '$rootElement', '$http', '$sce', 'SiteData', function ($scope, $location, $rootElement, $http, $sce, SiteData) {

    var siteUrl = SiteData.url;
    $http.get('/public/getAllEvents').success(function (data) {
        $scope.events = data;
        angular.forEach($scope.events, function (event) {
            event.vrijeme = moment(event.EVE_Datum).format('HH:mm');
            event.EVE_Opis = $("<div/>").html(event.EVE_Opis).text();
            event.EVE_Datum = moment(event.EVE_Datum).format('DD.MM.');
        });
    }).error(function () { alert('error') });

    $scope.search = $scope.$parent.search;



}]);