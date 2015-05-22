adriaTicketAdmin.controller('AdminEventController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminEventEditController', ['$scope', '$location', '$rootElement', '$http', function ($scope, $location,$rootElement, $http) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.event = {}
    if (parseInt(id)){
        $http.get('/admin/getEvent/'+id).success(function (data) {
        $scope.event = data[0];
        $scope.event.EVE_Datum = moment($scope.event.EVE_Datum).format('DD.MM.YYYY hh:mm:ss');
        $scope.disabledFlag = false;
    }).error(function () { alert('error') });

}
    $scope.setTime = function (newVal,oldVal) {
        $scope.event.EVE_Datum = moment(newVal).format('DD.MM.YYYY hh:mm:ss')
    }

    $scope.configFunction = function configFunction() {
        return { startView: 'month' };
    };
   
}]);