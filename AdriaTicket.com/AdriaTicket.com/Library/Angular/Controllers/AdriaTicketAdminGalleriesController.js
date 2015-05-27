adriaTicketAdmin.controller('AdminGalleriesController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/data/getgalleries').success(function (data) {
        $scope.galleries = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminGalleryController',[ '$scope', '$location', '$rootElement', '$http', 'taOptions', 'Upload', function ($scope, $location, $rootElement, $http, taOptions, Upload) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    if (parseInt(id)){
        $http.get('/data/getGallery/'+id).success(function (data) {
            $scope.gallery = data[0];
            
        }).error(function () { alert('error event') });
    }


}]);