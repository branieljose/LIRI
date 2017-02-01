let keys = require('./keys');
let Twitter = require('twitter');
let request = require('request');
let fs = require('fs');
let command = process.argv[2];
let input = process.argv[3];
let a = keys.twitterKeys;
var client = new Twitter(a);


function doit(command, input) {

    switch (command) {
        case 'my-tweets':
            var params = {
                screen_name: 'fakatoon_21'
            };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < tweets.length; i++) {
                        console.log('\n' + tweets[i].created_at + ': ' + tweets[i].text);
                    }
                } else {
                    console.log(error);
                }
            });
            break;
        case 'spotify-this-song':
            request.get('https://api.spotify.com/v1/search?type=track&q=' + input + '&limit=1', function(error, response) {
                if (!error && response.statusCode == 200) {
                    var doc = JSON.parse(response.body);
                    doc.tracks.items.some(function(data) {
                        let info = data;
                        let artistName = info.artists[0].name;
                        let songName = info.name;
                        let prev_URL = info.preview_url;
                        let album = info.album.name;
                        console.log(`Song: ${songName}\nArtist Name: ${artistName}\nAlbum: ${album}\nPreview URL: ${prev_URL}\n`);
                    });
                }

            });
            break;
        case '1':
        fs.readFile('./random.txt', 'UTF8',function(err,data){
            if (err) {
                console.log(err);
            }   let file = data.split(',');
                let cmd = file[0];
                let inpt = file[1];
                doit(cmd, inpt);
        });


    }
}
doit(command, input);
