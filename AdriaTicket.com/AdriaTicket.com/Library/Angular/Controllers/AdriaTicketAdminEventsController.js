﻿adriaTicketAdmin.controller('AdminEventController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/admin/getEvents').success(function (data) {
        $scope.events = data;
        angular.forEach($scope.events, function (event) {
            event.EVE_Datum = moment(event.EVE_Datum).format('DD.MM.YYYY');
            event.EVE_Opis = $("<div/>").html(event.EVE_Opis).text();
            var k = 65 / 1920;
            event.EVE_Opis = event.EVE_Opis.substring(0, $( window ).width() * k);
        });
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminEventEditController', ['$scope', '$location', '$rootElement', '$http', 'Upload', function ($scope, $location, $rootElement, $http, Upload) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.event = {}
    $scope.files = {}

    $scope.disabledFlag = true;
    $scope.uploadFlag = false;
    $scope.addEditEvent = "Novi događaj";
    $scope.saveUpdate = "Dodaj";

    if (parseInt(id)){
            $http.get('/admin/getEvent/'+id).success(function (data) {
                $scope.event = data[0];
                $scope.addEditEvent = "Uredi događaj: " + $scope.event.EVE_Naziv;
                $scope.saveUpdate = "Spremi";
                $scope.event.EVE_Opis = decodeURIComponent($scope.event.EVE_Opis);
            $scope.event.EVE_Datum = moment($scope.event.EVE_Datum).format('DD.MM.YYYY HH:mm:ss');
            $scope.event.EVE_DatumOdProdaja = moment($scope.event.EVE_DatumOdProdaja).format('DD.MM.YYYY HH:mm:ss');
            $scope.event.EVE_DatumOdPretprodaja = moment($scope.event.EVE_DatumOdPretprodaja).format('DD.MM.YYYY HH:mm:ss');
            $scope.disabledFlag = false;
            $scope.description = $scope.event.EVE_Opis;
            }).error(function () { alert('error event') });
    }

    $http.get('/data/getgalleries').success(function (data) {
        $scope.galleries = data;
    }).error(function () { alert('error status') });

    $http.get('/data/geteventstatuses').success(function (data) {
        $scope.eventStatus = data;
    }).error(function () { alert('error status') });

    $http.get('/data/geteventorganisers').success(function (data) {
        $scope.eventOrganisers = data;
    }).error(function () { alert('error status') });

    $http.get('/data/geteventlocations').success(function (data) {
        $scope.eventLocations = data;
    }).error(function () { alert('error status') });

    $http.get('/data/geteventtowns').success(function (data) {
        $scope.eventTowns = data;
    }).error(function () { alert('error status') });


    $scope.datmEventaChange = function (newVal, oldVal) {
        $scope.event.EVE_Datum = moment(newVal).format('DD.MM.YYYY hh:mm:ss')
    }
    $scope.pretprodajaKarataChange = function (newVal, oldVal) {
        $scope.event.EVE_DatumOdPretprodaja = moment(newVal).format('DD.MM.YYYY hh:mm:ss')
    }
    $scope.prodajaKarataChange = function (newVal, oldVal) {
        $scope.event.EVE_DatumOdProdaja = moment(newVal).format('DD.MM.YYYY hh:mm:ss')
    }

    $scope.configFunction = function configFunction() {
        return { startView: 'month' };
    };
   

    $scope.$watch('files', function () {
        if (!angular.equals({}, $scope.files)) {
            $scope.event.EVE_ImagePath = $scope.files[0].name;
            $scope.upload($scope.files);
        }
    });
    $scope.$watch('description', function () {
        $scope.event.EVE_Opis = $scope.description;
    });
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.event.EVE_ImagePath = file.name;
                Upload.upload({
                    url: '/admin/upload',
                    file: file
                }).progress(function (evt) {
                    $scope.uploadFlag = true;
                }).success(function (data, status, headers, config) {
                    $scope.uploadFlag = false;
                });
            }
        }
    };
    $scope.tinymceOptions = {
        theme: "modern",
        encoding: "xml",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor"
        ],
        toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "forecolor backcolor",
        image_advtab: true,
        height: "200px"
    };

    $scope.deleteImage = function () {
        $scope.event.EVE_ImagePath = "";
    }
    $scope.save = function (event) {
        var temp = 'naziv=' + event.EVE_Naziv;
        if(event.EVE_Id != null)
        temp += '&id=' + event.EVE_Id;
        temp += '&opis=' + encodeURIComponent(event.EVE_Opis).replace(/%20/g, '+');;
        temp += '&Datum=' + event.EVE_Datum;
        temp += '&Image=' + event.EVE_ImagePath;
        temp += '&DatumOdPretprodaja=' + event.EVE_DatumOdPretprodaja;
        temp += '&DatumOdProdaja=' + event.EVE_DatumOdProdaja;
        temp += '&Organizator=' + event.ORG_Id;
        temp += '&PostotakProvizije=' + event.EVE_PostotakProvizije;
        temp += '&Mjesto=' + event.MjestoId;
        temp += '&Dvorana=' + event.EVE_DvoranaId;
        temp += '&Status=' + event.EVE_StatusEventaId;
        temp += '&PrikazNaWebu=' + event.EVE_PrikaziNaWebu;
        temp += '&VideoLink=' + event.videoLink;
        temp += '&galleryId=' + event.ImageGalleriesID;
        $http({
            method: 'POST',
            url: '/admin/SaveEvent',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
                jQuery(location).attr('href', siteUrl + "admin/events");
        }).error(function (msg) {
            alert(msg);
        });
    }
}]);



