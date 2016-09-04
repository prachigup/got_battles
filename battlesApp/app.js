var app = angular.module('GotBattlesApp',['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
        var viewBase = '/battlesApp/views/';

        $routeProvider
            .when('/list', {
                controller: 'ListCtrl',
                templateUrl: viewBase + 'list.html'
            })
            .when('/count', {
                controller: 'CountCtrl',
                templateUrl: viewBase + 'count.html'
            })
            .when('/stats', {
                controller: 'StatsCtrl',
                templateUrl: viewBase + 'stats.html'
            })
            .otherwise({ redirectTo: '/list' });
    }]);
