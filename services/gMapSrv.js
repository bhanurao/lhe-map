app.factory('gMapSrv', ['$rootScope', '$location', '$routeParams', 'jsondata', 'dataAcessService',
function ($rootScope, $location, $routeParams, jsondata, dataAcessService) {
    var gMapSrv = {};
    gMapSrv = this;

    this.selectedLHEFillColor = "red";
    
    this.mapOptions = new function()
    {
        var center ;
        var zoom ;
    }
    this.lastPoly = new function () {
        var center;
        var codetype;
        var codeid;
        var obj;
    }

    // init 
    this.mapOptions.center = null;
    this.mapOptions.zoom = 0;

    this.addPolygonToMap = function (objPoly, lhecolour, CodeType, CodeId, fillOpacity, showlabel) {

        var polygonCoord = concatinateCoordinats(objPoly);
        var poly = newGooglePolyObj(polygonCoord, lhecolour, CodeType, CodeId, fillOpacity);

        addToGlobalArrays(CodeType, poly, lhecolour);

        gMapSrv.lastPoly.center = new google.maps.LatLng(objPoly[0].Coordinates[0].lat, objPoly[0].Coordinates[0].lng)
        gMapSrv.lastPoly.codetype = CodeType;
        gMapSrv.lastPoly.codeid = CodeId;
        gMapSrv.lastPoly.obj = poly;

        //var latLng = new google.maps.LatLng(objPoly[0].Coordinates[0].lat, objPoly[0].Coordinates[0].lng);
        $rootScope.$broadcast('MonAddedPolygonToMap');
        gMapSrv.setMapCenter();
        gMapSrv.setMapZoom();
        //gMapSrv.setMapPos(0, '', poly, lhecolour);
      


    }

  

    this.setLabel = function (text, lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);
        var label = new mapLabel({
            position: latLng,
            map: map,
            text: text

        });
        labels.push(label);
    }



    function addToGlobalArrays(CodeType, poly, lhecolour) {

        // A standard assumption that selected poly color would be preset
        if (lhecolour == gMapSrv.selectedLHEFillColor) {
            selectedPolys.push(poly);
            google.maps.event.addListener(poly, "mouseover", function () {
                this.setOptions({ fillColor: "#f6f6f6" });
            });
            google.maps.event.addListener(poly, "mouseout", function () {
                this.setOptions({ fillColor: lhecolour });
            });
            return;
        };
        if (CodeType.toUpperCase() == "LHE") {
            lhePolys.push(poly)
            
        };
        if (CodeType.toUpperCase() == "REGION") { regionPolys.push(poly) };
    }

    // TO DO change this method for Google interface
    //  return object of newly added polygon on map
    function newGooglePolyObj(polygonCoord, lhecolour, CodeType, CodeId, fillOpacity) {
        return new google.maps.Polygon({
            paths: polygonCoord,
            map: map,
            indexID: CodeId,
            strokeColor: lhecolour,
            strokeOpacity: 1,
            strokeWeight: -1,
            fillColor: lhecolour,
            fillOpacity: fillOpacity
        });
    }

   


    this.setMapCenter = function ()
    {
        
        if (gMapSrv.mapOptions.center!=null)
            {
            //var center = new google.maps.LatLng(gMapSrv.mapOptions.center.lat, gMapSrv.mapOptions.center.lng);
            var myLatLng = { lat: gMapSrv.mapOptions.center.lat, lng: gMapSrv.mapOptions.center.lng };
                //map.setCenter = myLatLng;
         //   alert(myLatLng);
            map.setCenter(myLatLng);

            }
    }

    this.setMapZoom = function () {

        if (gMapSrv.mapOptions.zoom > 0) {
            map.setZoom(6);
            map.setZoom(gMapSrv.mapOptions.zoom);
        }
    }


    //this.setMapPos = function (zoom, mapcenter, poly, lhecolour) {
    //    var mZoom;
    //    if (mapcenter == '') { mapcenter = gMapSrv.lastPoly.center; }
    //    var CodeType = gMapSrv.lastPoly.codetype;

    //    if (CodeType == "Region") {
    //        mZoom = 7;
    //    }
    //    if (CodeType == "LHE") {

    //        lhePolys.push(poly);
    //        mZoom = 8;

    //    }
    //    else if (CodeType == "CCG") {
    //        mZoom = 10;
    //    }


    //    if (zoom !== 0)
    //    {
    //        mZoom = zoom
    //    }

    //    try {
    //        map.setZoom(mZoom);
    //        map.setCenter(mapcenter);
    //    }
    //    catch (exception) { }

    //}



    this.clearMapObjects = function (obj) {
        for (var i = 0; i < obj.length; i++) {
            obj[i].setMap(null);
        }
        obj = [];
    }

    var icon = function (orgcolor)
    {
        return {
            path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            strokeColor: orgcolor,
            scale: 3
        };
    }


    this.addMarker = function (myLatLng, orgname, orgcolor) {

        markers.push(
         new google.maps.Marker({
             position: myLatLng,
             map: map,
             title: orgname,
             icon:icon(orgcolor)
             })
         );

        markers[markers.length - 1].addListener('click', function () {
            infowindow.open(map, markers[markers.length - 1]);
        });


    };


    function concatinateCoordinats(objPoly) {
        var polygonCoord = [];
        for (var i = 0; i < objPoly.length; i++) {
            polygonCoord.push(objPoly[i].Coordinates);
        };
        return polygonCoord;
    }

    function mapLabel(opt_options) {
        // Initialization
        this.setValues(opt_options);

        // Label specific
        var span = this.span_ = document.createElement('span');
        span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
        'white-space: nowrap; border: 1px solid blue; ' +
        'padding: 2px; background-color: white';
        var div = this.div_ = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';
    };




    mapLabel.prototype = new google.maps.OverlayView;
    
    mapLabel.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    };
    mapLabel.prototype.onAdd = function () {
        var pane = this.getPanes().overlayImage;
        pane.appendChild(this.div_);


        // Ensures the label is redrawn if the text or position is changed.

    };

    // Implement draw
    mapLabel.prototype.draw = function () {
        var projection = this.getProjection();
        var position = projection.fromLatLngToDivPixel(this.get('position'));
        var div = this.div_;

        div.id = "maplbl_" + this.get('text').toString();
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        div.style.display = 'block';
        this.span_.innerHTML = this.get('text').toString();
    };




    return gMapSrv;






}]);