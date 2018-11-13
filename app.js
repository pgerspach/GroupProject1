var appID;

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

$("#submit").on("click", function(event) {

    event.preventDefault();

    var game = $("#game").val().trim();

    var appURL = "http://api.steampowered.com/ISteamApps/GetAppList/v0001/";
    $.ajax({
        url: appURL,
        method: "GET"
    })
        .then(function(response) {
            var idArray = response.applist.apps.app;
            console.log(idArray);

            var index = findWithAttr(idArray, "name", game);
            console.log(index);

            appID = idArray[index].appid;
            console.log(appID);

            $("#chart").attr("src", "https://steamdb.info/embed/?appid="+appID);

            var spyURL = "https://steamspy.com/api.php?request=appdetails&appid=730"
            
            $.ajax({
                url: spyURL,
                method: "GET",
                dataType:"jsonp",
                jsonpCallback:"jCallBack"
        
            })
                .then(function(response){
                console.log(reponse);
            });
            
        });
    
    
    
});