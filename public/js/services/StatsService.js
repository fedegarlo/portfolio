(function(){
angular.module("myApp").factory('statsService', ['$http', function($http){

  var o = {
  	stats : []
  },
  url = 'https://salva-api.herokuapp.com/';
  o.getStats = function() {
    return $http.get(url + 'stats').then(function(res){
			angular.copy(res.data, o.stats);
		});
  };

  return o;
}]);

}());