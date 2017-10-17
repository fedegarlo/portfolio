(function(){
angular.module("myApp").factory('statsService', ['$http', function($http){

  var o = {
  	stats : []
  },
  url = 'http://salva-api-salva.a3c1.starter-us-west-1.openshiftapps.com/';
  o.getStats = function() {
    return $http.get(url + 'stats').then(function(res){
			angular.copy(res.data, o.stats);
		});
  };

  return o;
}]);

}());