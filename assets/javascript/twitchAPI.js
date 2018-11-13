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
  var gameName;

  var gameID;
  var steamID;
  var descHTML;
  var twitchStream;
  console.log("HERE");
  $(".submitButton").on("click", function(event) {
    event.preventDefault();
    console.log("HERE2");

    gameName = $(".inputGame").val();
    console.log(gameName);
    $.ajax({
      url: `https://api.twitch.tv/kraken/search/games?client_id=o31s0t9lor4pa6ix7id21wlfbilp67&query=${gameName}&type=suggest`,
      method: "GET",
      success: function(data) {
        console.log(this.url);
        console.log("success: " + data.games[0]._id);
      }
    }).then(function(data) {
      gameID = data.games[0].name;
      var steamGame = gameID;
      gameID = gameID.replace(/\s/g, "%20");
      console.log(gameID);
      
      $.ajax({
        url: `https://api.twitch.tv/kraken/streams?client_id=o31s0t9lor4pa6ix7id21wlfbilp67&game=${gameID}&type=suggest`,

        method: "GET"
       
      }).then(function(data){
        console.log(this.url);

        console.log("success: " + data.streams[0].channel.display_name);
        var embedDiv = $("<div>");
        embedDiv.attr("id", "twitch-embed");
        twitchStream = embedDiv;
        $(".twitch-video").html(twitchStream);

        var embed = new Twitch.Embed('twitch-embed', {
            width: 426*1.2,
            height: 240*1.2,
            layout: 'video',
            theme: 'dark',
            channel: data.streams[0].channel.display_name
            

          });
          
          embed.addEventListener(Twitch.Embed.VIDEO_READY, function() {
            console.log('The video is ready');
          });
          $.ajax({
            url: 'http://api.steampowered.com/ISteamApps/GetAppList/v0001/',
            method: "GET",

          }).then(function(response){
            for(let thing of response.applist.apps.app){
              if(thing.name == steamGame){
                steamID = thing.appid;
              }
            }
            console.log("STEAM ID: "+steamID)
          })

      });

      $.ajax({
        url: `https://www.giantbomb.com/api/search/?api_key=9de8e16c98e24b4f3f0f48d511fa91bd27023372&query=${gameID}&format=jsonp`,
        method: "GET",
        dataType: 'jsonp',
        jsonp:'json_callback',
        jsonpCallback: 'jCallBack',
        success: function(response){
            console.log("HI");
            console.log(response);
            console.log(response.results[0].description);
            descHTML = response.results[0].description;
            var descIndex = 0;
            for(var i=0;i<2;i++){
               descIndex = descHTML.indexOf("<h2>", descIndex);
               descIndex++;
               console.log(descIndex);
              
            }
            $(".description").html(descHTML.slice(0,descIndex-1));
        }
    });
  });
})
})
