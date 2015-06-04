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
            $scope.id = $scope.gallery[0].GalleryId;
            
        }).error(function () { alert('error event') });
    }
    $scope.images = [];
    $scope.deleteImage = function (image) {
        var temp = '&Id=' + image.Id;
        $http({
            method: 'POST',
            url: '/admin/DeleteImage',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            jQuery(location).attr('href', siteUrl + "admin/gallery/" + $scope.id);
        }).error(function (msg) {
            alert(msg);
        });
    }
    $scope.uploadFlag = true;
    $scope.$watch('files', function () {
        if ($scope.files != null) {
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
        var images = 'image=';
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                images += file.name + '$%$';
                
            }

            Upload.upload({
                url: '/admin/upload',
                file: file
            }).success(function (data, status, headers, config) {

                images += '&Id=' + $scope.id;
                $http({
                    method: 'POST',
                    url: '/admin/SaveImage',
                    data: images,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function (data) {

                    jQuery(location).attr('href', siteUrl + "admin/gallery/" + $scope.id);
                }).error(function (msg) {
                });
            });
        }

    };

}]);


adriaTicketAdmin.controller('addGalleryController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $scope.gallery = "";

}]);