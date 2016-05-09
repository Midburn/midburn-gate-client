var devServerURL = 'http://royzahor.ddns.net:8080';
var cloudServerURL = 'http://ec2-52-16-191-219.eu-west-1.compute.amazonaws.com:8080';

angular.module('starter.services', ['ionic', 'LocalStorageModule'])

    .factory('TicketService', function () {
        var ticket;

        return {
            set: function (data) {
                ticket = data;
            },
            get: function () {
                return ticket;
            }
        };
    })

    .factory('PreferencesService', function (localStorageService) {
        var serverURL = null;

        return {
            setURL: function (server) {
                serverURL = server;
                try {
                    localStorage.setItem('serverURL', serverURL);
                    //localStorageService.set('serverURL', serverURL);
                } catch (e) {
                    alert('Error saving');
                }
            },
            getURL: function () {
                return serverURL;
            },
            loadURL: function (func) {
                try {
                    serverURL = localStorage.getItem('serverURL');
                }
                catch (e) { }

                if (serverURL == null) {
                    serverURL = cloudServerURL;
                }
            }
        }
    })
;
