
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

app.controller('dbcontroller', function($scope,$http) {
	
	$scope.PassengerData = [{"name" : "John","mobile" : 14008900000,"MileageNo": "xxyy","flightno" : 1796,"pnr" : "34O5ZZ","id" : 0,"class":"United Business","detail": "Jhon is the CEO of ABC IT Solutions and he is on a business trip. Below is the Personality Insights of Mr. john based on this socail mdeia writings.", "checked" : true},
							{"name" : "Aly Jackson","mobile" : 14008900018,"MileageNo": "xyxy","flightno" : 1796,"pnr" : "52CM4R","id" : 1,"class":"United Business","detail": "Aly Jackson is physically challenged. She has requested for wheel chair. Make arrangeents for the same and arrange for an assistant to take care of her untill she boards", "checked" : true},
							{"name" : "Wlg White","mobile" : 14008900019,"MileageNo": "yyxx","flightno" : 1796,"pnr" : "52D2OU","id" : 2,"class":"United First","detail": "Wlg White is our most regualr customer. Based on our records he is always delays to check in. Please call and requet him to come early", "checked" : true},
							{"name" : "Garcia","mobile" : 14008900023,"MileageNo": "xyyx","flightno" : 1796,"pnr" : "52EK25","id" : 4,"class":"United Economy","detail": "Garcia is our regular customer but he has faced inconvenience in his last trip. Below is the Analysis based on his last feedback. Please take special care of this passenger.", "checked" : false}							
							] ;
	
	var chart = new PersonalitySunburstChart({
		'selector':'#sunburstChart',
		'version': 'v3'
	  });
	
	$scope.PIObj = [] ;
	
	$scope.test = function()
	{
		$scope.id = '';
		console.log("hit");
		$http.get('/PersonalityInsights').then(function(response){
		console.log("hit");
		console.log("PI response", response);
		});
		
	}
	
	$http.get('/PersonalityInsights').then(function(response){
		console.log("hit");
		console.log("PI response", response);
		$scope.PIObj = response ;
		chart.show(response.data, '../images/man.png');
		});
		
	$scope.tablecntrl = function() {
		$scope.showthirdtable = "true";
	}
	
	$scope.modaldata = function(obj) {
		console.log(obj.name);
		$scope.obj = obj ;
		
	}
	
});
