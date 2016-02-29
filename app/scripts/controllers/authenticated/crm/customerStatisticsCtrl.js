'use strict';
app.controller('customerStatisticsCtrl',
    function ($scope, $timeout, locationService, allCustomerService, NgMap) {

        $scope.locationId = '';
        $scope.locationOptions = [];

        $scope.isDataNotNull = $scope.isMsgShow = $scope.isLocationsData = false;
        $scope.customersStatData = [];

        $scope.pieChartJSON = {};

        var map, markers = [];
        var infowindow = new google.maps.InfoWindow();
        var geocoder = new google.maps.Geocoder();

        /*--------------------Pie Chart----------------*/
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

        /*function geocodeAddress(location) {
         geocoder.geocode({'address': location[1]}, function (results, status) {
         //alert(status);
         if (status == google.maps.GeocoderStatus.OK) {

         //alert(results[0].geometry.location);
         map.setCenter(results[0].geometry.location);
         createMarker(results[0].geometry.location, location[0] + "<br>" + location[1]);
         }
         else {
         alert("some problem in geocode" + status);
         }
         });
         }*/

        function createMarker(latlng, custDetails) {
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);

            var html = '<div><h4>' + custDetails.custName + '</h4>' +
                '<div>' + custDetails.address + '</div>' +
                '<div><table class="mapTable"><thead>' +
                '<tr><th colspan="4">Vehicles Info</th></tr>' +
                '<tr><th>Model</th><th>Make</th><th>License</th><th>Year</th></tr></thead>' +
                '<tbody><tr><td>' + custDetails.vehicles[0].model + '</td>' +
                '<td>' + custDetails.vehicles[0].make + '</td>' +
                '<td>' + custDetails.vehicles[0].license + '</td>' +
                '<td>' + custDetails.vehicles[0].year + '</td>' +
                '</tbody></table></div>';

                /*'<div><span class="leftLabel">Model:</span>' + custDetails.vehicles[0].model + '</div>' +
                '<div><span class="leftLabel">Make:</span>' + custDetails.vehicles[0].make + '</div>' +
                '<div><span class="leftLabel">License:</span>' + custDetails.vehicles[0].license + '</div>' +
                '<div><span class="leftLabel">Year:</span>' + custDetails.vehicles[0].year + '</div>' +
                '</div>';*/

            google.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.setContent(html);
                infowindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });
        }

        $scope.$on('mapInitialized', function (event, map) {
            $scope.objMapa = map;
        });

        $scope.showInfoWindow = function (event, cust) {
            var custDetails = cust.custDetails;
            var html = '<div><h4>' + custDetails.custName + '</h4>' +
                '<div>' + custDetails.address + '</div>' +
                '<div><table class="mapTable"><thead>' +
                '<tr><th colspan="4">Vehicles Info</th></tr>' +
                '<tr><th>Model</th><th>Make</th><th>License</th><th>Year</th></tr></thead>' +
                '<tbody><tr><td>' + custDetails.vehicles[0].model + '</td>' +
                '<td>' + custDetails.vehicles[0].make + '</td>' +
                '<td>' + custDetails.vehicles[0].license + '</td>' +
                '<td>' + custDetails.vehicles[0].year + '</td>' +
                '</tbody></table></div>';

            var infowindow = new google.maps.InfoWindow();
            var center = new google.maps.LatLng(cust.latLang.lat,cust.latLang.lng);

            infowindow.setContent(html);

            infowindow.setPosition(center);
            infowindow.open($scope.objMapa);
        };

        $scope.fnInitMarkers = function (data) {
            angular.forEach(data, function (obj) {
                var address = obj.address1 + " " + obj.city + " " + obj.postal_code + " " + obj.state;
                $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='
                    + address, null, function (data) {
                    if(data.status === 'OK') {
                        console.log(address);
                        obj.address = data.results[0].formatted_address;
                        if (data.results.length !== 0) {
                            console.log(data.results.length);
                            console.log(data.results);
                            obj.latLang = data.results[0].geometry.location;
                            obj.custDetails = {
                                custName: obj.first_name + " " + obj.last_name,
                                address: data.results[0].formatted_address,
                                vehicles: obj.vehicles
                            };
                        }
                    }
                });
            });
        };

        function clearMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        }

        $scope.getPagedDataAsync = function () {
            $scope.isDataNotNull = $scope.isMsgShow = false;

            if ($scope.locationId) {
                clearMarkers();
                allCustomerService.customersData($scope.locationId).then(function (data) {
                    if (data.length !== 0) {
                        $scope.isDataNotNull = true;
                        $scope.isMsgShow = false;
                        $scope.customersStatData = data;
                        $scope.fnInitMarkers($scope.customersStatData);
                        $scope.fnGetEmailData(data);
                    } else {
                        $scope.isDataNotNull = false;
                        $scope.isMsgShow = true;
                    }
                });
            }
        };

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
            $scope.locationId = locationId;
            $scope.getPagedDataAsync();
        };

        $scope.fnInitMap = function () {
            var mapProp = {
                center: new google.maps.LatLng(0, 0),
                zoom: 1,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        };

        $scope.fnInitCustomerStatistics = function () {
            $scope.fnGetLocationDetails();
        };
    });
