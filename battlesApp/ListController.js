angular.module('GotBattlesApp').controller('ListCtrl', ['$scope', '$http', ListCtrl]);

function ListCtrl($scope, $http){

	$scope.list = [];
	var baseUrl = '/data/got_battles/';

	var _init = function _init(){
		return $http.get(baseUrl + 'list' ).then(
	            function (results) {
	                $scope.list = results.data;
	            });
	}

	_init();

}
