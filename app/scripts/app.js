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
        'ngSanitize',
        'ui.router',
        'ngMaterial',
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.autoResize'
    ])
    .constant('cookieName', 'cargly_rsmt_access_token')
    .constant('globalTimeZone', ["US/Hawaii", "US/Alaska", "US/Pacific", "US/Arizona", "US/Mountain", "US/Central", "US/Eastern"])
    .constant('toastr', toastr);


app.config(function ($mdThemingProvider, toastr, $urlRouterProvider, $stateProvider, $httpProvider) {

    // Pull in `Request/Response Service` from the dependency injector
    $httpProvider.interceptors.push('InterceptorsService');

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
            controller: 'LoginCtrl'
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
            templateUrl: "views/authenticated/dashboard/dashboard.html"
        })
        .state('main.locations', {
            url: "locations",
            controller: 'LocationsCtrl',
            templateUrl: "views/authenticated/locations/locations.html"
        })
        .state('main.crm', {
            url: "crm",
            controller: 'CrmCtrl',
            templateUrl: "views/authenticated/crm/crm.html"
        })
        .state('main.products', {
            url: "products",
            controller: 'ProductsCtrl',
            templateUrl: "views/authenticated/products/products.html"
        })
        .state('main.locationSetup', {
            url: 'location/setup',
            controller: 'LocationSetupCtrl',
            templateUrl: "views/authenticated/locationSetup/locationSetup.html"
        })
        .state('main.settings', {
            url: 'settings/:settingsName',
            controller: 'SettingsCtrl',
            templateUrl: 'views/authenticated/settings/settings.html'
        });

    /*--------- End of State Management ----------*/

    CarglyPartner.configure({
        applicationId: 'bTkSVhhdCDKmJU1KrE9nmwBllTl8iQ9r', // prod
        appLabel: 'rsmt',
        onTwoMinWarning: function () {
        },
        onAuthChanged: function () {
        }
    });

});

app.run(function ($rootScope, $mdSidenav) {
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

});
