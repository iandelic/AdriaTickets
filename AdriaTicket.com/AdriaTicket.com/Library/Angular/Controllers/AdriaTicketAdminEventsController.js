adriaTicketAdmin.controller('AdminEventController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminEventEditController', ['$scope', '$location', '$rootElement', '$http', 'taOptions', function ($scope, $location, $rootElement, $http, taOptions) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.event = {}
    taOptions.toolbar = [
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
      ['html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
    ];

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