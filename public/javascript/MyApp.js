
app.config(function($routeProvider) {
			$routeProvider
			.when("/", {
				templateUrl : "/views/home.html",
			})
			.when("/dashboard", {
				templateUrl : "/views/dashboard.html",
			})		
			.when("/about", {
				templateUrl : "/views/about.html",
			})
			.when("/contact", {
				templateUrl : "/views/contact.html",
			});
	});

app.controller('mycontroller', function($scope,$http,$sce,$location,$interval) {
	
	function addRowHandlers() {
        var table = document.getElementById("splitPNRTable");
        var rows = table.getElementsByTagName("tr");
        for (i = 0; i < rows.length; i++) {
            var currentRow = table.rows[i];
            var createClickHandler = 
                function(row) 
                {
                    return function() { 
                                            var class_cell = row.getElementsByTagName("td")[2];
                                            var seat_cell = row.getElementsByTagName("td")[3];
                                            $scope.input.question = row.getElementsByTagName("td")[0].innerHTML;
                                            $scope.send();
                                            class_cell.innerHTML = "B";
                                            class_cell.style.backgroundColor = "#19303f";
                                            seat_cell.innerHTML = "2A";
                                            seat_cell.style.backgroundColor = "#19303f";
                                     };
                };
 
            currentRow.onclick = createClickHandler(currentRow);
        }
    }
 
    window.onload = addRowHandlers();
    
	
	$scope.show = 0;
	$scope.myData = [];
	$scope.resultwatson  = [];
	$http.get('/cmfirstcall').then(function(response){
			$scope.myData.push(response.data);
			console.log("response received");
			
	});	
	
	$scope.send = function(){
        console.log($scope.input.question);
	$scope.myData.push({"question" : $scope.input.question});
	var input =  {"question":$scope.input.question};
	$scope.input.question = " ";
	$http.post('/cmconsecutivecalls',input).then(function(response){
		$scope.input.question = " ";		
		$scope.myData.push(response.data.output);
		console.log(response.data.context.sms);
		if(response.data.context.FAQ == true)
            $scope.faq = response.data.context.FAQ ;
        else
            $scope.faq = false; 
        
        if(response.data.context.PNR1 == true)
            $scope.PNR1 = response.data.context.PNR1 ;
        else
            $scope.PNR1 = false;
        
        if(response.data.context.PNR2 == true)
            $scope.PNR2 = response.data.context.PNR2 ;
        else
            $scope.PNR2 = false;
		if(response.data.context.sms == true)
		{	
			
			$http.post('/send',{message : "Temperature = 30 C and Humidity = 28"});
			
		}
	
		if(response.data.context.sense == true)
		{
			$location.path('dashboard');	
			callAtInterval();
			 $interval(callAtInterval, 10000,10);
			
			
			
				function callAtInterval() {
					console.log("interval");
					$scope.sensordata = [];
					$scope.data1 =[];
					$scope.data2 = [];
					$scope.data = [];
						$http.get('/getdata').then(function(response){
						var labels = [];
						var	 temprature = [];
						var humidity = [];
						for(var i = 0; i<response.data.rows.length && i<= 50; i++)
							if(response.data.rows[i].doc.data)
							{
								labels.push(response.data.rows[i].doc.timestamp.substring(11,19));
								temprature.push(response.data.rows[i].doc.data.d.temp);
								humidity.push(response.data.rows[i].doc.data.d.humidity);
							}
						$scope.labels = labels;
						 $scope.data = [temprature,humidity];
						 $scope.data1 = temprature;
						 $scope.data2 = humidity;
						 console.log($scope.data);
						/*$scope.data = [
						[65, 59, 80, 81, 56, 55, 40],
						[28, 48, 40, 19, 86, 27, 90]
					  ];*/
					});
					}

			
		}
			
	});		
}
		
  $scope.series = ['Series A', 'Series B'];
  
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
});	

