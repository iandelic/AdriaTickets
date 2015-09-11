adriaTicketAdmin.controller('AdminGalleriesController', ['$scope', '$http', 'SiteData', function ($scope, $http, SiteData) {

    var siteUrl = SiteData.url;
    $http.get('/data/getgalleries').success(function (data) {
        $scope.galleries = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminGalleryController', ['$scope', '$location', '$rootElement', '$http', 'Upload', 'SiteData', function ($scope, $location, $rootElement, $http, Upload, SiteData) {

    var siteUrl = SiteData.url;
    var id = $location.absUrl().split('/').pop();
    if (parseInt(id)){
        $http.get('/data/getGallery/'+id).success(function (data) {
            $scope.gallery = data;
            $scope.id = $scope.gallery[0].galleryID;
            
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
        
        $scope.tempImages = [];
        if ($scope.files != null) {
            if ($scope.files && $scope.files.length) {
                for (var i = 0; i < $scope.files.length; i++) {
                    var file = $scope.files[i];
                    $scope.tempImages.push(file.name);

                }
            }
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

    }

}]);


adriaTicketAdmin.controller('addGalleryController', ['$scope', '$http', 'SiteData', function ($scope, $http, SiteData) {

    var siteUrl = SiteData.url;
    $scope.gallery = "";

    $scope.save = function () {
        $http({
            method: 'POST',
            url: '/admin/SaveGallery',
            data: 'gallery='+$scope.gallery,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            jQuery(location).attr('href', siteUrl + "admin/galleries/");
        }).error(function (msg) {
        });
    }

}]);