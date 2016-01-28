app.factory('dataAcessService', ['$rootScope', '$http',
  function ($rootScope, $http) {
      var dataAcessService = {};
      var _datasets = [];
    

      dataAcessService.test = function (Id) {
          alert(Id);
      }

      dataAcessService.AddDataset = function (data, id) {
          if (id == '') {
              return;
          }
          else {
              _datasets.push({ id: id, data: data });
          }
      }

      dataAcessService.GetDataset = function (id) {
          var _retstatus = false;
          var _dataarray;
          if (id == '') {
              return _retstatus;
          }

          angular.forEach(_datasets,function (e) 
          {
              if (e['id'] == id) {
                  _dataarray = e['data'];
                  _retstatus = true;
                  return _dataarray;
              }
          });
          return _dataarray;
      }


      return dataAcessService;
  }]);