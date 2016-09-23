app.controller('mainLheSubjectAreaCtrl', ["$scope", "$location", "$routeParams", "$rootScope", "jsondata", "lheHierarchySrv",
    function($scope, $location, $routeParams, $rootScope, jsondata, lheHierarchySrv) {

        var selectedLhe = null;
        $scope.message = "@test_mainLheSubjectAreaCtrl";

        lheHierarchySrv.loadHierarchyTree();

        $rootScope.$on('HierarchyTreeLoaded', function() {
            $scope.initLheBySubjectArea();
        });

        // Init Method called by GetData after loading all hiearchy.js to load the page  
        $scope.initLheBySubjectArea = function() {
            $scope.treedata = lheHierarchySrv.treedata;
            lheHierarchySrv.fillRegionsColors();
            lheHierarchySrv.setLheLabelsforAllRegions();
            lheHierarchySrv.pinAllKPIProviders();
        }

        $rootScope.$on('JSONKPILoaded', function() {
            $scope.kpiorg = lheHierarchySrv.JSONKPI;
        });

        // Init
        jsondata.GetData('json/all_hierarchy.js', $scope.initLheBySubjectArea);

        $scope.selectLHE = function(selectedNode) {
            if (selectedLhe && selectedNode.ID == selectedLhe.ID) {
                return false;
            }
            $scope.documents = null;
            selectedLhe ? selectedLhe.active = false : '';
            selectedLhe = selectedNode;
            lheHierarchySrv.selectedLhe = selectedLhe;
            lheHierarchySrv.selectLhe(selectedLhe);
            $rootScope.$broadcast('CTrefreshData');
            selectedLhe.active = true;
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
    }
]);