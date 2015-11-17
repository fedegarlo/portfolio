(function() {
  var myApp = angular.module("myApp", ['ngRoute', 'ngL20n']);

myApp.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'html/home.html',
            controller: 'MainController'
        }).when('/instagram', {
            templateUrl: 'html/instagram.html',
            controller: 'InstaController'
        }).otherwise({
        redirectTo : '/home'         
        }
    )
    }).run(['$rootScope', 'documentL10n', 'l20n', function ($rootScope, documentL10n, l20n) {
            $rootScope.l20nId = 'objectsWithCount';
            $rootScope.data = {
                objectsNum: 102,
                testNumber: 0,
            };

            function setObjectsNum(number) {
                l20n.updateData({
                    objectsNum: number,
                });
            }

            $rootScope.$watch('data.objectsNum', function (newValue) {
                setObjectsNum(parseInt(newValue, 10) || 0);
            });

            documentL10n.ready(function () {
                setObjectsNum(parseInt($rootScope.data.objectsNum, 10) || 0);
            });
        }]);

}());