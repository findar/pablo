

angular.module('pablo').controller('fetch', function($scope, $http, $log){
    $scope.fetch = function(server){
        if(server) {
            var url = '/api/eat/' + server.token;
            $http.get(url).
                success(function(data) {
                    console.log(data);
                    //Lets do something with this
                });
        }
    };
});