(function(){
angular.module("myApp").factory('statsService', ['$http', function($http){

  var o = {
  	stats : []
  },
  url = 'http://gitlab-watcher-salva-watcher.7e14.starter-us-west-2.openshiftapps.com/';
  o.getStats = function() {
    return $http.get(url + 'stats').then(function(res){
			angular.copy(res.data, o.stats);
		});
  };

  return o;
}]);

}());