app.factory('gmaps', ['$rootScope', '$http', 'dataAcessService',
    function ($rootScope, $http, dataAcessService) {
        var gmaps = {};
        var _datasets = [];

        gmaps.addPolygon = function (objPoly, lhecolour, CodeType, CodeId, fillOpacity) {
            
            var polygonCoord = [];
            clearMapObjects(polys);
            for (var i = 0; i < objPoly.length; i++) {
                polygonCoord.push(objPoly[i].Coordinates);
            };
            var poly = new google.maps.Polygon({
                paths: polygonCoord,
                map: map,
                indexID: CodeId,
                strokeColor: lhecolour,
                strokeOpacity: 1,
                strokeWeight: -1,
                fillColor: lhecolour,
                fillOpacity: fillOpacity
            });

            map.setCenter(objPoly[0].Coordinates[0]);
            
            var latLng = new google.maps.LatLng(objPoly[0].Coordinates[0].lat, objPoly[0].Coordinates[0].lng);

            

            if (CodeType == "Region") {
                map.setZoom(6);
            }
            if (CodeType == "LHE") {
                
                polys.push(poly);
                google.maps.event.addListener(poly, "click", function () {
                    this.setOptions({ fillColor: "#ffede5" });
                });
                google.maps.event.addListener(poly, "mouseout", function () {
                    this.setOptions({ fillColor: lhecolour });
                });
                map.setZoom(8);
                
            }
            else if (CodeType == "CCG") {
                map.setZoom(10);
            }
        };

        var clearMapObjects = function (obj) {
            for (var i = 0; i < obj.length; i++) {
                obj[i].setMap(null);
            }
            obj = [];
        }


        gmaps.createLabel = function (latLng,title)
        {
        //setLabel(latLng, objPoly[0].OrgCode);
        var latLng_obj = new google.maps.LatLng(latLng.lat, latLng.lng);
        setLabel(latLng_obj, title);
    }
    


    gmaps.clearMapObjects = function (obj) {
        clearMapObjects(obj);
    }

    var clearAllMarkers = function () {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    gmaps.setMarker = function (providers) {
        clearAllMarkers();
        angular.forEach(providers, function (e)
        {
            var myLatLng = getProviderCoordinates(e.providerCode);
            addMarker(myLatLng, myLatLng.title, "red")
            //var marker = new google.maps.Marker({
            //    position: myLatLng,
            //    map: map,
            //    icon: getIcon('', 'Red'),
            //    title: e.providerCode
            //});
    });
    }

    var getProviderCoordinates = function (code) {
        var providorcoord;
        var lat;
        var lng;
        var title;
        
        angular.forEach(dataAcessService.GetDataset('JSONProvider'), function (e){
            if (e["NHS_Code"] == code) {
                lat = parseFloat(e['Lat']);
                lng = parseFloat(e['Lang']);
                title = e['Name'];
            }
        });
        if (lat != NaN && lng != NaN) {
            return { lat: lat, lng: lng, title: title};
        }

    }

    var getIcon = function (code, strokeColor, fillColor) {
        var icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: fillColor,
            strokeColor: strokeColor,
            strokeWeight: 5

        }
        return icon;
    }

    var addMarker = function (myLatLng, orgname, orgcolor) {

        markers.push(
           new google.maps.Marker({
               position: myLatLng,
               map: map,
               title: orgname,
             //icon: {
             //    path: google.maps.SymbolPath.CIRCLE,
             //    strokeColor: orgcolor,
             //    scale: 4
             //}
         })
           );

        markers[markers.length - 1].addListener('click', function () {
            infowindow.open(map, markers[markers.length - 1]);
        });


    };

    return gmaps;

}]);