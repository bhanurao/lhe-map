/// <reference path="../views/subjectarea.html" />

app.controller('subjectAreaCtrl', [
    "$scope", "$location", "$routeParams", "$rootScope", "lheHierarchySrv",

    function($scope, $location, $routeParams, $rootScope, lheHierarchySrv) {

        $scope.getColorClass = function(sval, coltype) {
            var classname;
            if (sval.trim == "-" || sval.trim == '') {
                return "WHITE";
            }

            if (isNaN(sval) || !parseFloat(sval)) {
                return "WHITE";
            }

            classname = "WHITE";
            var svalue = sval * 100;

            switch (coltype) {
                case "AE":
                    if (svalue < 95) {
                        classname = "RED";
                    } else {
                        //alert(svalue);
                        //classname = "GREEN";
                        classname = "GREEN";
                    }
                    break;
                case "RTT":
                    if (svalue < 92) {
                        classname = "RED";
                    } else {
                        classname = "GREEN";
                    }

                    break;
                case "BO":
                    if (svalue < 85) {
                        classname = "GREEN";
                    } else if (svalue > 85 && svalue <= 90) {
                        classname = "ORANGE";

                    } else {
                        classname = "PINK";
                    }

                    break;
                case "DTO":
                    if (svalue < 2)
                        classname = "GREEN";
                    else if (svalue > 2 && svalue <= 3) {
                        classname = "ORANGE";

                    } else {
                        classname = "PINK";
                    }
                    break;

                    //default:
                    //    if (svalue < 2)
                    //        classname = "GREEN";
                    //    else if (svalue > 2 && svalue <= 3) {
                    //        classname = "ORANGE";

                    //    } else {
                    //        classname = "PINK";
                    //    }

            }
            //    alert(svalue +"-"+ classname);
            return classname;

        }

        var setSelectedProviderKPI = function(lhecode) {
            selectedproviderKPIs = [];
            angular.forEach(lheHierarchySrv.JSONKPI, function(e) {
                if (e["Col_1"] == lhecode) {
                    selectedproviderKPIs.push(e);
                }
            });

            $scope.selectedproviderKPIs = selectedproviderKPIs;
        }

        $scope.closeKpi = function() {
            $scope.chk1 = false;
            $scope.chk2 = false;
            $scope.chk3 = false;
            $scope.chk4 = false;
        }
        $rootScope.$on('CTrefreshData', function() {
            $scope.selectedLHE = lheHierarchySrv.selectedLhe;
            $scope.providerkpiHeader = lheHierarchySrv.JSONKPI[0];
            setSelectedProviderKPI($scope.selectedLHE.ID);
        });

    }
]);