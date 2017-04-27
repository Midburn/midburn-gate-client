var EVENT_CODE_DIGITS_NUMBER = 6;
var store;
var MIDBURN_GATE_APP = 'midburn gate';
var EVENT_CODE = 'event_code';

angular.module('starter.controllers', ['ionic', 'ngCordova'])

    .controller("MainController", function ($ionicPlatform, $interval, $scope, $cordovaBarcodeScanner, $http, TicketService, $state, PreferencesService, $ionicLoading) {
        $ionicLoading.hide();
        store = new Persist.Store(MIDBURN_GATE_APP);
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
        var savedEventCode = store.get(EVENT_CODE);
        console.log("checking for existing event code");
        if (savedEventCode) {
            console.log("event code already insterted");
            console.log("savedEventCode: "+ savedEventCode);
            $state.go("main");
        }

        $scope.login = function () {
            console.log("login function called")
            var eventCode = $('#event_code').val();
            if (eventCode.length !== EVENT_CODE_DIGITS_NUMBER) {
                alert("יש להזין 6 ספרות");
            }
            else {
                $http.get(PreferencesService.getURL() + '/?action=login&eventCode=' + eventCode, {timeout: 10000})
                    .success(function (data, status, headers, config) {
                        store.set(EVENT_CODE, eventCode);
                        $state.go("main");
                    })
                    .error(function (data, status, headers, config) {
                        alert("הזדהות נכשלה");
                    });
            }
        };
    })


;
