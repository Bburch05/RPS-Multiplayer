
var config = {
    apiKey: "AIzaSyD2dxUfttvFU6ZF8ORVFYELFrKalcUtO5c",
    authDomain: "rpsmulti-50281.firebaseapp.com",
    databaseURL: "https://rpsmulti-50281.firebaseio.com",
    projectId: "rpsmulti-50281",
    storageBucket: "rpsmulti-50281.appspot.com",
    messagingSenderId: "886910899223"
  };
  firebase.initializeApp(config);
// Database Refs
var database = firebase.database();
var playerRef = database.ref("/players")
var chatRef = database.ref("/chat")
var selfPlayerRef = database.ref("/players/" + playerNum)
var play1Ref = database.ref("/players/1")
var play2Ref = database.ref("/players/2")

//Global Vars
var turn = 1 
var players = 0
var playerNum = null;
var player
var pName


database.ref().on("value", function(snapshot){
  turn = snapshot.val().turn
});

playerRef.on("child_added", function(snapshot){
 console.log("Connected:" + snapshot.val().name)
});

playerRef.on("child_removed",function(snapshot){
  console.log(snapshot.val())
  chatRef.push({
    name : snapshot.val().name,
    message: snapshot.val().name + " has disconnected"
  })
  
  turn = 1
  database.ref().set({
    turn : turn
  })
});


chatRef.on("child_added",function(snapshot){
  if(snapshot.val().name === pName){
    $(".chat").append("<p class='yourMsg'>"+ snapshot.val().name + " : " + snapshot.val().message + "</p>");
    console.log("stuff")
  }

  else{
  $(".chat").append("<p>"+ snapshot.val().name + " : " + snapshot.val().message + "</p>");
  console.log("stuff")
  }
})

var player1 = {
  wins : 0,
  losses : 0,
  ties : 0,
  games : 0,
  choice : null,
  hasChoice : false,
  div : $(".player1")
}

var player2 = {
  wins : 0,
  losses : 0,
  ties : 0,
  games : 0,
  choice : null,
  hasChoice : false,
  div : $(".player2")
}


$("#name-entry").on("click", function(){
  event.preventDefault();
  pName = $("#name").val();

var p1Exist = false;
var p2Exist = false;
  database.ref("/players/2").on('value', function(snapshot) {
    if (snapshot.exists()){
      p2Exist = true;
    }});
  database.ref("/players/1").on('value',function(snapshot){
    if(snapshot.exists()){
      p1Exist = true;
    }});

  if (!p1Exist && !playerNum){
    playerNum = 1
    var player1x = play1Ref.set({
      name : pName,
      wins : 0,
      losses : 0,
    })
    // play1Ref.onDisconnect().remove();
  }
  else if (!p2Exist){
    playerNum = 2
    var player2x = play2Ref.set({
      name : pName,
      wins : 0,
      losses : 0
    })
    // play2Ref.onDisconnect().remove();
  }
  
});

$("#chat-add").on("click", function(){
  event.preventDefault();
  if(pName){
    var yourMessage = $("#chat-text").val();
    chatRef.push({
      name : pName,
      message : yourMessage
    })
  }
})

$(player1.div).on("click", ".selectRPS", function(){
  if (playerNum === 1){
  var select = $(this).attr("data-rps");
  player1.choice = select;
  player1.hasChoice = true;
  RPSshoot();
  }
});

$(player2.div).on("click", ".selectRPS", function(){
  if (playerNum === 2){
  var select = $(this).attr("data-rps");
  player2.choice = select;
  player2.hasChoice = true;
  RPSshoot();
  }
});

      // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
  function RPSshoot(){
    turn++;
        database.ref().set({
          turn: turn
        })
      if ((player1.hasChoice) && (player2.hasChoice)) {

        if ((player1.choice === "r") && (player2.choice === "s")) {
          player1.wins++;
          player2.losses++;
        } else if ((player1.choice === "r") && (player2.choice === "p")) {
          player1.losses++;
          player2.wins++;
        } else if ((player1.choice === "s") && (player2.choice === "r")) {
          player1.losses++;
          player2.wins++;
        } else if ((player1.choice === "s") && (player2.choice === "p")) {
          player1.wins++;
          player2.losses++;
        } else if ((player1.choice === "p") && (player2.choice === "r")) {
          player1.wins++;
          player2.losses++;
        } else if ((player1.choice === "p") && (player2.choice === "s")) {
          player1.losses++;
          player2.wins++;
        } else if (player1.choice === player2.choice) {
          ties++;
        }
        player1.choice = null;
        player1.hasChoice = false;
        player2.choice = null;
        player2.hasChoice = false;
      }

      };