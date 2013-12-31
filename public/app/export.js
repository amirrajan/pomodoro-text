var app = angular.module("App", []);

NgEnter.add(app);

app.controller("AppCtrl", function($scope, $http) {
  $scope.inbox = [];
  $scope.sorted = [];
  $scope.archived = [];

  $http({ method: 'GET', url: '/tags' })
    .success(function(tags) {
      $http({ method: 'GET', url: '/inbox' })
        .success(function(data) {
          _.each(data, function(d) {
            d.show = true;

            if(tags[d.id_str]) { d.tags = tags[d.id_str]; }
            else { d.tags = ""; }
          });

          $scope.inbox = data;
        });

      $http({ method: 'GET', url: '/sorted' })
        .success(function(data) {
          _.each(data, function(d) {
            d.show = true;

            if(tags[d.id_str]) { d.tags = tags[d.id_str]; }
            else { d.tags = ""; }
          });

          $scope.sorted = data;
        });

      $http({ method: 'GET', url: '/archived' })
        .success(function(data) {
          _.each(data, function(d) {
            d.show = true;

            if(tags[d.id_str]) { d.tags = tags[d.id_str]; }
            else { d.tags = ""; }
          });

          $scope.archived = data;
        });
    });
});
