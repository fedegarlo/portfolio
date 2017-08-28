(function(){
angular.module("myApp").factory('salvaService', ['$http', function($http){

  var o = {},
  url = 'http://salva-api-salva.a3c1.starter-us-west-1.openshiftapps.com/';
  o.recover = function(email) {
    return $http.post(url + 'recover', { email : email });
  };

  o.reset = function(user) {
    return $http.post(url + 'changepassword', { password1 : user.password1, password2 : user.password2, token : user.token });
  };

  return o;
}]);

}());