adriaTicketAdmin.controller('AdminEventPricesController', ['$scope', '$http', '$location', function ($scope, $http,$location) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.cijeneFlag = false;
    if (parseInt(id)) {
        $http.get('/admin/getEvent/' + id).success(function (data) {
            $scope.event = data[0];
            $http.get('/admin/getEventSectors/' + $scope.event.EVE_DvoranaId).success(function (temp) {
                $scope.sectors = temp;

            }).error(function () { alert('error inner sectors') });

            $http.get('/admin/getEventPrices/' + id).success(function (temp) {
                $scope.prices = temp;
            }).error(function () { alert('error inner sectors') });
            

        }).error(function () { alert('error event') });
    }

    
    $scope.$watch("prices", function (value) {
        if (angular.isUndefined($scope.prices) || $scope.prices.length == 0) {
            $scope.cijeneFlag = false;
        }
        else {
            $scope.cijeneFlag = true;
        }
    }, true)

    $scope.update = function () {
        $scope.updateCounter = 0;
        $scope.updateFlag = true;
        angular.forEach($scope.prices, function (value) {
            var temp = 'action=update';
            temp += '&eventid=' + value.CIJ_EventId;
            temp += '&sektorid=' + value.CIJ_SektorId;
            if (value.CIJ_IznosNaDan != null && value.CIJ_IznosNaDan != 'undefined') {
                value.CIJ_IznosNaDan = value.CIJ_IznosNaDan.toString().replace(".", ",");
                temp += '&iznosnadan=' + value.CIJ_IznosNaDan;
            }
            value.CIJ_IznosPretprodaja = value.CIJ_IznosPretprodaja.toString().replace(".", ",");
            temp += '&iznospretprodaja=' + value.CIJ_IznosPretprodaja;
            if (value.CIJ_IznosProdaja != null && value.CIJ_IznosProdaja != 'undefined') {
                value.CIJ_IznosProdaja = value.CIJ_IznosProdaja.toString().replace(".", ",");
                temp += '&iznosprodaja=' + value.CIJ_IznosProdaja;
            }
            if (value.CIJ_IznosPopusta != null && value.CIJ_IznosPopusta != 'undefined') {
                value.CIJ_IznosPopusta = value.CIJ_IznosPopusta.toString().replace(".", ",");
                temp += '&iznospopusta=' + value.CIJ_IznosPopusta;
            }

            console.log(temp);
            $http({
                method: 'POST',
                url: '/admin/SavePrices',
                data: temp,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                $scope.updateCounter = $scope.updateCounter + 1;
            }).error(function (msg) {
                $scope.updateFlag = false;
            });
        });
    };
    $scope.$watch("updateCounter", function () {
        if ($scope.updateFlag == true && $scope.updateCounter == $scope.prices.length)
        {
            jQuery(location).attr('href', siteUrl + "admin/events");
        }
    })

    $scope.save = function () {
        $scope.saveCounter = 0;
        $scope.saveFlag = true;
        angular.forEach($scope.sectors, function (value) {

            var temp = 'action=insert';
            temp += '&eventid=' + $scope.event.EVE_Id;
            temp += '&sektorid=' + value.SEK_Id;
            if (value.CIJ_IznosNaDan != null && value.CIJ_IznosNaDan != 'undefined') {
                value.CIJ_IznosNaDan =  value.CIJ_IznosNaDan.replace(".", ",");
                temp += '&iznosnadan=' + value.CIJ_IznosNaDan;
            }
            value.CIJ_IznosPretprodaja = value.CIJ_IznosPretprodaja.toString().replace(".", ",");
            temp += '&iznospretprodaja=' + value.CIJ_IznosPretprodaja; 
            if (value.CIJ_IznosProdaja != null && value.CIJ_IznosProdaja != 'undefined') {
                value.CIJ_IznosProdaja = value.CIJ_IznosProdaja.replace(".", ",");
                    temp += '&iznosprodaja=' + value.CIJ_IznosProdaja;
            }
            if (value.CIJ_IznosPopusta != null && value.CIJ_IznosPopusta != 'undefined') {
                value.CIJ_IznosPopusta = value.CIJ_IznosPopusta.replace(".", ",");
                temp += '&iznospopusta=' + value.CIJ_IznosPopusta;
            }
            console.log(temp);
            $http({
                method: 'POST',
                url: '/admin/SavePrices',
                data: temp,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data) {
                $scope.saveCounter = $scope.saveCounter + 1;
            }).error(function (msg) {
                $scope.saveFlag = false;
            });
        });
    };
    $scope.$watch("saveCounter", function () {
        if ($scope.saveFlag == true && $scope.saveCounter == $scope.sectors.length) {
            jQuery(location).attr('href', siteUrl + "admin/events");
        }
    })


    $scope.check = function (value,name) {
        $scope.value = parseFloat(value).toFixed(2);
    }
}]);