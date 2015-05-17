adriaTicketAdmin.controller('LoginController', ['$scope','$http', function ($scope,$http) {

    var siteUrl = "http://localhost:32718/";

    $scope.submit = function(user) {
        $http({
            method: 'POST',
            url: '/admin/login',
            data: 'name=test',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            console.log(data);
            jQuery(location).attr('href',siteUrl+"admin/home");
        }).error(function () { alert('error') });
    };
      

}]);