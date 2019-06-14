//credit to vegeta897 for the request URL part from his 'Simple Minecraft server status bot'
const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require('./config.json');
var statustring = "No signal";

var status2 = 0

var request = require('request');
var mcCommand = '/minecraft'; // Command for triggering
var mcIP = settings.ip; // Your MC server IP
var mcPort = settings.port; // Your MC server port

var url = 'https://api.mcsrvstat.us/2/' + mcIP + ':' + mcPort;


function update() {
  /*seconds = seconds + 1;
  secondsString = seconds.toString();
  client.user.setActivity(secondsString, { type: 'Playing' })
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  .catch(console.error);*/
  request(url, function(err, response, body) {
      if(err) {
          console.log(err);
          //return message.reply('Error getting Minecraft server status...');
      }
      body = JSON.parse(body);
      var status = 'Server offline';
      console.log(body.motd);
      if(body.online) {
          if((body.motd=="&cWe are under maintenance.")||(body.players.now>=body.players.max)){
            client.user.setStatus('idle')
            //.then(console.log)
            .catch(console.error);
          }else{
            client.user.setStatus('online')
            //.then(console.log)
            .catch(console.error);
          }
            
            if(body.mods) {
                status = ': ' + body.players.online + '. Mods: '+ (body.mods.names).length;
              } else {
                status = body.players.online + ' of  ' + body.players.max;
        }              



        
      } else {
        client.user.setStatus('dnd')
        //.then(console.log)
        .catch(console.error);

      }
      client.user.setActivity(status, { type: 'PLAYING' })
      .then(presence => console.log(status))
      .catch(console.error);
	  
	  if(status2 !== status){
	var generalChannel = client.channels.get("586601216193200150") // Replace with known channel ID
	if(status == "Server offline"){
		generalChannel.send("The server is offline") 
	}
	else if(body.online){
		generalChannel.send("There are " + body.players.online + ' of ' + body.players.max + " players currently online. The server is using " + (body.mods.names).length + " mods") 
	}
	else{
		generalChannel.send("bot machine b r o k e")
	}
}


status2 = status
	  
	  
	  
	  
  });












}
client.on("ready", () => {
  console.log("I am ready!");
  client.setInterval(update,30000);
});

/*client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
    update();

  }
}
);*/

client.login(settings.token);
