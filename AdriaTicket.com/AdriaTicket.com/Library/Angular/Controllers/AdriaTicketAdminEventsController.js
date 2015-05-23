﻿adriaTicketAdmin.controller('AdminEventController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/public/getEvents').success(function (data) {
        $scope.events = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminEventEditController', ['$scope', '$location', '$rootElement', '$http', 'taOptions', 'Upload', function ($scope, $location, $rootElement, $http, taOptions, Upload) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.event = {}
    $scope.files = {}
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
   


    $scope.$watch('files', function () {
        console.log($scope.files[0].name);
        //$scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/admin/upload',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
}]);