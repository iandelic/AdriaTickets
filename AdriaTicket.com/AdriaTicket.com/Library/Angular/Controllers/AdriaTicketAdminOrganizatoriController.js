adriaTicketAdmin.controller('OrganizatoriController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/admin/getOrganiatori').success(function (data) {
        $scope.listaOrganizatora = data;
        
    }).error(function () { alert('error') });

}]);

adriaTicketAdmin.controller('AdminOrganizatorEditController', ['$scope', '$location', '$http', 'SiteData', function ($scope, $location, $http, SiteData) {
    var id = $location.absUrl().split('/').pop();
    var siteUrl = SiteData.url;
    $scope.organizator = {ORG_FlagPDV:false}
    if (parseInt(id)) {
        $http.get('/admin/getOrganizator/' + id).success(function (data) {
            $scope.organizator = data[0];
            $scope.organizator.ORG_OIB = parseInt($scope.organizator.ORG_OIB)
        }).error(function () { alert('error') });
    }

    $scope.$watch("organizator", function () {
        if ($scope.organizator.ORG_Naziv != null && $scope.organizator.ORG_Adresa != null
            && $scope.organizator.ORG_OIB != null && $scope.organizator.ORG_FlagPDV != null
            && $scope.organizator.ORG_OIB.toString().length == 11)
        { $scope.disabledFlag = false}
        else
        { $scope.disabledFlag = true }
    }, true)


    $scope.save = function (organizator) {
        var temp = 'naziv=' + organizator.ORG_Naziv;
        if (organizator.ORG_Id != null)
            temp += '&id=' + organizator.ORG_Id;
        else
            temp += '&id=0';
        temp += '&Adresa=' + organizator.ORG_Adresa;
        temp += '&OIB=' + organizator.ORG_OIB;
        temp += '&PDV=' + organizator.ORG_FlagPDV;
        $http({
            method: 'POST',
            url: '/admin/SpremiOrganizatora',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            jQuery(location).attr('href', siteUrl + "admin/organizatori/list");
        }).error(function (msg) {
            alert(msg);
        });
    }
}]);