app.factory('jsondata', ['$rootScope',   '$location', '$routeParams','$http',
  function ($rootScope, $location, $routeParams, $http) {
      var jsondata = {};
      jsondata.message = "@test_jsondata";
      jsondata.path = gpath;
      jsondata.GetData = function () {
          var _retstatus = false;
          var _data;
          var _arguments = arguments;
          var _path = jsondata.path;
          $http.get(_path+_arguments[0])
              .success(function (data) {
                  _data = data;
                  var paramstring = '';
                  if (_arguments.length > 2) {

                      for (var i = 2; i < _arguments.length; i++) {
                          paramstring += ",'" + _arguments[i] + "'";
                      }
                  }
               
                  eval('_arguments[1](_data' + paramstring + ')');
              })
            .error(function (message, e)
            {
               
            });
         
      }

      jsondata.mytest = function (fun, value) {
          alert(value);
          fun(value);
      }


      jsondata.getHttp = function (path)
      {
          return $http.get(jsondata.path + path);
          
      }
      return jsondata;
  }]);