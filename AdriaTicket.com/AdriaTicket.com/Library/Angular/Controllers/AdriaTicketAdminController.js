adriaTicketAdmin.controller('LoginController', ['$scope', function ($scope) {


    $scope.submit = function(user) {
        console.log(user.username + user.password);
    };
      

}]);