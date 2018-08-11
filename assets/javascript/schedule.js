
 /* global moment firebase */
 $(document).ready(function () {
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAEqDoedQVbO4ioyHlRsr5Ot3PKPhyFX2Q",
    authDomain: "train-time-2-fca49.firebaseapp.com",
    databaseURL: "https://train-time-2-fca49.firebaseio.com",
    projectId: "train-time-2-fca49",
    storageBucket: "train-time-2-fca49.appspot.com",
    messagingSenderId: "278690566090"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();

  $("#submit-train").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#frequency").val().trim();

    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });


  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function (childSnapshot) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % newFreq;

    // Minute(s) Until Train
    var tMinutesTillTrain = newFreq - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $("#all-display").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');

    // Clear input fields
    $("#trainName, #destination, #firstTrain, #frequency").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); //end document ready
