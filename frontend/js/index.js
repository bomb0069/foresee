// Generated by CoffeeScript 1.4.0
var validateRoomName;

validateRoomName = function(roomName) {
  if (roomName === "") {
    return false;
  } else {
    return true;
  }
};


app.controller("foresee.moderator.LoginCtrl", function($scope, $location) {
    $scope.roomName = "";

    $scope.createRoom = function() {
        if (validateRoomName($scope.roomName)) {
          $location.path("host/" + encodeURIComponent($scope.roomName));
          $scope.modMsg = "";
        } else {
          $scope.modMsg = ("room name must not blank.");
        }
    }
});
