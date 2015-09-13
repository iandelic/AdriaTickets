adriaTicketAdmin.controller('AdminGalleriesController', ['$scope', '$http', 'SiteData', function ($scope, $http, SiteData) {

    var siteUrl = SiteData.url;
    $http.get('/data/getgalleries').success(function (data) {
        $scope.galleries = data;
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminGalleryController', ['$scope', '$location', '$rootElement', '$http', 'Upload', 'SiteData', '$q',
    function ($scope, $location, $rootElement, $http, Upload, SiteData,$q) {

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
            $scope.uploadFlag = false;
        }
        else
        {
            $scope.uploadFlag = true;
        }

        var defer = $q.defer();

        $scope.tempImages = [];
        var promises = [];
        if ($scope.files && $scope.files.length) {
            for (var i = 0; i < $scope.files.length; i++) {
                var file = $scope.files[i];
                promises.push(
                Upload.upload({
                    url: '/admin/upload',
                    file: file,
                    fields: { 'name': $scope.gallery[0].NazivGalerije, 'type': "galleries" }
                }).then(function (data) {
                    $scope.tempImages.push(data.data)
                })
            );
            }
            $q.all(promises)

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

        }
    }

    $scope.cancelAndDelete = function () {
        var images = 'image=';
        for (var i = 0; i < $scope.tempImages.length; i++) {
            var file = $scope.tempImages[i];
            images += file+ '$%$';
        }
        if($scope.tempImages.length > 0){

            $http({
            method: 'POST',
            url: '/admin/DeleteImage',
            data: images,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {

            jQuery(location).attr('href', siteUrl + "admin/gallery/" + $scope.id);
        })
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