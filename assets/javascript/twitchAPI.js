// $.ajax({
//     url: 'https://api.twitch.tv/kraken/games/search?query=Fortnite',
//     headers: {
//         'Accept': 'application/vnd.twitchtv.v5+json',
//         'Client-ID': 'o31s0t9lor4pa6ix7id21wlfbilp67',
//         'Content-Type':'application/json'

//     },
//     method: 'GET',
//     success: function(data){
//         console.log('success: ' + data);
//     }
// });
$(document).ready(function() {
  var IGDBkey = "113cc591fdb770d986daf308ece73efb";
  var fullPageHTML = `
  
  <div class="cointainer header-back">
  <div class="row header">
    <div class="col-md-12">
      <nav class="navbar">
        <a class="navbar-brand" href="index.html">RPTV&trade;</a>
        <form class="form-inline my-2 search">
          <input
            type="search"
            class="form-control inputGame"
            id="search-input"
            placeholder="Insert Game Title"
            autocorrect="off"
            autofill="off"
          />
          <button class="submitButton"><i class="fa fa-search"></i></button>
        </form>
      </nav>
    </div>
  </div>
</div>
<div class="container-full content-back">
  <div class="row content">
    <div class="col-md-12">
      <div class="card mb-6">
        <div class="card-header">Twitch Stream</div>
        <div class="card-body twitch-video"></div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card mb-6">
        <div class="card-header">Latest Updates</div>
        <div class="card-body" id="tweet"></div>
      </div>
    </div>
  <div class="col-md-6">
      <div class="card mb-6">
        <div class="card-header">Overview</div>
        <div class="card-body description"></div>
      </div>
  </div>
 
      <div class="card mb-6 col-12 gameStatistic">
        <div class="card-header">Game Statistics</div>
        <div class="card-body">
          <iframe
            id="chart"
            src=""
            height="389px"
            width="100%"
            scrolling="no"
            frameborder="0"
          >
          </iframe>
        </div>
      </div>
      <div class = "col-md-12">
      <div class="card mb-6" id="review">
      <div class="card-header">Gamer Review</div>
            <div class="card-body">
                  <div id="comment-section"></div>
                  <form method="post">
                      <textarea id="comment" name="comments" placeholder="Leave your review"></textarea>
                      <input class="btn btn-default" type="submit" name="submit" id="com_sub">
                  </form>
            </div>
      </div>
      </div>
    </div>


<footer class="footer footer-background">
  <div class="footer-font">Copyright &copy;</div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://embed.twitch.tv/embed/v1.js"></script>
<script src="assets/javascript/twitchAPI.js"></script>
<script
  async
  src="https://platform.twitter.com/widgets.js"
  charset="utf-8"
></script>
`;

  var config = {
    apiKey: "AIzaSyC13Trr9-_jfMW6Cn95Q2STkWaS22uM8e4",
    authDomain: "gamehub-a8548.firebaseapp.com",
    databaseURL: "https://gamehub-a8548.firebaseio.com",
    projectId: "gamehub-a8548",
    storageBucket: "gamehub-a8548.appspot.com",
    messagingSenderId: "1068522789690"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var child;

  $(".submitButton").on("click", function(event) {
    console.log("IT UPDATED");
    event.preventDefault();
    var gameName = $(".inputGame").val();

    $("body").html(fullPageHTML);
    $("#com_sub").on("click", function(event) {
      event.preventDefault();

      var comment = $("#comment")
        .val()
        .trim();
      console.log(comment);

      child.push({
        comment: comment
      });
      $("#comment").val("");
      var comm = $("<p>");
      comm.text(comment);
      $("#comment-section").append(comm);
    });
    mainPage(gameName);
  });

  function mainPage(gameName) {
    runSearch(gameName);

    $(".submitButton").on("click", function(event) {
      event.preventDefault();
      gameName = $(".inputGame").val();
      runSearch(gameName);
    });
  }

  function runSearch(gameName) {
    //Have to empty the tweet to generate new one, otherwise twitter js won't work
    $("#comment-section").empty();
    $("#tweet").empty();
    getFullName(gameName);
  }
  function getFullNameTwitch(gameName) {
    $.ajax({
      url: `https://api.twitch.tv/kraken/search/games?client_id=o31s0t9lor4pa6ix7id21wlfbilp67&query=${gameName}&type=suggest`,
      method: "GET"
    }).then(function(data) {
      var gameID = data.games[0].name;
      var steamGame = gameID;
      gameID = gameID.replace(/\s/g, "%20");
      getStream(steamGame, gameID);
    });
  }
  function getFullName2(gameID) {
    var steamGame = gameID;
    gameID = gameID.replace(/\s/g, "%20");
    getFullNameTwitch(steamGame);
    showOverview(gameID);
    addComments(steamGame);
    showSteam(steamGame);
    console.log("Steam Game" + steamGame.trim());
  }
  function getFullName(gameName) {
    $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?search=${gameName}&fields=name&limit=25`,
      method: `GET`,
      headers: {
        "user-key": IGDBkey,
        accept: `application/json`
      }
    }).then(response => {
      console.log(response);
      showModal(response);
      showTwitter(gameName);
    });
  }
  function showModal(gameArray) {
    $(".gameChooseModal").remove();
    let gna = [];
    let gameNameArray = [];
    for (let returnGame of gameArray) {
      gna.push(returnGame.name);
      gameNameArray.push(returnGame.name);
    }

    gameNameArray.sort(function(a, b) {
      return a.length - b.length;
    });

    gameNameArray = gameNameArray.slice(0, 5);
    gna = gna.slice(0, 5);
    for (let piece of gameNameArray) {
      if (!inArray(piece, gna)) {
        gna.push(piece);
      }
    }

    let chooseModal = $("<div>");
    chooseModal.attr("class", "gameChooseModal");
    $(".row.content").attr("style", "display:none");
    $(".footer").attr("style", "display:none");
    $(".content-back").append(chooseModal);
    $(".content-back").attr("style", "background:rgb(0,0,0,.5);");

    for (let rGameName of gna) {
      console.log("game name: " + rGameName);
      let newDiv = $("<div>");
      newDiv.attr("value", `${rGameName}`);
      newDiv.html(`${rGameName}`);
      newDiv.attr(`class`, "gameOption");
      $(".gameChooseModal").append(newDiv);
    }
    $(".gameOption").on("click", event => {
      let gameSelect = event.currentTarget.textContent;
      console.log(event);

      console.log(gameSelect);
      $(".row.content").attr("style", "display:flex");
      $(".gameChooseModal").remove();
      $(".content-back").attr("style", "background:rgb(255,255,255);");
      $(".footer").attr("style", "display:flex");
      getFullName2(gameSelect.trim());
    });
  }
  function getStream(steamGame, gameID) {
    $.ajax({
      url: `https://api.twitch.tv/kraken/streams?client_id=o31s0t9lor4pa6ix7id21wlfbilp67&game=${gameID}&type=suggest`,
      method: "GET"
    }).then(function(data) {
      console.log(data);
      whichStream(data);
      $(".streamOption").on("click", function(event) {
        var streamVal = $(this).attr("value");
        var embedDiv = $("<div>");
        embedDiv.attr("id", "twitch-embed");
        var twitchStream = embedDiv;
        $(".twitch-video").html(twitchStream);

        var embed = new Twitch.Embed("twitch-embed", {
          width: 426 * 1.2,
          height: 240 * 1.2,
          layout: "video",
          theme: "dark",
          channel: data.streams[streamVal].channel.display_name
        });

        embed.addEventListener(Twitch.Embed.VIDEO_READY, function() {
          console.log("YAY");
        });
      });
    });
  }
  function whichStream(data) {
    var topFive = [];
    let streamHeader = $("<div>");
    streamHeader.attr("style", "font-size:30px;color:white;margin:5px");
    streamHeader.html("Select Stream:");
    $(".twitch-video").html("");

    $(".twitch-video").append(streamHeader);

    for (var i = 0; i < 5; i++) {
      topFive.push(data.streams[i].channel.display_name);
      console.log("DATA STREAMS: " + data.streams[i].channel.display_name);

      let channelDiv = $("<div>");
      channelDiv.attr("class", "streamOption");
      channelDiv.attr("value", i);

      channelDiv.html(topFive[i]);
      $(".twitch-video").append(channelDiv);
    }
    console.log(topFive);
  }
  function showSteam(steamGame) {
    $.ajax({
      url: "https://api.steampowered.com/ISteamApps/GetAppList/v0001/",
      method: "GET"
    }).then(function(response) {
      for (let thing of response.applist.apps.app) {
        if (thing.name == steamGame) {
          var steamID = thing.appid;
          $("#chart").attr(
            "src",
            "https://steamdb.info/embed/?appid=" + steamID
          );
          break;
        }
      }
    });
  }
  function showOverview(gameID) {
    $.ajax({
      url: `https://www.giantbomb.com/api/search/?api_key=9de8e16c98e24b4f3f0f48d511fa91bd27023372&query=${gameID}&format=jsonp`,
      method: "GET",
      dataType: "jsonp",
      jsonp: "json_callback",
      jsonpCallback: "jCallBack",
      success: function(response) {
        var descHTML = response.results[0].description;
        var descIndexStart = 0;
        var descIndex = 0;
        for (var i = 0; i < 2; i++) {
          descIndex = descHTML.indexOf("<h2>", descIndex);
          descIndex++;
        }
        descIndexStart = descHTML.indexOf("</h2>", 0);
        $(".description").html(
          descHTML.slice(descIndexStart + 5, descIndex - 1)
        );
      }
    });
  }
  function showTwitter(gameName) {
    //Added Tweet
    var game_noSpace = gameName.replace(/\s+/g, "");
    var tweet = $("<a>");
    tweet.attr(
      "href",
      "https://twitter.com/" + game_noSpace + "?ref_src=twsrc%5Etfw"
    );
    tweet.addClass("twitter-timeline");
    $("#tweet").append(tweet);
    twttr.widgets.load();
  }

  function addComments(realname) {
    child = database.ref("/" + realname);

    child.once("value", function(snapshot) {
      snapshot.forEach(function(snap) {
        var user_comment = snap.val().comment;
        console.log(user_comment);
        var comm = $("<p>");
        comm.text(user_comment);
        $("#comment-section").append(comm);
      });
    });
  }
  function inArray(thing, array) {
    for (item of array) {
      if (thing == item) {
        return true;
      }
    }
    return false;
  }
});
