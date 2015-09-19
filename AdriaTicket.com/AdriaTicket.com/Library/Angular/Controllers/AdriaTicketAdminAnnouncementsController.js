adriaTicketAdmin.controller('AnnouncementsController', ['$scope', '$http', 'SiteData', function ($scope, $http,SiteData) {

    $scope.disabledFlag = true;
    $scope.showFlag = false;
    $scope.buttonText = 'Dodaj';
    var siteUrl = SiteData.url;
    $http.get('/admin/getAnnouncements').success(function (data) {
        $scope.announcements = data;

    }).error(function () { alert('error') });
    $scope.announecement = {showOnPage: false};

    $scope.$watch("announecement", function () {
        if ($scope.announecement.text != null && $scope.announecement.showOnPage != null)
        { $scope.disabledFlag = false }
        else
        { $scope.disabledFlag = true }
    }, true)


    $scope.save = function (announecement) {
        var temp = 'text=' + announecement.text;
        if (announecement.Id != null)
            temp += '&id=' + announecement.Id;
        else
            temp += '&id=0';
        temp += '&showOnPage=' + announecement.showOnPage;
        $http({
            method: 'POST',
            url: '/admin/SaveAnnounecement',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            jQuery(location).attr('href', siteUrl + "admin/objave");
        }).error(function (msg) {
            alert(msg);
        });
    }
    $scope.delete = function (announecement) {
        if (announecement.Id != null)
            var temp = '&id=' + announecement.Id;
        $http({
            method: 'POST',
            url: '/admin/DeleteAnnounecement',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            jQuery(location).attr('href', siteUrl + "admin/objave");
        }).error(function (msg) {
            alert(msg);
        });
    }
    $scope.add = function () {
        $scope.showFlag = true;
        $scope.buttonText = 'Dodaj';
    }
    $scope.cancel = function () {
        $scope.announecement.text = '';
        $scope.announecement.Id=null;
        $scope.announecement.showOnPage = false;
        $scope.buttonText = 'Dodaj';
        $scope.showFlag = false;
    }
    $scope.edit = function (ann) {
        $scope.buttonText = 'Spremi';
        $scope.announecement.Id = ann.Id;
        $scope.announecement.text = ann.Announcement;
        $scope.announecement.showOnPage = ann.ShowOnPage;
        $scope.showFlag = true;
    }

}]);
