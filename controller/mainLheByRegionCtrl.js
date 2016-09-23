app.controller('mainLheByRegionCtrl', ["$scope", "$routeParams", "$rootScope", "lheHierarchySrv", "dataAcessService", "jsondata", "sharePointSrv",
    function($scope, $routeParams, $rootScope, lheHierarchySrv, dataAcessService, jsondata, sharePointSrv) {
        var me = this;
        var selectedLHE = null;
        var selectedRegion = null;
        $scope.message = "@test_mainLheByRegionCtrl";

        // Call to Get the Json data
        lheHierarchySrv.loadHierarchyTree();
        lheHierarchySrv.loadJsonKpi();

        $rootScope.$on('HierarchyTreeLoaded', function() {
            $scope.initLheByRegion();
        });

        ///////////////// 
        // invoke map method
        $scope.initLheByRegion = function(data) {
            $scope.treedata = lheHierarchySrv.treedata;
            lheHierarchySrv.fillRegionsColors();
            lheHierarchySrv.setRegionLabels();
        }

        $rootScope.$on('JSONKPILoaded', function() {

            $scope.kpiorg = lheHierarchySrv.JSONKPI;
        });

        $scope.selectRegion = function(region) {

            if (selectedRegion && region.ID == selectedRegion.ID) {
                return false;
            }

            selectedRegion ? selectedRegion.open = false : '';
            selectedRegion = region;
            selectedRegion.open = true;
            lheHierarchySrv.removeLabels();
            lheHierarchySrv.removeRegionsColors();

            //lheHierarchySrv.selectRegion(region);
            lheHierarchySrv.selectLHEByRegion(region);
            lheHierarchySrv.setLHELabels(region);
        }

        $scope.selectLHE = function(selectedNode) {
            if (selectedLHE && selectedNode.ID == selectedLHE.ID) {
                return false;
            }
            $scope.documents = null;
            selectedLHE ? selectedLHE.active = false : '';
            selectedLHE ? selectedLHE.docloaded = false : '';
            selectedLHE = selectedNode;
            lheHierarchySrv.selectLhe(selectedLHE)
            selectedLHE.active = true;
            $scope.getDocuments(selectedLHE);
        }

        var renderDocumentTable = function(data) {
            $scope.documents = data;
            selectedLHE.docloaded = true;
        }

        $scope.getDocuments = function(lhe) {
            var lheCode = lhe.ID;
            var query = "/_api/web/Lists/getbytitle('LHEData')/items?$select=Title,EncodedAbsUrl,FieldValuesAsText/FileRef,Created&$expand=FieldValuesAsText&$filter=LHECode eq '" + lheCode + "'&$orderby=Created desc";
            sharePointSrv.getData(renderDocumentTable, query);
        }

        $scope.orgSelectedFromSearchBox = function(org) {
            var found = false;
            angular.forEach($scope.treedata, function(region) {
                angular.forEach(region.SubMappingHierarchy, function(lhe) {
                    if (lhe.ID == org.Col_1) {
                        found = true;
                        $scope.selectLHE(lhe);
                        region.open = true;
                    }
                    if (found) return;
                });
                if (found) return;
            });
        }

        $scope.lheHierarchySrv_message = lheHierarchySrv.message;

    }
]);