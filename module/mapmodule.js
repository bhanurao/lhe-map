var app = angular.module('myApp', [ 'ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider',
 function ($routeProvider) {
     $routeProvider.
       otherwise({
           templateUrl: '../SPdeploy/views/subjectArea.html',
           controller: 'subjectAreaCtrl'
       });
 }]);


app.filter('capitalize', function () {
    return function (input) {
        return (input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.filter('monitorAnalysespacks', function () {
    return   function (input) {
        return input.substring(0, input.indexOf("-")).trim() + "-" + input.substring(input.indexOf("FY"), input.length).trim();
    }
});

app.filter('monitorAnalysespacksSp13', function () {
    return function (input) {
        return input.substring(9, input.indexOf("-")).trim() + "-" + input.substring(input.indexOf("FY"), input.length).trim();
    }
});

app.filter('monitorKpiHeadingFormat', function () {
    return function (input) {
        return input.substring(input.indexOf("-")+1,input.length).trim();
    }
});

app.filter('monitorKpiPercentageFormat', function () {
    return function (input)
    {
        
        var newvalue = parseInt(parseFloat(input) * 100);
        return isNaN(newvalue) ? "-" : newvalue + '%' ;
    }
});

app.directive('draggable', ['$document',  function ($document ) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var startX, startY, initialMouseX, initialMouseY;
            elm.css({ position: 'absolute' });
 
            elm.bind('mousedown', function ($event) {
                startX = elm.prop('offsetLeft');
                startY = elm.prop('offsetTop');
                initialMouseX = $event.clientX;
                initialMouseY = $event.clientY;
                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);
                return false;
            });

            function mousemove($event) {
                var dx = $event.clientX - initialMouseX;
                var dy = $event.clientY - initialMouseY;
                elm.css({
                    top: startY + dy + 'px',
                    left: startX + dx + 'px'
                });
                return false;
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    };
}]);
