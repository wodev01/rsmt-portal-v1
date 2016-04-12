'use strict';
app.controller('customerStatisticsCtrl',
    function ($scope, $timeout, $filter, NgMap, locationService, allCustomerService) {

        $scope.locationId = '';
        $scope.locationOptions = [];

        $scope.isDataNotNull = $scope.isMsgShow = $scope.isLocationsData = false;
        $scope.customersStatData = [];

        $scope.pieChartJSON = {};
        $scope.selectedModel = "";

        $scope.mapLabel = 'Loading Map...';
        $scope.searchText = '';
        $scope.totalCustomersFound = 0;

        $scope.isProcessing = false;

        var count = 0;
        var markersArr = [];
        var infowindow = new google.maps.InfoWindow();
        var geocoder = new google.maps.Geocoder();
        $scope.timer;
        $scope.ngMap;

        /*-------------------- Pie Chart ----------------*/
        $scope.fnGeneratePieChart = function () {
            c3.generate({
                bindto: '#pie-chart',
                data: {
                    json: $scope.pieChartJSON,
                    type: 'pie'
                },
                tooltip: {
                    grouped: false,
                    contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                        var name = d[0].name;
                        var value = d[0].value;

                        if (name === 'Email') {
                            color = '#1F77B4';
                        }
                        else {
                            color = '#FF7F0E';
                        }

                        var tooltip = '<table class="c3-tooltip">' +
                            '<tbody>' +
                            '<tr>' +
                            '<th colspan="2">Customers Email Count</th>' +
                            '</tr>' +
                            '<tr class="c3-tooltip-name-' + name + '">' +
                            '<td class="name"><span style="background-color:' + color + '"></span>' + name + '</td>' +
                            '<td class="value">' + value + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>';
                        return tooltip;
                    }
                }
            });
        };

        /*-------------------- Filter email data with/without ----------------*/
        $scope.fnGetEmailData = function (data) {
            $scope.pieChartJSON = {
                'Email': 0,
                'No-Email': 0
            };
            data.filter(function (obj) {
                if (typeof obj.email_addresses === 'string') {
                    obj.email_addresses === '' ?
                        $scope.pieChartJSON['No-Email'] += 1 : $scope.pieChartJSON['Email'] += 1;
                } else {
                    obj.email_addresses.length === 0 ?
                        $scope.pieChartJSON['No-Email'] += 1 : $scope.pieChartJSON['Email'] += 1;
                }
            });
        };

        /*-------------------- Clear all markers on the map ----------------*/
        function clearMarkers() {
            $timeout.cancel($scope.timer);
            for (var i = 0; i < markersArr.length; i++) {
                markersArr[i].setMap(null);
            }
            markersArr = [];
        }

        /*-------------------- Set markers on the map by lat lng ----------------*/
        function setMarkerOnMap(latlng, custObj) {
            $timeout(function () {
                $scope.totalCustomersFound += 1;
                $scope.$apply();
            });

            var marker = new google.maps.Marker({
                position: latlng,
                map: $scope.ngMap,
                animation: google.maps.Animation.DROP
            });
            markersArr.push(marker);

            var html = '<div><h4>' + custObj._fullName + '</h4>' +
                '<div>' + custObj._formattedAddress + '</div>' +
                '<div><span class="leftLabel">Last Visit: </span>'
                + $filter('date')(custObj.last_seen, 'MM/dd/yyyy h:mm a') + '</div>' +
                '<div><table class="mapTable" style="width: 300px;"><thead>' +
                '<tr><th colspan="4">Vehicles Info</th></tr>' +
                '<tr><th>Model</th><th>Make</th><th>License</th><th>Year</th></tr></thead<tbody>';

            for (var i = 0; i < custObj.vehicles.length; i++) {
                html += '<tr><td>' + custObj.vehicles[i].model + '</td>' +
                    '<td>' + custObj.vehicles[i].make + '</td>' +
                    '<td>' + custObj.vehicles[i].license + '</td>' +
                    '<td>' + custObj.vehicles[i].year + '</td></tr>';
            }

            html += '</tbody></table></div>';

            google.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.setContent(html);
                infowindow.open($scope.ngMap, marker);
            });
        }

        /*-------------------- Filter vehicle by model name ----------------*/
        function filterVehicleByModelName(custObj) {
            var filterVehArr = [];
            angular.forEach(custObj.vehicles, function (vObj) {
                if (vObj.model == $scope.selectedModel) {
                    filterVehArr.push(vObj);
                }
            });

            return filterVehArr;
        }

        /*-------------------- Filter markers by customer name | address | vehicle model ----------------*/
        function createMarker(latlng, custObj) {
            if ($scope.searchText !== '' && ($scope.selectedModel && $scope.selectedModel !== '')) {
                custObj.vehicles = filterVehicleByModelName(custObj);

                var foundByName = custObj._fullName.search(new RegExp($scope.searchText, "i"));
                var foundByAddress = custObj._formattedAddress.search(new RegExp($scope.searchText, "i"));
                if (foundByName != -1 || foundByAddress != -1) {
                    if (custObj.vehicles.length != 0) {
                        setMarkerOnMap(latlng, custObj);
                    }
                }
            } else if ($scope.searchText !== '') {
                var foundByName = custObj._fullName.search(new RegExp($scope.searchText, "i"));
                var foundByAddress = custObj._formattedAddress.search(new RegExp($scope.searchText, "i"));
                if (foundByName != -1 || foundByAddress != -1) {
                    if (custObj.vehicles.length != 0) {
                        setMarkerOnMap(latlng, custObj);
                    }
                }
            } else if ($scope.selectedModel && $scope.selectedModel !== '') {
                custObj.vehicles = filterVehicleByModelName(custObj);

                if (custObj.vehicles.length != 0) {
                    setMarkerOnMap(latlng, custObj);
                }
            } else {
                setMarkerOnMap(latlng, custObj);
            }
        }

        /*-------------------- Get geo-location by address ----------------*/
        function geocodeAddress(custObj) {
            geocoder.geocode({'address': custObj._fullAddress}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    $scope.ngMap.setCenter(results[0].geometry.location);
                    custObj._formattedAddress = results[0].formatted_address;
                    custObj._position = results[0].geometry.location;

                    $scope.customersStatData.filter(function (obj) {
                        if (custObj.id === obj.id) {
                            obj['_fullName'] = custObj._fullName;
                            obj['_fullAddress'] = custObj._fullAddress;
                            obj['_formattedAddress'] = custObj._formattedAddress;
                            obj['_position'] = custObj._position;
                            return false;
                        }
                    });
                    createMarker(results[0].geometry.location, angular.copy(custObj));
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        /*------ Map Initialization ------*/
        $scope.fnInitMarkers = function (tempData, customersStatData) {
            if (count >= customersStatData.length) {
                $scope.mapLabel = 'Completed...';
                return;
            }
            var len = tempData.length > 5 ? 5 : tempData.length;
            for (var i = 0; i < len; i++, count++) {
                if (customersStatData[count]._position) {
                    createMarker(customersStatData[count]._position, angular.copy(customersStatData[count]));
                } else {
                    var tmpObj = tempData[i];
                    var tmpAddress = tmpObj.address1 + " " + tmpObj.city + " " + tmpObj.postal_code + " " + tmpObj.state;
                    tmpAddress = tmpAddress.replace(/#/g, '');
                    tmpObj._fullName = tmpObj.first_name + " " + tmpObj.last_name;
                    tmpObj._fullAddress = tmpAddress;
                    geocodeAddress(tmpObj);
                }
            }

            tempData.splice(0, len);
            if (tempData.length == 0) {
                $scope.mapLabel = 'Completed...';
                return;
            }

            $scope.timer = $timeout(function () {
            }, 5000).then(function () {
                $scope.fnInitMarkers(tempData, customersStatData);
            });
        };

        /*------ Map Initialization ------*/
        $scope.fnInitMap = function () {
            count = 0;
            $scope.mapLabel = 'Locating customers...';
            $scope.totalCustomersFound = 0;
            NgMap.getMap().then(function (map) {
                $scope.ngMap = map;
                var tempData = angular.copy($scope.customersStatData);
                $scope.fnInitMarkers(tempData, $scope.customersStatData);
            }, function (error) {
                console.log(error);
                $scope.mapLabel = 'Completed...';
            });
        };

        /*------ Get the data from server ------*/
        $scope.getPagedDataAsync = function () {
            $scope.isDataNotNull = $scope.isMsgShow = false;
            $scope.customersStatData = [];
            $scope.isProcessing = true;

            if ($scope.locationId) {
                allCustomerService.customersData($scope.locationId).then(function (data) {
                    if (data.length !== 0) {
                        $scope.isDataNotNull = true;
                        $scope.isProcessing = $scope.isMsgShow = false;
                        $scope.customersStatData = data;
                        $scope.fnCreateVehicleDD(data);
                        $scope.fnInitMap();
                        $scope.fnGetEmailData(data);
                    } else {
                        $scope.isProcessing = $scope.isDataNotNull = false;
                        $scope.isMsgShow = true;
                    }
                });
            }
        };

        /*------ Set markers on model drop-down change ------*/
        $scope.fnLocateMarkers = function (model) {
            $scope.selectedModel = model;
            clearMarkers();
            $scope.fnInitMap();
        };

        /*------ Create vehicle drop-down ------*/
        $scope.fnCreateVehicleDD = function (customerStatData) {
            $scope.vehicleDD = [];

            var tempData = angular.copy(customerStatData);
            angular.forEach(tempData, function (custObj) {
                angular.forEach(custObj.vehicles, function (vehObj) {
                    if (vehObj.model !== '') {
                        $scope.vehicleDD.push(vehObj);
                    }
                });
            });

            $scope.vehicleDD = $filter('unique')($scope.vehicleDD, 'model');
            $scope.selectedModel = "";
        };

        /*------ Search customer by name or address ------*/
        $scope.fnSearchCustomer = function (searchText) {
            if (searchText) {
                $scope.searchText = searchText;
                searchText += '';
                if (searchText.trim().length >= 5) {
                    $scope.searchText = searchText;
                    clearMarkers();
                    $scope.fnInitMap();
                }
            } else if (searchText || searchText === '') {
                $scope.searchText = searchText;
                clearMarkers();
                $scope.fnInitMap();
            }
        };

        /*------ On scope destroy, cancel timeout  ------*/
        $scope.$on("$destroy", function () {
            $scope.mapLabel = 'Completed...';
            $timeout.cancel($scope.timer);
        });

        /*--------------- Locations Filter --------------------------*/
        $scope.fnGetLocationDetails = function () {
            $scope.isLocationsData = false;

            locationService.fetchLocation().then(function (data) {
                if (data.length != 0) {
                    $scope.isLocationsData = true;
                    $scope.fnCreateLocationDD(data);
                }
            });
        };

        $scope.fnCreateLocationDD = function (data) {
            $scope.locationOptions = [];
            for (var intLocIndex = 0, len = data.length; intLocIndex < len; intLocIndex++) {
                $scope.locationOptions.push({name: data[intLocIndex].name, id: data[intLocIndex].id});
            }
            $scope.locationId = $scope.locationOptions[0].id;
            $scope.getPagedDataAsync();
        };

        $scope.fnChangeLocation = function (locationId) {
            clearMarkers();
            $scope.locationId = locationId;
            $scope.getPagedDataAsync();
        };

        $scope.fnInitCustomerStatistics = function () {
            $scope.fnGetLocationDetails();
        };

    });