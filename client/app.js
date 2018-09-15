var myApp = angular.module('myApp',['ui.router','ngToast','textAngular']);

myApp.run(function($rootScope, $state, $transitions) {

    //set global parameters
    $rootScope.loggedIn = false;
    $rootScope.displayName = '';
    $rootScope.userId = '';

    $transitions.onStart({}, function(transition) {
        if (transition.$to().self.authenticate == true) {
            if ($rootScope.loggedIn == false) {
                $state.go('login');
            }
        }
    });
});

 myApp.config(function($stateProvider,$urlRouterProvider){
	$stateProvider.state('home',{
		url:'/',
		controller:'homeCtrl',
		templateUrl:'templates/home.html'
	})
	.state('Myblogs',{
		url:'/blogs',
		controller:'blogCtrl',
		templateUrl:'templates/blog.html',
		authenticate:true
	})
	.state('edit',{
		url:'/edit/:id',
		controller:'editCtrl',
		templateUrl:'templates/edit.html',
		authenticate:true
		
	})
	.state('signup',{
		url:'/signup',
		controller:'signupCtrl',
		templateUrl:'templates/signup.html'
	})
	.state('login',{
		url:'/login',
		controller:'loginCtrl',
		templateUrl:'templates/login.html'
	})
	.state('view',{
		url:'/view/:id',
		templateUrl:'templates/view.html',
		controller:'viewCtrl'
	})
	.state('create',{
		url:'/create',
		controller:'createCtrl',
		templateUrl:'templates/create.html',
		authenticate:true
	});

	$urlRouterProvider.otherwise("/");
});