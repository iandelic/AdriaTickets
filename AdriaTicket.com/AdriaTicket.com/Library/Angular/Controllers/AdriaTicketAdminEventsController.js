adriaTicketAdmin.controller('AdminEventController', ['$scope', '$http', function ($scope, $http) {

    var siteUrl = "http://localhost:32718/";
    $http.get('/admin/getEvents').success(function (data) {
        $scope.events = data;
        angular.forEach($scope.events, function (event) {
            event.EVE_Opis = $("<div/>").html(event.EVE_Opis).text();
        });
    }).error(function () { alert('error') });


}]);


adriaTicketAdmin.controller('AdminEventEditController', ['$scope', '$location', '$rootElement', '$http', 'Upload', function ($scope, $location, $rootElement, $http, taOptions, Upload) {

    var siteUrl = "http://localhost:32718/";
    var id = $location.absUrl().split('/').pop();
    $scope.event = {}
    $scope.files = {}


    if (parseInt(id)){
            $http.get('/admin/getEvent/'+id).success(function (data) {
                $scope.event = data[0];
                $scope.event.EVE_Opis = decodeURIComponent($scope.event.EVE_Opis);
            $scope.event.EVE_Datum = moment($scope.event.EVE_Datum).format('DD.MM.YYYY HH:mm:ss');
            $scope.event.EVE_DatumOdProdaja = moment($scope.event.EVE_DatumOdProdaja).format('DD.MM.YYYY HH:mm:ss');
            $scope.event.EVE_DatumOdPretprodaja = moment($scope.event.EVE_DatumOdPretprodaja).format('DD.MM.YYYY HH:mm:ss');
            $scope.disabledFlag = false;
            $scope.description = $scope.event.EVE_Opis;
            }).error(function () { alert('error event') });
    }
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
        if ($scope.files != null)
        $scope.upload($scope.files);
    });
    $scope.$watch('description', function () {
        $scope.event.EVE_Opis = $scope.description;
    });
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/admin/upload',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
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
        height: "200px",
        width: "650px"
    };
    $scope.save = function (event) {
        var temp = 'naziv=' + event.EVE_Naziv;
        if(event.EVE_Id != null)
        temp += '&id=' + event.EVE_Id;
        temp += '&opis=' + encodeURIComponent(event.EVE_Opis).replace(/%20/g, '+');;
        temp += '&Datum=' + event.EVE_Datum;
        temp += '&DatumOdPretprodaja=' + event.EVE_DatumOdPretprodaja;
        temp += '&DatumOdProdaja=' + event.EVE_DatumOdProdaja;
        temp += '&Organizator=' + event.ORG_Id;
        temp += '&PostotakProvizije=' + event.EVE_PostotakProvizije;
        temp += '&Mjesto=' + event.EVE_MjestoId;
        temp += '&Dvorana=' + event.EVE_DvoranaId;
        temp += '&Status=' + event.SEV_Id;
        temp += '&PrikazNaWebu=' + event.EVE_PrikaziNaWebu;
        console.log(temp);
        $http({
            method: 'POST',
            url: '/admin/SaveEvent',
            data: temp,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
                jQuery(location).attr('href', siteUrl + "admin/home");
        }).error(function (msg) {
            alert(msg);
        });
    }
}]);