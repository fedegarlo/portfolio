(function(){
  var app=angular.module("myApp");

var SalvaCtrl = function($scope, $http, $window, salvaService){

  $scope.user = {};
  $scope.mailSended = false;
  $scope.resetCompleted = false;
  $scope.formError = false;
  var regExp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

  $scope.save = function (user) {
    if (user.email && user.email.match(regExp)) {
      $scope.formError = false;
      salvaService.recover(user.email).success(function(data){
      console.log('mail sended');
        $scope.mailSended = true;
      });
      console.log('its an email');
    } else {
      $scope.formError = true;
    }
  };

  $scope.reset = function (user) {
    if (user.password1 && (user.password1 === user.password2)) {
      user.token = $window.location.href.replace(/.*\//, '');
      $scope.formError = false;
      $scope.serviceError = false;
      salvaService.reset(user).then(function(data){
      console.log('reset completed');
        $scope.resetCompleted = true;
      }).catch(function(){
        $scope.serviceError = true;
      });
    } else {
      $scope.formError = true;
    }
  };

  $( document ).ready(function() {
    $('#input-main').focus();
    $('input').blur(function (ev) {
      if ($(this).val()) {
        $(this).parents('span').addClass('inputFilled');
      } else {
        $(this).parents('span').removeClass('inputFilled');
      }
    });
  });

};

app.controller("SalvaController",["$scope", "$http", "$window", "salvaService", SalvaCtrl]);

}());
