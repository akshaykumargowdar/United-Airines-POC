var express = require('express');
var fs = require('file-system');
var request = require('request');
var http = require('http');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');

var Client = require('node-rest-client').Client;

var client = new Client();
var watson = require('watson-developer-cloud');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');


var conversation1 = watson.conversation({
  username: '33bb7e27-71bd-47ac-b760-636ef3815cd5',
  password: 'G3YEVu67rrWO',
  version: 'v1',
  version_date: '2017-04-14'
});

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var personality_insights = new PersonalityInsightsV3({
  username: '68c632ac-a4e5-44e1-b7fc-127b79edc2b7',
  password: 'dOzVUVz0tdUr',
  version_date: '2016-10-20'
});

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var tone_analyzer = new ToneAnalyzerV3({
  username: 'b4754984-f684-4937-b8d8-79da5348657e',
  password: '3ZNx68eOroDN',
  version_date: '2016-05-19'
});

var client = require('twilio')(
  "AC6ec6ebb0c35d2c08b6f10b52934e9e31",
  "c010b47b360849f83545ba15207e01c6"
);

var uid = ['1125813920730','1125813920731','1125813920732','1125813920733','1125813920734'];
var context1 = {};
var db = monk('localhost:27017/CapitalMarket');

var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

var discovery = new DiscoveryV1({
  username: '8689e85f-9170-4b0d-bef2-a97537bc6d3a',
  password: '77Kyhph1i1HV',
  version_date: '2016-12-01'
});

router.get('/cmfirstcall', function(req, res, next) {	
  					conversation1.message({
  					workspace_id: '49ee99f9-b7f5-438d-ac48-a166407814ed',
  				 	input: {'text': "" },
  						
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{
										  context1 = response.context;
										 
										  res.send(response.output);										  
										}
									     })
					});


router.post('/cmconsecutivecalls', function(req, res) {
					console.log("request received");
					conversation1.message({
  					workspace_id: '49ee99f9-b7f5-438d-ac48-a166407814ed',
  				 	input: {'text': req.body.question },
  						context: context1
						},  function(err, response) {
  										if (err)
    										console.log('error:', err);
  										else
										{	
											context1 = response.context;
											if(response.context.SeatChangeIssue != true)
											{
												res.send(response);
											}
											if(response.context.SeatChangeIssue == true)
											{
												var validUID = false ;
												for(var i=0; i < uid.length ; i++)
												{
													if(uid[i] == response.context.UID)
														validUID = true ;
												}
												var context = context1 ;
												context.validUID = validUID;
												conversation1.message({
												workspace_id: '49ee99f9-b7f5-438d-ac48-a166407814ed',
												input: {'text': '' },
												context : context
													},  function(err, response) {
														context1 = response.context;
														res.send(response);
													});
												
											}
											
											
										}
						});
});


 router.post('/send',function(req,res){
  client.messages.create({
  from: "+17737886740",
  to: "+919738891209",
  body: req.body.message
}, function(err, message) {
  if(err) {
    console.error(err.message);
  }
});
 });
 
 
 

 
router.get('/PersonalityInsights', function(req,res){
	console.log("PI req received");
	var params = {
  // Get the content items from the JSON file.
  content_items: require('./profile.json').contentItems,
  consumption_preferences: true,
  raw_scores: true,
  headers: {
    'accept-language': 'en',
    'accept': 'application/json'
  }
  };
  
  personality_insights.profile(params, function(error, response) {
  if (error)
    res.send('Error:', error);
  else
    res.send(JSON.stringify(response, null, 2));
  }
  );
});
 
 router.get('/getdata',function(req,res){
		request('https://e2b889e6-f721-4e06-aadf-aa170846c76a-bluemix.cloudant.com/iotp_29m8ko_default_2017-w22/_all_docs?include_docs=true&descending=true', function (error, response, body) {
		res.send(body); // Print the HTML for the Google homepage. 
	});
});

router.get('/toneanalyze' ,function(req,res) { 
console.log("tone analyzer hit");
	var params = {
		  // Get the text from the JSON file.
		  text: "Had a very bad experience with the undersized seat. On top of it it was jammed and recliner was not working. I was not given alternate seat despite there was free seats available. I was told that it was reserved for higher profile customer than me",//require('./tone-chat.json').text,
		  tones: 'emotion'
		};

		tone_analyzer.tone(params, function(error, response) {
		  if (error)
			res.send('error:', error);
		  else
		  {
			var i=0 ; 
			var anger = 0 ; 
			var disgust = 0 ;
			var fear = 0; 
			var joy = 0 ;
			var sadness = 0 ;
 			for(var i=0;i<response.sentences_tone.length ; i++)
			{
				for(j=0;j<response.sentences_tone[i].tone_categories[0].tones.length ; j++)
				{
					switch(response.sentences_tone[i].tone_categories[0].tones[j].tone_id)
					{
						case 'anger' : anger = anger +  response.sentences_tone[i].tone_categories[0].tones[j].score ;
						case 'disgust' : disgust = disgust +  response.sentences_tone[i].tone_categories[0].tones[j].score ;
						case 'fear' : fear = fear + response.sentences_tone[i].tone_categories[0].tones[j].score ;
						case 'joy' : joy = joy +   response.sentences_tone[i].tone_categories[0].tones[j].score ;
						case 'sadness' : sadness = sadness +   response.sentences_tone[i].tone_categories[0].tones[j].score ;
					}
				}
			}
			anger = anger/i ; disgust = disgust/i; fear = fear/i; joy = joy/i; sadness = sadness/i;
			
			var TAObj = { "anger" : anger , "disgust" : disgust, "fear" : fear, "joy" : joy, "sadness" : sadness };
			res.send(TAObj);
		  }
		});
});

router.get('/', function(req,res,next){
res.render('index');
});

module.exports = router;
