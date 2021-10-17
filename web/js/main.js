// application constants
var URL_HOST_BASE           = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
var URL_HOST_PROTOCOL       = window.location.protocol + "//";

var URL_AHRS_CAGE           = URL_HOST_PROTOCOL + URL_HOST_BASE + "/cageAHRS";
var URL_AHRS_CAL            = URL_HOST_PROTOCOL + URL_HOST_BASE + "/calibrateAHRS";
var URL_AHRS_ORIENT         = URL_HOST_PROTOCOL + URL_HOST_BASE + "/orientAHRS";
var URL_DELETEAHRSLOGFILES  = URL_HOST_PROTOCOL + URL_HOST_BASE + "/deleteahrslogfiles";
var URL_DELETELOGFILE       = URL_HOST_PROTOCOL + URL_HOST_BASE + "/deletelogfile";
var URL_DEV_TOGGLE_GET      = URL_HOST_PROTOCOL + URL_HOST_BASE + "/develmodetoggle";
var URL_DOWNLOADAHRSLOGFILES = URL_HOST_PROTOCOL + URL_HOST_BASE + "/downloadahrslogs";
var URL_DOWNLOADDB          = URL_HOST_PROTOCOL + URL_HOST_BASE + "/downloaddb";
var URL_DOWNLOADLOGFILE     = URL_HOST_PROTOCOL + URL_HOST_BASE + "/downloadlog";
var URL_GMETER_RESET        = URL_HOST_PROTOCOL + URL_HOST_BASE + "/resetGMeter";
var URL_REBOOT              = URL_HOST_PROTOCOL + URL_HOST_BASE + "/reboot";
var URL_RESTARTAPP          = URL_HOST_PROTOCOL + URL_HOST_BASE + "/restart";
var URL_SATELLITES_GET      = URL_HOST_PROTOCOL + URL_HOST_BASE + "/getSatellites";
var URL_SETTINGS_GET        = URL_HOST_PROTOCOL + URL_HOST_BASE + "/getSettings";
var URL_SETTINGS_SET        = URL_HOST_PROTOCOL + URL_HOST_BASE + "/setSettings";
var URL_SHUTDOWN            = URL_HOST_PROTOCOL + URL_HOST_BASE + "/shutdown";
var URL_STATUS_GET          = URL_HOST_PROTOCOL + URL_HOST_BASE + "/getStatus";
var URL_TOWERS_GET          = URL_HOST_PROTOCOL + URL_HOST_BASE + "/getTowers";
var URL_UPDATE_UPLOAD       = URL_HOST_PROTOCOL + URL_HOST_BASE + "/updateUpload";
var URL_GET_SITUATION       = URL_HOST_PROTOCOL + URL_HOST_BASE + "/getSituation";
var URL_GET_TILESETS        = URL_HOST_PROTOCOL + URL_HOST_BASE + "/tiles/tilesets";
var URL_GET_TILE            = URL_HOST_PROTOCOL + URL_HOST_BASE + "/tiles";


var URL_DEVELOPER_WS        = "ws://" + URL_HOST_BASE + "/developer";
var URL_GPS_WS              = "ws://" + URL_HOST_BASE + "/situation";
var URL_STATUS_WS           = "ws://" + URL_HOST_BASE + "/status";
var URL_TRAFFIC_WS          = "ws://" + URL_HOST_BASE + "/traffic";
var URL_WEATHER_WS          = "ws://" + URL_HOST_BASE + "/weather";
var URL_RADAR_WS            = "ws://" + URL_HOST_BASE + "/radar";

// define the module with dependency on mobile-angular-ui
//var app = angular.module('stratux', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'appControllers']);
var app = angular.module('stratux', ['ui.router', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'appControllers']);
var appControllers = angular.module('appControllers', []);


