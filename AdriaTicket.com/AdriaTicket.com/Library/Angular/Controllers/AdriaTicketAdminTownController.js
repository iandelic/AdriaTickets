
adriaTicketAdmin.controller('AdriaTicketTownsController', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'SiteData', function ($scope, $http, DTOptionsBuilder, DTColumnBuilder, $q, $compile, SiteData) {

    var siteUrl = SiteData.url;
    $scope.dodajGrad = function (id) {
        var temp = 'id=' + id;

        $http({
            method: 'POST',
            url: '/admin/SaveTown',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function () {
            jQuery(location).attr('href', siteUrl + "admin/eventtowns");

        }).error(function () {

        });
    }
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        var deferred = $q.defer();
        $http.get('/data/GetAllTowns')
        .success(function (data) {
            deferred.resolve(data);
        }).error(deferred.reject);
        return deferred.promise;
    }).withPaginationType('full_numbers');
    $scope.dtOptions.fnCreatedRow = function (nRow, aData, iDataIndex) {
        $compile(nRow)($scope);
    }
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('MJE_Id').withTitle('Id'),
        DTColumnBuilder.newColumn('MJE_Naziv').withTitle('Naziv'),
        DTColumnBuilder.newColumn('MJE_ZIP').withTitle('Poštanski broj'),
        DTColumnBuilder.newColumn(null).withTitle('Prikaz').renderWith(function (data) {
            return '<button class="btn btn-default" ng-click="dodajGrad(' + data.MJE_Id + ')">Dodaj</button>' + '<a href = "/admin/editTown/'+ data.MJE_Id +'" class="btn btn-default" >Uredi</a>';
        })
    ];


}]);


adriaTicketAdmin.controller('AdriaTicketTownController', ['$scope', '$http', 'SiteData', '$location', function ($scope, $http, SiteData, $location  ) {

    $scope.id = $location.absUrl().split('/').pop();
    var siteUrl = SiteData.url;
    $scope.disabledFlag = true;
    $scope.addEditText = 'Novi grad';
    $scope.saveUpdate = 'Dodaj';
    $scope.grad = {};
    if (parseInt($scope.id)) {
        $http.get('/admin/getTown/' + $scope.id).success(function (data) {
            $scope.grad = data[0];
            $scope.addEditText = "Uredi grad: " + $scope.grad.MJE_Naziv;
            $scope.saveUpdate = "Spremi";
            $scope.disabledFlag = false;
        }).error(function () { alert('error event') });
    }

    $http.get('/data/getCountries').success(function (data) {
        $scope.drzave = data;
    }).error(function () { alert('greska') });
    
    $scope.$watch("grad", function () {
        if ($scope.grad.MJE_Naziv != null && $scope.grad.MJE_ZIP != null && $scope.grad.MJE_DrzavaId != null)
            $scope.disabledFlag = false;
        else
            $scope.disabledFlag = true;
    }, true)


    $scope.save = function (grad) {
        var temp = 'naziv=' + grad.MJE_Naziv;
        if (grad.MJE_Id != null)
            temp += '&id=' + grad.MJE_Id;
        else
            temp += '&id=0';
        temp += '&ZIP=' + grad.MJE_ZIP;
        temp += '&DrzavaId=' + grad.MJE_DrzavaId;
        $http({
            method: 'POST',
            url: '/admin/InsertUpdateTown',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            jQuery(location).attr('href', siteUrl + "admin/eventTowns");
        }).error(function (msg) {
            alert(msg);
        });
    }
}]);