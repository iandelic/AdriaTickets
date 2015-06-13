var adriaTicket = angular.module('adriaticket', ['youtube-embed']);

adriaTicket.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);



var adriaTicketAdmin = angular.module('adriaticketadmin', ['ui.bootstrap.datetimepicker', 'ui.tinymce', 'ngFileUpload', 'youtube-embed', 'datatables', 'ui.select']);

adriaTicketAdmin.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}]);
adriaTicketAdmin.directive('smartFloat', function ($filter) {
    var FLOAT_REGEXP_1 = /^\$?\d+.(\d{3})*(\,\d*)$/; //Numbers like: 1.123,56
    var FLOAT_REGEXP_2 = /^\$?\d+,(\d{3})*(\.\d*)$/; //Numbers like: 1,123.56
    var FLOAT_REGEXP_3 = /^\$?\d+(\.\d*)?$/; //Numbers like: 1123.56
    var FLOAT_REGEXP_4 = /^\$?\d+(\,\d*)?$/; //Numbers like: 1123,56

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (FLOAT_REGEXP_1.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                } else if (FLOAT_REGEXP_2.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace(',', ''));
                } else if (FLOAT_REGEXP_3.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue);
                } else if (FLOAT_REGEXP_4.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });

            ctrl.$formatters.unshift(
               function (modelValue) {
                   return $filter('number')(parseFloat(modelValue), 2);
               }
           );
        }
    };
});

var INTEGER_REGEXP = /^\-?\d+$/;
adriaTicketAdmin.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.integer = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
});
adriaTicket.factory('Page', function () {
    var title = 'Adria Ticket';
    return {
        title: function () { return title; },
        setTitle: function (newTitle) { title = newTitle }
    };
});

adriaTicketAdmin.config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
});