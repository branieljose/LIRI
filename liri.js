//get files and npm packages ready for implementation
var keys = require('./keys');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var inquirer = require('inquirer');
var Spotify = require('machinepack-spotify');

//collect commands to be executed
var command = process.argv[2];
var input = process.argv[3];

//get twitter keys from external file 
var a = keys.twitterKeys;

//passes keys on to the Twitter constructor function
var client = new Twitter(a);

function startInt() {
    
    inquirer.prompt([{
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['1. View my Tweets', '2. Spotify a Song', '3. Look Up the Weather in Your Area', '4. Do What it Says'],
        filter: function(val) {
            return val.toLowerCase();
        }
    }]).then(function(answers) {
        var command = parseInt(answers.options);
        if (command === 1) {
            firstCommand();      
        } else if (command === 2) {
            secondCommand();   
        } else if (command === 3) {
            thirdCommand();
        } else if (command === 4) {
            fourthCommand();
        }

    });
}
startInt();

function firstCommand(){
//makes a request to the twitter API 
    var params = {
        screen_name: 'fakatoon_21'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        //checks if there is an error, logs tweets if not error found 
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log('\n > ' + tweets[i].created_at + ': ' + tweets[i].text);
            }
            goBack();
        }
        //logs error
        else {
            console.log(error);
        }
    });
}

function secondCommand(){
    inquirer.prompt([{
        type: 'input',
        name: 'songName',
        message: 'What\'s the name of the song?',
        filter: function(val) {
            return val.toLowerCase();
        }
    }]).then(function(answers) {
        var command = answers.songName;
        /**gets song info from API and logs it 
            requests song info to the API **/
        var input = command || "ace of base the sign";
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
                    goBack();
                });
            }

        });

    });

}

function thirdCommand(input){
 inquirer.prompt([{
    type: 'input',
    name: 'zip',
    message: 'What\'s your zipcode?',
    filter: function(val) {
        return val.toLowerCase();
    } 
    }]).then(function(answers) {
        var command = answers.zip,
            input = command || "07003";
            
            request.get("http://api.openweathermap.org/data/2.5/weather?zip="+ input +",us&APPID=bf16f4332356ef842aea73a080ad5791", function(err, res) {
            if (!err && res.statusCode == 200) {
                
                var doc = JSON.parse(res.body),
                    //converts temperature from Kalvin to Fahrenheit
                    minTemp = Math.round(9/5 * (doc.main.temp_min - 273) + 32),
                    maxTemp = Math.round(9/5 * (doc.main.temp_max - 273) + 32);
                console.log('Description: ' + doc.weather[0].description  + '\n' + 
                            'Location: '    + doc.name                    + '\n' +
                            "Temperature: "      + 
                            "Min. "  + minTemp + '°F' + ', ' +
                            " Max. " + maxTemp + '°F'                     + '\n' +
                            "Wind: " + doc.wind.speed + 'm/s' );

            } else {
                console.log(err);
            }
            goBack();
    });
})

}

function fourthCommand(){
    fs.readFile('./random.txt', 'UTF8', function(err, data) {
        //logs error, if there is any 
        if (err) {
            console.log(err);
        }
        //items separated by commas will become keys inside an array
        var file = data.split(',');

        //store each key separately 
        var cmd = file[0];
    });
}

//takes user back to main menu
function goBack(){
     inquirer.prompt([{
        type: 'confirm',
        name: 'songName',
        message: 'Go back',
        filter: function(val) {
            return val.toLowerCase();
        }
    }]).then(function(answers) {
        startInt();
    })
}
