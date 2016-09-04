angular.module('GotBattlesApp').controller('StatsCtrl', ['$scope', '$http', StatsCtrl]);

function StatsCtrl($scope, $http){
	$scope.stats = {};
	var baseUrl = '/data/got_battles/';

	var _init = function _init(){
		return $http.get(baseUrl + 'stats' ).then(
	            function (results) {
	                $scope.stats = results.data;
	            });
	}

	_init();
}