app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'plates/status.html',
			controller: 'StatusCtrl',
			reloadOnSearch: false
		})
		.state('towers', {
			url: '/towers',
			templateUrl: 'plates/towers.html',
			controller: 'TowersCtrl',
			reloadOnSearch: false
		})
		.state('weather', {
			url: '/weather',
			templateUrl: 'plates/weather.html',
			controller: 'WeatherCtrl',
			reloadOnSearch: false
		})
		.state('traffic', {
			url: '/traffic',
			templateUrl: 'plates/traffic.html',
			controller: 'TrafficCtrl',
			reloadOnSearch: false
		})
		.state('gps', {
			url: '/gps',
			templateUrl: 'plates/gps.html',
			controller: 'GPSCtrl',
			reloadOnSearch: false
		})
		.state('logs', {
			url: '/logs',
			templateUrl: 'plates/logs.html',
			controller: 'LogsCtrl',
			reloadOnSearch: false
		})
		.state('settings', {
			url: '/settings',
			templateUrl: 'plates/settings.html',
			controller: 'SettingsCtrl',
			reloadOnSearch: false
		})
		.state('radar', {
			url: '/radar',
			templateUrl: 'plates/radar.html',
			controller: 'RadarCtrl',
			reloadOnSearch: false
		})
		.state('map', {
			url: '/map',
			templateUrl: 'plates/map.html',
			controller: 'MapCtrl',
			reloadOnSearch: false
		})
        .state('developer', {
			url: '/developer',
			templateUrl: 'plates/developer.html',
			controller: 'DeveloperCtrl',
			reloadOnSearch: false
		});
	$urlRouterProvider.otherwise('/');
});


app.run(function ($transform) {
	window.$transform = $transform;
});

// For this app we have a MainController for whatever and individual controllers for each page
app.controller('MainCtrl', function ($scope, $http) {
	// any logic global logic
    $http.get(URL_SETTINGS_GET)
    .then(function(response) {
			var settings = angular.fromJson(response.data);
            $scope.DeveloperMode = settings.DeveloperMode;
            $scope.UAT_Enabled = settings.UAT_Enabled;

            // Update theme
            $scope.updateTheme(settings.DarkMode);
    }, function(response) {
        //Second function handles error
    });	

    $scope.updateTheme = function(darkMode) {
        if(darkMode != $scope.DarkMode) {
            // console.log("Updating theme, use dark mode?", darkMode);
            $scope.DarkMode = darkMode;

            if($scope.DarkMode) {
                document.getElementById('themeStylesheet').href = 'css/dark-mode.css';
            } else {
                document.getElementById('themeStylesheet').href = '';
            }
        }
    };
})
.service('colorService',function(){ 

	// Must match the traffic-style in style.css
	// THis ensures that the colors used in traffic.js and map.js for the vessels are the same
	let aircraftColors = {
		1: "cornflowerblue",
		10: "cornflowerblue",
		11: "cornflowerblue",

		12: "skyblue",
		13: "skyblue",
		14: "skyblue",

		2: "darkkhaki",
		20: "darkkhaki",
		21: "darkkhaki",

		22: "khaki",
		23: "khaki",
		24: "khaki",

		4: "green",
		40: "green",
		41: "green",

		42: "greenyellow",
		43: "greenyellow",
		44: "greenyellow"
	}

	const getAircraftColor = (aircraft) => {
		let code = "" + aircraft.Last_source+""+aircraft.TargetType;			
		if (aircraftColors[code] === undefined) {
			return "white";
		} else {
			return aircraftColors[code];
		}
	};

	const getVesselColor = (vessel) => {
		// https://www.navcen.uscg.gov/?pageName=AISMessagesAStatic
		firstDigit = Math.floor(vessel.Emitter_category / 10)
		secondDigit = vessel.Emitter_category - Math.floor(vessel.Emitter_category / 10)*10;

		const categoryFirst= {
			6: "blue",
			7: "green",
			8: "red"
		};		
		const categorySecond= {
			0: "orange",
			1: "cyan",
			2: "cyan",
			3: "LightSkyBlue",
			4: "LightSkyBlue",
			5: "darkolivegreen",
			6: "maroon",
			7: "purple"
		};		

		if (categoryFirst[firstDigit]) {
			return categoryFirst[firstDigit];
		} else if (firstDigit===3 && categorySecond[secondDigit]) {
			return categorySecond[secondDigit];
		} else {
			return 'gray';			
		}
	};

	return {

		getTransportColor: (craft) => {
			if (craft.TargetType === TARGET_TYPE_AIS) {
				return getVesselColor(craft);
			} else {
				return getAircraftColor(craft);
			}
		}
	
	};

});
