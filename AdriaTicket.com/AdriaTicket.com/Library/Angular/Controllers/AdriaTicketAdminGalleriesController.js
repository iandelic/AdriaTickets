adriaTicketAdmin.controller('AdminGalleriesController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/data/getgalleries').success(function (data) {
        $scope.galleries = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminGalleryController',[ '$scope', '$location', '$rootElement', '$http', 'Upload', function ($scope, $location, $rootElement, $http,Upload) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    if (parseInt(id)){
        $http.get('/data/getGallery/'+id).success(function (data) {
            $scope.gallery = data;
            
        }).error(function () { alert('error event') });
    }

    $scope.uploadFlag = true;
    $scope.$watch('files', function () {
        if ($scope.files != null) {
            console.log($scope.files)
            $scope.uploadFlag = false;
        }
        else
        {
            $scope.uploadFlag = true;
        }
    });
    $scope.beginUpload = function () {
        $scope.upload($scope.files);
    }
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.images.push(file.name);
                Upload.upload({
                    url: '/admin/upload',
                    file: file
                }).progress(function (evt) {
                }).success(function (data, status, headers, config) {
                    console.log($scope.images);
                    var temp = '';
                    $http({
                        method: 'POST',
                        url: '/data/SaveImage',
                        data: temp,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (data) {
                        jQuery(location).attr('href', siteUrl + "admin/galleries");
                    }).error(function (msg) {
                        alert(msg);
                    });
                });
            }
        }
    };

}]);