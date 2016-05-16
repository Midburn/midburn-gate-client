
angular.module('starter.controllers', ['ionic', 'ngCordova'])

    .controller("MainController", function ($ionicPlatform, $interval, $scope, $cordovaBarcodeScanner, $http, TicketService, $state, PreferencesService, $ionicLoading) {
        $ionicLoading.hide();
        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                if (!imageData.cancelled) {
                    $http.get(PreferencesService.getURL() + '/?id=' + imageData.text, {timeout: 10000})
                        .success(function (data, status, headers, config) {
                            TicketService.set(data);
                            if (data.color == "red") {
                                playAudio("errorAudio");
                            }
                            else {
                                playAudio("okAudio");
                            }
                            $state.go('show');
                        })
                        .error(function (data, status, headers, config) {
                            $state.go('main');
                        });
                }
                else {
                    $state.go('main');
                }
            }, function (error) {
                console.log("An error happened -> " + error);
                $state.go('main');
            });
        };

        $scope.manualInput = function () {
            $ionicLoading.show();
            $http.get(PreferencesService.getURL() + '/?action=manual_entrance&order=' + $('#order_num').val() + '&ticket=' + $('#ticket_num').val(), {timeout: 10000})
                .success(function (data, status, headers, config) {
                    TicketService.set(data);
                    if (data.color == "red") {
                        playAudio("errorAudio");
                    }
                    else {
                        playAudio("okAudio");
                    }
                    $ionicLoading.hide();
                    $state.go('show');
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                });
        };

        $scope.login = function () {
            $state.go('login', {}, {reload: true});
        };

        $scope.checkServer = function () {
            $http.get(PreferencesService.getURL() + '/?action=counter', {timeout: 10000})
                .success(function (data, status, headers, config) {
                    $scope.data = data;
                    $scope.server = PreferencesService.getURL();
                })
                .error(function (data, status, headers, config) {
                    $scope.data = {color: "red", message: 'אין חיבור לשרת'};
                    //$timeout(function () {$scope.checkServer();}, 20000);
                });
        };

        if ($scope.autoFunc == null) {
            $scope.autoFunc = $interval($scope.checkServer, 20000);
        }

        $ionicPlatform.ready(function () {
            PreferencesService.loadURL();

            $scope.checkServer();
        });

        $scope.$on('$destroy', function() {
            $interval.cancel($scope.autoFunc);
        });
    })

    .controller("ShowController", function ($scope, TicketService, $http, $state, PreferencesService, $ionicLoading) {
        $ionicLoading.hide();
        $scope.data = TicketService.get();

        $scope.enter = function () {
            $ionicLoading.show();
            $http.get(PreferencesService.getURL() + '/?action=save&id=' + $scope.data.barcode, {timeout: 10000})
                .success(function (data, status, headers, config) {
                    TicketService.set(data);
                    $scope.data = data;
                    if (data.color == "green")
                    {
                        playAudio("welcomeAudio");
                        $state.go('main');
                    }
                    else
                    {
                        playAudio('errorAudio');
                        $state.go('show');
                    }
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                });
        };

        $scope.cancel = function () {
            $ionicLoading.hide();
            $state.go("main");
        };
    })

    .controller("LoginController", function ($scope, $state, $http, PreferencesService) {
        $scope.gater = "";
        $scope.message = "";
        $scope.passPhase = true;
        $scope.adminOnly = true;

        $scope.login = function () {
            var gater = $('#gater').val();
            if (gater == '')
            {
                alert("יש להכניס שם מפעיל עמדה");
            }
            else {
                $http.get(PreferencesService.getURL() + '/?action=login&gater=' + gater, {timeout: 10000})
                    .success(function (data, status, headers, config) {
                        $scope.message = data.message;
                        $scope.color = data.color;
                    })
            }
        };

        $scope.logout = function () {
            $http.get(PreferencesService.getURL() + '/?action=logout', {timeout: 10000})
                .success(function (data, status, headers, config) {
                    $scope.message = data.message;
                    $scope.color = data.color;
                })
        };

        $scope.back = function () {
            $state.go('main', {}, {reload: true});
        };

        $scope.setServer = function (server) {
            if (server == 0) {
                PreferencesService.setURL(devServerURL);
            }
            else if (server == -1) {
                PreferencesService.setURL(cloudServerURL);
            }
            else {
                PreferencesService.setURL('http://10.0.0.' + server + ':8080');
            }
        };

        $scope.passClick = function () {
            var $pass = $('#pass');
            if ($pass.val() == 2015) {
                $scope.passPhase = false;
            }
            else if ($pass.val() == 20052015) {
                $scope.passPhase = false;
                $scope.adminOnly = false;
            }
            else
            {
                $pass.val(null);
                alert("סיסמה שגויה!");
            }
        };
    })


;
