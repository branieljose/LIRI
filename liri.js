//get files and npm packages ready for implementation
var keys = require('./keys');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

//collect commands to be executed
var command = process.argv[2];
var input = process.argv[3];

//get twitter keys from external file 
var a = keys.twitterKeys;

//passes keys on to the Twitter constructor function
var client = new Twitter(a);

//this function contains the switch and cases
function doIt(command, input) {

    switch (command) {
        case 'my-tweets':
            //makes a request to the twitter API 
            var params = {
                screen_name: 'fakatoon_21'
            };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                //checks if there is an error, logs tweets if not error found 
                if (!error) {
                    for (var i = 0; i < tweets.length; i++) {
                        console.log('\n' + tweets[i].created_at + ': ' + tweets[i].text);
                    }
                }
                //logs error
                else {
                    console.log(error);
                }
            });
            break;
        case 'spotify-this-song':
            //checks name of song, pass a default name if any found
            if (!input) {
                var defaultSong = 'ace of base the sign';
                getSong(defaultSong);
            } else {
                getSong(input);
            }
            //gets song info from API and logs it 
            function getSong(input) {
                //requests song info to the API
                request.get('https://api.spotify.com/v1/search?type=track&q=' + input + '&limit=1', function(error, response) {
                    if (!error && response.statusCode == 200) {
                        //parses response
                        var doc = JSON.parse(response.body);
                        //logs data 
                        doc.tracks.items.some(function(data) {
                            var info = data;
                            var artistName = info.artists[0].name;
                            var songName = info.name;
                            var prev_URL = info.preview_url;
                            var album = info.album.name;
                            console.log('Song: ' + songName +
                                '\nArtist Name: ' + artistName +
                                '\nAlbum: ' + album +
                                '\nPreview URL: ' + prev_URL
                            );
                        });
                    }

                });
            }

            break;
        case 'movie-this':
            //here I repeat the same steps again
            if (!input) {
                var defaultMovie = 'Mr. nobody';
                getMovie(defaultMovie);
            } else {
                getMovie(input);
            }

            function getMovie(input) {
                request.get('http://www.omdbapi.com/?t=' + input + '&y=&plot=short&tomatoes=true&r=json', function(err, res) {
                    if (!err && res.statusCode == 200) {
                        var doc = JSON.parse(res.body);
                        console.log('Title: ' + doc.Title +
                            '\nYear: ' + doc.Year +
                            '\nimdbRating: ' + doc.imdbRating +
                            '\nCountry: ' + doc.Country +
                            '\nLanguage: ' + doc.Language +
                            '\nPlot: ' + doc.Plot +
                            '\nActors: ' + doc.Actors +
                            '\nRotten Tomatoes: ' + doc.tomatoRotten +
                            '\nRotten Tomatoes URL: ' + doc.tomatoURL
                        );
                    } else {
                        console.log(err);
                    }

                });
            }
            break;
        case 'do-what-it-says':
            //reads .txt file 
            fs.readFile('./random.txt', 'UTF8', function(err, data) {
                //logs error, if there is any 
                if (err) {
                    console.log(err);
                }
                //items separated by commas will become keys inside an array
                var file = data.split(',');

                //store each key separately 
                var cmd = file[0];
                var inpt = file[1];
                //pass keys as params and runs function 
                doIt(cmd, inpt);
            });


    }
    //logs commands into logs.txt
    var toAppend = ' [' + command + ', ' + input + '] -';
    fs.appendFile('log.txt', toAppend, (err) => {
        if (err) throw err;
    });
}
//calling main function
doIt(command, input);