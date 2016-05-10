'use strict';

/**
 * @ngdoc overview
 * @name rsmtPortalApp
 * @description
 * # rsmtPortalApp
 *
 * Main module of the application.
 */
var app = angular
    .module('rsmtPortalApp', [
        'ngAnimate',
        'ngCookies',
        'angular.filter',
        'ngSanitize',
        'ui.router',
        'ngMaterial',
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.autoResize',
        'ngMap',
        'ui.grid.pagination',
        'angular-bind-html-compile'
    ])
    .constant('cookieName', 'cargly_rsmt_access_token')
    .constant('localStorage', localStorage)
    .constant('globalTimeZone', ["US/Hawaii", "US/Alaska", "US/Pacific", "US/Arizona", "US/Mountain", "US/Central", "US/Eastern"])
    .constant('toastr', toastr);

app.config(function ($mdThemingProvider, toastr, $urlRouterProvider, $stateProvider) {

    $mdThemingProvider.definePalette('rsmtPalette', {
        '50': 'BDBDBD',
        '100': '9E9E9E',
        '200': '757575',
        '300': '616161',
        '400': '424242',
        '500': '212121',
        '600': 'e53935',
        '700': '424242',
        '800': '212121',
        '900': '000000',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',// whether, by default,text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('rsmt')
        .primaryPalette('rsmtPalette')
        .accentPalette('blue');

    $mdThemingProvider.theme('indigo')
        .primaryPalette('indigo')
        .accentPalette('blue');

    $mdThemingProvider.theme('grey')
        .primaryPalette('grey')
        .accentPalette('blue');

    $mdThemingProvider.setDefaultTheme('rsmt');
    $mdThemingProvider.alwaysWatchTheme(true);

    /*--------- Toastr Configurations ----------*/
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    /*--------- Start State Management ----------*/
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl',
            data:{pageTitle:'Login'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }

        })
        .state('resetPassword', {
            url: "/reset-password",
            templateUrl: "views/resetPassword.html",
            controller: 'ResetPasswordCtrl',
            data:{pageTitle:'Reset Password'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('verify', {
            url: "/verify",
            templateUrl: "views/authenticated/verify/verify.html",
            controller: 'VerifyCtrl',
            data:{pageTitle:'User Verify'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('payment', {
            url: "/payment",
            templateUrl: "views/authenticated/payment/payment.html",
            controller: 'PaymentCtrl',
            data:{pageTitle:'Payment'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main', {
            abstract: true,
            url: "/",
            controller: 'MainCtrl',
            templateUrl: "views/authenticated/main.html"
        })
        .state('main.dashboard', {
            url: "dashboard",
            controller: 'DashboardCtrl',
            templateUrl: "views/authenticated/dashboard/dashboard.html",
            data:{pageTitle:'Dashboard'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser('realtime_dashboard');
                }]
            }
        })
        .state('main.locations', {
            url: "locations",
            controller: 'LocationsCtrl',
            templateUrl: "views/authenticated/locations/locations.html",
            data:{pageTitle:'Locations'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main.crm', {
            url: "crm",
            controller: 'CrmCtrl',
            templateUrl: "views/authenticated/crm/crm.html",
            data:{pageTitle:'CRM'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser('crm_scheduled');
                }]
            }
        })
        .state('main.products', {
            url: "products",
            controller: 'ProductsCtrl',
            templateUrl: "views/authenticated/products/products.html",
            data:{pageTitle:'Products'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main.locationSetup', {
            url: 'location/setup',
            controller: 'LocationSetupCtrl',
            templateUrl: "views/authenticated/locationSetup/locationSetup.html",
            data:{pageTitle:'Location Setup'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser('realtime_dashboard');
                }]
            }
        })
        .state('main.settings', {
            url: 'settings/:settingsName',
            controller: 'SettingsCtrl',
            templateUrl: 'views/authenticated/settings/settings.html',
            data:{pageTitle:'Settings'},
            resolve: {
                AuthService : ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        });

    /*--------- End of State Management ----------*/

});

app.run(function ($rootScope, $mdDialog, $mdSidenav, $cookies, cookieName) {
    /*----- change ui-grid height -----*/
    $rootScope.fnReturnGridHeight = function (dataLength, intRowHeight, isPaginationEnabled, isFilteringEnabled) {
        var rowHeight = 50; // your row height
        var headerHeight = 30; // your header height
        var footerHeight = 32;  // your footer heightv
        var horizScrollBarHeight = 18; // x-scrollbar height

        var rowHeader = headerHeight + (isFilteringEnabled ? 25 : 0);
        var rowContent = (dataLength * (intRowHeight ? intRowHeight : rowHeight)) + horizScrollBarHeight;
        var rowFooter = isPaginationEnabled ? footerHeight : 0;

        return {
            'height': (rowHeader + rowContent + rowFooter) + "px"
        };
    };

    /*----- on cancel search return last view value -----*/
    $rootScope.fnCancelSearchFilter = function (event, ctrlField) {
        if (event.keyCode === 27) {
            ctrlField.searchForm.searchFilter.$rollbackViewValue();
        }
    };

    /*----- Close all open side-navs -----*/
    $rootScope.fnCloseSideNavs = function () {
        var sideNavSelector = angular.element('md-sidenav');

        angular.forEach(sideNavSelector, function (elem) {
            var componentId = angular.element(elem).attr('md-component-id');
            if ($mdSidenav(componentId).isOpen()) {
                $mdSidenav(componentId).close().then(function () {
                });
            }
        });
    };

    /*----- Cargly Configuration -----*/
    CarglyPartner.configure({
        applicationId: 'bTkSVhhdCDKmJU1KrE9nmwBllTl8iQ9r', // prod
        appLabel: 'rsmt',
        onTwoMinWarning: function () {
            var IdleSessionCtrl = ['$scope', '$mdDialog', '$interval', function($scope, $mdDialog, $interval) {
                $scope.countdown;
                $scope.minRemaining = 60;

                $scope.fnCloseDialog = function() {
                    $mdDialog.cancel();
                };

                var interval = $interval(function() {
                    if ($scope.countdown === 0) {
                        $interval.cancel();
                        $scope.fnCloseDialog();
                    }
                    $scope.countdown -= 1;
                }, 1000);

                $scope.$watch('countdown', function(newval) {
                    $scope.minRemaining = parseInt(newval / 60) + 1;
                });

                $scope.extendSession = function() {
                    $scope.fnCloseDialog();
                    CarglyPartner.extendSession(function() {
                    }, function() { });
                }

            }];

            var token = $cookies.get(cookieName);

            if (token) {
                $mdDialog.show({
                    controller: IdleSessionCtrl,
                    templateUrl: 'views/modals/idleSession.tmpl.html',
                    clickOutsideToClose: false
                });
            }
        },
        onAuthChanged: function () {
        }

    });

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i) || navigator.platform.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i) || navigator.platform.match(/BlackBerry/i);;
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.platform.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $rootScope.isMobile = isMobile.any();

});
