angular.module('GotBattlesApp').controller('CountCtrl', ['$scope', '$http', CountCtrl]);

function CountCtrl($scope, $http){
	$scope.count = 0;
	var baseUrl = '/data/got_battles/';

	var _init = function _init(){
		return $http.get(baseUrl + 'count' ).then(
	            function (results) {
	                $scope.count = results.data.count.count;
	            });
	}

	_init();
}
