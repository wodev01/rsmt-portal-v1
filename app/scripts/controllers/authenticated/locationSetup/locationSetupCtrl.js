'use strict';
app.controller('LocationSetupCtrl', function ($scope, accountServices) {
    $scope.steps = [
        {title: 'Download Setup Program', class: '', description: 'Download Location Setup from'},
        {
            title: 'Run Setup Program',
            class: 'run-setup-bg',
            description: 'Click on run to install RS Marketing Tools in your system.'
        },
        {
            title: 'Welcome',
            class: 'welcome-setup-wizard-bg',
            description: 'Click on next to start installation process.'
        },
        {
            title: 'Select Destination Location',
            class: 'set-destination-location-bg',
            description: 'Select your destination path where you want to install the program.'
        },
        {
            title: 'Select Location Shortcut',
            class: 'select-start-menu-folder-bg',
            description: 'Select start menu folder, where should setup place the program\'s shortcut?'
        },
        {
            title: 'Ready To Install',
            class: 'ready-to-install-bg',
            description: 'click on install to begin installation.'
        },
        {title: 'Installing', class: 'installing-bg', description: 'Installing program in progress'},
        {title: 'Setup Your Shop login', class: 'setup-login-bg', description: 'For setup your shop please login.'},
        {
            title: 'After Login',
            class: 'loggedin-bg',
            description: 'Please click on \'Next Select Shop Location\' button.'
        },
        {
            title: 'Select Shop Location',
            class: 'setup-details-bg',
            description: 'Please set up your shop location and click on \'Next Connect Shop Database\' button.'
        },
        {
            title: 'Connect Shop Database',
            class: 'connect-shop-database-bg',
            description: 'Please configure your database and click on \'Finish\' button.'
        },
        {title: 'Finish', class: 'finishing-setup-bg', description: 'Finish setup shop process.'}
    ];

    $scope.fnInitLocSetup = function () {
        $scope.fnFetchAgentAppDownloadUrl();
    };

    $scope.fnFetchAgentAppDownloadUrl = function () {
        accountServices.fetchAccount(CarglyPartner.user.id).then(function (res) {
            $scope.appDownloadUrl = res.appDownloadUrl;
        });
    };

});
