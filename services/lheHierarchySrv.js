/// <reference path="../json/Providorjson.Js" />
/// <reference path="../json/Providorjson.Js" />
app.factory('lheHierarchySrv', ['$rootScope', '$location', '$routeParams', 'jsondata','gMapSrv',
function ($rootScope, $location, $routeParams, jsondata, gMapSrv ) {
      var lheHierarchySrv = {};
      
      lheHierarchySrv = this;

      this.treedata = {};
      this.message = "@test_this" + jsondata.message;
      this.selectedLhe = {};
      this.selectedRegion = {};
      this.lhepolys = {};
      this.counter=0;
      this.JSONProvider = [];
      this.JSONKPI = [];
      this.mapPosition = {}; 

      this.selectedLHEFillColor = "red"; 
      
    //  this.getAllRegions = function ()
    //  {
    //      var regions ={} ; 
    //      angular.forEach(this.treedata, function (e)
    //      {
    //          var _centerPos =getCenterPoint(e); 
    //          regions.push({ID:e.ID, Name:e.Name ,CenterPos:_centerPos});
    //      });
    //  }

    //// TODO get the value from new JSON file
    //  this.getCenterPoint= function(e)
    //      {
    //        return e.Id
    //      }



      this.loadHierarchyTree = function () {
          jsondata.GetData('json/all_hierarchy.js', callback_loadHierarchyTree);
      }



      this.fillRegionsColors = function () {
          angular.forEach(this.treedata, function (region) {
              lheHierarchySrv.addPolygon(region.ID, region.Colour, region.CodeType, ".2");
          });
      }
    
    
      this.selectRegion = function (region) {
          lheHierarchySrv.addPolygon(region.ID, region.Colour, region.CodeType, ".2");
      }


   
      function callback_loadHierarchyTree(data)
      {
          lheHierarchySrv.treedata = data;
          $rootScope.$broadcast('HierarchyTreeLoaded');

      }

    // select Speccific LHE 
      this.selectLhe = function (lhe) {

          // remove the poly which have been already selected 
          gMapSrv.clearMapObjects(selectedPolys);
          //Set the mapOptions before 
          var position = lheHierarchySrv.getLheCenterAndZoomValues(lhe); 
          gMapSrv.mapOptions.center = {lat:position.lat, lng: position.lng};
          gMapSrv.mapOptions.zoom = position.zoom;
          lheHierarchySrv.addPolygon(lhe.ID, lheHierarchySrv.selectedLHEFillColor, lhe.CodeType, ".2");
       
      }


      this.removeRegionsColors= function()
      {
          gMapSrv.clearMapObjects(regionPolys);
      }


      this.clearLhePolys = function ()
      {
          gMapSrv.clearMapObjects(this.lhepolys);
      }
            

      this.removeLabels =function()
      {
          gMapSrv.clearMapObjects(labels);
      }
       

    /// Set all the labels for the region 

      this.setLHELabels = function (region)
      {
          angular.forEach(region.SubMappingHierarchy, function (lhe) {
              var postion  = lheHierarchySrv.getLheCenterAndZoomValues(lhe)
              gMapSrv.setLabel(lhe.ID, postion.lat, postion.lng);
          });
      }


      this.getLheCenterAndZoomValues = function (lhe)
      {
          var key = "lheCode";
          var array = lhelatlng;
          var value = lhe.ID; 
          return lheHierarchySrv.getJsonObjectbyKey(key, value, array);
      }


      this.getRegionCenterAndZoomValues = function (region) {
          var key = "ID";
          var array = regionlatlng;
          var value = region.ID;
          return lheHierarchySrv.getJsonObjectbyKey(key, value, array);
      }

    // TODO set the gMapSrv.mapOptions here before calling the addPolygon
      this.selectLHEByRegion = function (region) {
          // clear the other region poly selection;
          gMapSrv.clearMapObjects(lhePolys);
          // clear any selected poly
          gMapSrv.clearMapObjects(selectedPolys);
          // Start rendering the polys

          var position = lheHierarchySrv.getRegionCenterAndZoomValues(region);
          gMapSrv.mapOptions.center = { lat: position.lat, lng: position.lng };
          gMapSrv.mapOptions.zoom = position.zoom;

          angular.forEach(region.SubMappingHierarchy, function (lhe) {
              lheHierarchySrv.addPolygon(lhe.ID, lhe.Colour, lhe.CodeType, ".3");
          });
      }
        


      this.addPolygon = function (scode, scolour, codeType, fillOpacity, showlabel) {
          var query = 'json/' + codeType + '/' + scode + '.js';
          jsondata.GetData(query, gMapSrv.addPolygonToMap, scolour, codeType, scode, fillOpacity, showlabel);
      }




      this.setRegionLabels = function () {

          angular.forEach(this.treedata, function (region) {
              var postion = lheHierarchySrv.getRegionCenterAndZoomValues(region);
              gMapSrv.setLabel(region.Name, postion.lat, postion.lng);
          });
      }


      this.setLheLabelsforAllRegions = function()
      {
          angular.forEach(this.treedata, function (region) {
              lheHierarchySrv.setLHELabels(region);
          });
      }
    

      this.pinAllKPIProviders = function ()
      {
          // load json providers coordinates 
          // load json providers , where KPI is provided 
          jsondata.GetData('json/Providorjson.js', lheHierarchySrv.setProviderMarkers, 'providerjson');
          jsondata.GetData('json/subjectareakpijson.js', lheHierarchySrv.setProviderMarkers, 'subjectareakpijson');

          
      }

      this.loadJsonKpi = function ()
      {
          jsondata.GetData('json/subjectareakpijson.js', callback_setJSONKPI);
      }


      function callback_setJSONKPI(data)
      {
          lheHierarchySrv.JSONKPI = data; 
          $rootScope.$broadcast('JSONKPILoaded');
      }

      this.setProviderMarkers = function(data,dataFrom)
      {
          dataFrom == 'providerjson' ? lheHierarchySrv.JSONProvider = data : lheHierarchySrv.JSONKPI = data;

         // Ensure data from both is available
         // alert(datafrom + " legth: JSPONKPI :-" + lheHierarchySrv.JSONKPI.length + " legth: JSPONProvider :-" + lheHierarchySrv.JSONProvider.length);
          if (lheHierarchySrv.JSONProvider.length > 0 && lheHierarchySrv.JSONKPI.length > 0)
          {
              $rootScope.$broadcast('JSONKPILoaded');
              angular.forEach(lheHierarchySrv.JSONKPI, function (e) {
                  // Pass ORG code, to get 
                  var providercoord = getProviderCoordinates(e["Col_3"]);
                  if (providercoord != null)
                  {
                      gMapSrv.addMarker(providercoord, providercoord.title, "green");
                  }
                  
              });

          }
      }
      
      function getProviderCoordinates(code) {
          var lat;
          var lng;
          var title;

          angular.forEach(lheHierarchySrv.JSONProvider, function (e) {
              if (e["NHS_Code"] == code) {
                  lat = parseFloat(e['Lat']);
                  lng = parseFloat(e['Lang']);
                  title = e['Name'];
              }
          });
          if (lat != NaN && lng != NaN) {
              return { lat: lat, lng: lng, title: title };
          }

      }

      this.getJsonObjectbyKey = function (key,value, objectarray) {
          var objarray = {};
          angular.forEach(objectarray, function (e) {
              if (e[key] == value) {
                  objarray = e;
                  return objarray;
              }
          });
          return objarray;
      }
     

      this.getJsonObject =function(id,objectarray)
      {
          var objarray = {};
          angular.forEach(objectarray, function (e) {
              if (e.ID == id)
              {
                  objarray = e;
                  return objarray;
              }
          });
          return objarray;
      }
        
      
      return lheHierarchySrv;
  }]);