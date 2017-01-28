let keys = require('./keys');
let Twitter = require('twitter');
let spotify = require('spotify');
let request = require('request');
let command = process.argv[2];
let a = keys.twitterKeys;	
var client = new Twitter({
  consumer_key: 'vyaOg5TMYfHbIxJG19edA9FS4',
  consumer_secret: 'uzM2Tc15Mbtum9GSPhQ2Z1sFmTtC1Enu8XbJuLUGjEWWlVFx1N',
  access_token_key: '824408584356327424-EDenyBS1CiXQsN5efiGHstPkYBXDJ8p',
  access_token_secret: 'aech5gLO0ozT8wINlZNt04ft8KNA3quueC47cd53tzYFO',
});
 
var params = {screen_name: 'nodejs'};
client.get('search/tweets', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  } else {console.log(error);}
});

	console.log(a);
