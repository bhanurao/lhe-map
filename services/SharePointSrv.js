
app.factory('sharePointSrv', ['$rootScope', '$http',
  function ($rootScope, $http) {
      var sharePointSrv = {};
      sharePointSrv = this;
      //utility function to get parameter from query string
      this.getQueryStringParameter = function (urlParameterKey) {
          var params = document.URL.split('?')[1].split('&');
          var strParams = '';
          for (var i = 0; i < params.length; i = i + 1) {
              var singleParam = params[i].split('=');
              if (singleParam[0] == urlParameterKey)
                  return singleParam[1];
          }
      }

      //this.appWebUrl = decodeURIComponent(this.getQueryStringParameter('SPAppWebUrl')).split('#')[0];
      this.appWebUrl = '';
      //this.hostWebUrl = decodeURIComponent(this.getQueryStringParameter('SPHostUrl')).split('#')[0];

      //form digest opertions since we aren't using SharePoint MasterPage
      var formDigest = null;
      this.ensureFormDigest = function (callback) {
          if (formDigest != null)
              callback(formDigest);
          else {
              $http.post(sharePointSrv.appWebUrl + '/_api/contextinfo?$select=FormDigestValue', {}, {
                  headers: {
                      'Accept': 'application/json; odata=verbose',
                      'Content-Type': 'application/json; odata=verbose'
                  }
              }).success(function (d) {
                  formDigest = d.d.GetContextWebInformation.FormDigestValue;
                  callback(formDigest);
              }).error(function (er) {
                  alert('Error getting form digest value');
              });
          }
      };





      this.getData = function (callback, query) {
          
          $http({
              method: 'GET',
              url: query,
              headers: {
                  'Accept': 'application/json; odata=verbose'
              }
          }).success(function (d) {

              callback(d.d.results);

          }).error(function (er) {
              alert('error:- ' + er.error.message.value);
          });


      };



      this.GetListData = function (query, callback1) {

          
          if (callingmethodid == 'alert_query') {
              alert(query);
          }
          // alert(query);
          $http({
              method: 'GET',
              url: query,
              headers: {
                  'Accept': 'application/json; odata=verbose'
              }
          }).success(function (d) {
              callback1(d.d.results);

          }).error(function (er) {
              alert('Error!  orgin From:' + callingmethodid + ' - Desc:' + er.error.message.value);
          });


      };


      return this;
  }]);