var adriaTicket = angular.module('adriaticket', []);

adriaTicket.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);



var adriaTicketAdmin = angular.module('adriaticketadmin', ['ui.bootstrap.datetimepicker']);

adriaTicketAdmin.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);