app.controller('dbcontroller', function($scope,$http,$timeout) {
	
	$scope.PassengerData = [{"name" : "John Aby","mobile" : 14008900000,"MileageNo": "xxyy","flightno" : 1796,"pnr" : "34O5ZZ","id" : 0,"class":"United Business","detail": "John is the CEO of ABC Inc and on a business trip. He is Premium Platinum Customer. Below is our analysis of Mr. John Personality based on his Social Media interactions and our service Feedback. Based on his earlier travel patterns, he will be always late for Boarding.", "checked" : true,"recomd" : "Contact John for Travel Confirmation and have him Boarded. Speed up his CheckIn / Gate Boarding Process. Provide welcome drink and Magazine while Boarding."},
							{"name" : "Aly Jackson","mobile" : 14008900018,"MileageNo": "xyxy","flightno" : 1796,"pnr" : "52CM4R","id" : 1,"class":"United Business","detail": "Aly Jackson is physically challenged. She has requested for wheel chair. Make arrangements for the same and arrange for an assistant to take care of her untill she boards", "checked" : true,"recomd" : "Can get United Private Screening"},
							{"name" : "Wlg White","mobile" : 14008900019,"MileageNo": "yyxx","flightno" : 1796,"pnr" : "52D2OU","id" : 2,"class":"United First","detail": "Wlg White is our most regular customer. Based on our records he is always delays to check in. Please call and request him to come early", "checked" : true,"recomd" : "Free Meals Service"},
							{"name" : "Garcia","mobile" : 14008900023,"MileageNo": "xyyx","flightno" : 1796,"pnr" : "52EK25","id" : 3,"class":"United Economy","detail": "Garcia is our high profile customer. We have received negative feedback and concern on his seat in last flight. Below is the Analysis based on his last feedback.", "checked" : false,"recomd" : "Please take special care of this passenger and change his seat next to any available free seat."}							
							] ;
							
	$scope.SSRDetails = [{ "name" : "Tom Meg", "PNR" : "YUTHC7", "seat" : "28 D", "SSR" : "Senior Citizen","asst" : "Enable wheel Chair", "id" : 4, "src":"Twitter", "srctxt" : "Very Bad experience with XXX Airlines for disabled individuals. Poor Planning in providing Wheel Chair. Had to wait long time especially while need to use Rest Room", "score" : 0.03, "tone" : "Angry", "type" : "Negative Feedback", "sugg" : "Organize wheel chair in advance, Check & provide double seat or Aisle seat with better leg room "},
						 { "name" : "Chris Webb", "PNR" : "Y8THC7", "seat" : "31 A", "SSR" : "Disabled Passenger","asst" : "Enable assistance accessing the aircraft with the use of an aisle chair and arrange for extra legroom", "id" : 5, "src":"Blog", "srctxt" : "Travelling to visit my new born Grand Daughter… Last time I flew from SFO to EWR. Of course I needed to take my electric wheelchair with me. The Airways made this and the return one month later a great experience. Two e-mails were enough that they boarded my wheelchair, I got a free seat next to me (although I had not asked for it) and a flight attendant checked on me every hour. And all that at no extra cost. They even opened my food. No need to ask. Great and very dedicated staff. Extremely friendly. I can really recommend Airways for even oversea flights. They even managed to make me feel human again. Thank you for that! It was a six star trip. I will choose it Again!!", "score" : 0.70, "tone" : "Happy", "type" : "Positive Feedback", "sugg" : "Complimentary cookies and wishes for Baby" }
						];
						
	$scope.SSRModal = [{"src":"Twitter", "srctxt" : "Very Bad experience with XXX Airlines for disabled individuals. Poor Planning in providing Wheel Chair. Had to wait long time especially while need to use Rest Room", "score" : 0.03, "tone" : "Angry", "type" : "Negative Feedback", "sugg" : "Organize wheel chair in advance, Check & provide double seat or Aisle seat with better leg room "},
					    {"src":"Blog", "srctxt" : "Travelling to visit my new born Grand Daughter… Last time I flew from SFO to EWR. Of course I needed to take my electric wheelchair with me. The Airways made this and the return one month later a great experience. Two e-mails were enough that they boarded my wheelchair, I got a free seat next to me (although I had not asked for it) and a flight attendant checked on me every hour. And all that at no extra cost. They even opened my food. No need to ask. Great and very dedicated staff. Extremely friendly. I can really recommend Airways for even oversea flights. They even managed to make me feel human again. Thank you for that! It was a six star trip. I will choose it Again!!", "score" : 0.70, "tone" : "Happy", "type" : "Positive Feedback", "sugg" : "Complimentary cookies and wishes for Baby"}
					  ];
	
	var chart = new PersonalitySunburstChart({
		'selector':'#sunburstChart',
		'version': 'v3'
	  });
	
	$scope.PIObj = [] ;
	$scope.TAObj = [] ;
	$scope.feedback = "Had a very bad experience with the undersized seat. On top of it it was jammed and recliner was not working. I was not given alternate seat despite there was free seats available. I was told that it was reserved for higher profile customer than me";
	
	$http.get('/PersonalityInsights').then(function(response){
		console.log("hit");
		console.log("PI response", response);
		$scope.PIObj = response ;
		//chart.show($scope.PIObj.data, '../images/man.png');
		});
		
	$http.get('/toneanalyze').then(function(response) {
		console.log("Tone Analysis data received",response.data);
		$scope.TAObj = response ;
		TAGraph($scope.TAObj.data.anger,$scope.TAObj.data.disgust, $scope.TAObj.data.fear, $scope.TAObj.data.joy, $scope.TAObj.data.sadness );
	});
		
	$scope.tablecntrl = function() {
		$scope.showthirdtable = "true";
	}
	
	$scope.modaldata = function(obj) {
		console.log(obj);
		$scope.obj = obj ;			
	}
	
	$scope.modaldata1 = function(obj1) {
		console.log(obj1);
		$scope.obj1 = obj1 ;			
	}
	
	$scope.func1 = function()
	{
		chart.show($scope.PIObj.data, '../images/man.png');
	}
	
	var TAGraph = function(anger,disgust,fear,joy,sadness) {
			console.log("chart called");
			Highcharts.chart('TAcontainer', {
			chart: {
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45,
					beta: 0
				}
			},
			title: {
				text: 'Analysis of previous Feedback'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					depth: 35,
					dataLabels: {
						enabled: true,
						format: '{point.name}'
					}
				}
			},
			series: [{
				type: 'pie',
				name: 'Tone Analysis',
				data: [
					['Anger', anger],
					['Disgust', disgust],
					{
						name: 'Fear',
						y: fear,
						sliced: true,
						selected: true
					},
					['Joy', joy],
					['Sadness', sadness]
				]
			}]
		});
	}
	
	
	
});
