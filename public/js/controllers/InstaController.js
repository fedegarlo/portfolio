(function(){
  var app=angular.module("myApp");

var InstaCtrl = function($scope, $http, $timeout){

    var tempFilterText = '',
        filterTextTimeout;
        $scope.q = 'starwars';

    $scope.$watch('q', function (val) {
      if (filterTextTimeout) $timeout.cancel(filterTextTimeout);

      tempFilterText = val;
      filterTextTimeout = $timeout(function() {
        if (tempFilterText) {
          $http.get('/tag/' + tempFilterText).success( function(response) {
              $scope.works = response; 
           });
        }
      }, 1000); 
  });

  $( document ).ready(function() {
    $('#input-main').focus();
    $('#input-main').blur(function () {
      if ($('#input-main').val()) {
        $(this).parents('span').addClass('inputFilled');
      } else {
        $(this).parents('span').removeClass('inputFilled');
      }
    });
  });

};

app.controller("InstaController",["$scope", "$http", "$timeout", InstaCtrl]);

}());
