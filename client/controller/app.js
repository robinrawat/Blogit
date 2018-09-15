var app = angular.module('myApp');

app.factory()

app.filter('htmlToPlainText',function(){
	return function(text){
		return text ? String(text).replace(/<[^>]+>/gm,'') : '';
	}
});

app.controller('homeCtrl', function($scope,$http,$state,$timeout,ngToast){
	$scope.latestBlogs = {};
	$http.get('/api/blogs/')
	.then(function(success){
		$scope.latestBlogs = success.data.blogs;
	},function(err){
		throw err;
		$timeout(function(){
			ngToast.create({
				content:'Error retriving blogs'
			});
		});
	});
});

app.controller('blogCtrl',function($scope,$http,$state,$rootScope,$timeout,ngToast){
	if($rootScope.loggedIn === true){
		$scope.userblogs = {};
		$http.get('/api/blogs/ownblog/'+$rootScope.userId)
		.then(function(success){
			$scope.userblogs = success.data.blogs;
		},function(err){
			throw err;
			$timeout(function(){
				ngToast.create({
					content:'Error retriving blog'
				});
			});
		});
	}
	else{
		$timeout(function(){
			ngToast.create({
				content:'login First'
			});
		});
		$state.go('login');
	}
});

app.controller('viewCtrl',function($scope,$http,$state,$rootScope,$stateParams,$timeout,ngToast){
	var id = $stateParams.id;
	$http.get('/api/blogs/ownblogs/'+$stateParams.id)
	.then(function(success){
		$scope.blog = success.data;
	},function(err){
		throw err;
		$timeout(function(){
			ngToast.create({
				content:'Some Error'
			});
		});
	});

	$scope.upVote = function(){
		if($rootScope.loggedIn === true){
			if($scope.blog.author_id === $rootScope.userId){
				$timeout(function(){
					ngToast.create({
						className:'warning',
						content:'You really want to upvote your own blog'
					});
				});
			}else{
				
				$http.post('/api/blogs/upVote/'+id,$scope.blog)
				.then(function(success){
					$scope.blog = success.data;
					$timeout(function(){
						ngToast.create({
							content:'Successfully upvoted'
						});
					});
				},function(err){
					throw err;
					$timeout(function(){
						ngToast.create({
							content:'some error Occured'
						});
					});
				});
			}
		}else{
			$timeout(function(){
				ngToast.create({
					content:'You have to login first'
				});
			});
			$state.go('login');
		}
	}
	$scope.downVote = function(){
		if($rootScope.loggedIn === true){
			if($scope.blog.author_id === $rootScope.userId){
				$timeout(function(){
					ngToast.create({
						className:'warning',
						content:'You really want to downvote your own blog'
					});
				});
			}else{
				$http.post('/api/blogs/downVote/'+id,$scope.blog)
				.then(function(success){
					$scope.blog = success.data;
					$timeout(function(){
						ngToast.create({
							content:'Successfully downvoted'
						});
					});
				},function(err){
					$timeout(function(){
						ngToast.create({
							content:'some error Occured'
						});
					});
				});
			}
		}else{
			$timeout(function(){
				ngToast.create({
					content:'You need to login first'
				});
			});
			$state.go('login');
		}
	}

});
app.controller('loginCtrl',function($scope,$http,$location,$rootScope,$state,ngToast,$timeout){
	$scope.loginUser = function(){
		if($scope.user.email && $scope.user.password){
			console.log("All entries are filled");
			// console.log($scope.user);
			$http.post('/api/logins/',$scope.user)
				.then(function(success){
					$timeout(function(){
						ngToast.create({
							content:'logged in Successfully'
						});
					});
					$rootScope.displayName = success.data.displayName;
                    $rootScope.userId = success.data.id;
					$rootScope.loggedIn = true;
					// console.log($rootScope);
					$state.go('Myblogs');
				},function(err){
					$rootScope.loggedIn = false;
					$timeout(function(){
						ngToast.create({
							content:"Some Error Occured"
						});
					});	
				});
		}
		else{
			$timeout(function(){
				ngToast.create({
					content:"Fill the entries"
				});
			});
		}
	};
});

app.controller('signupCtrl',function($scope,$http,$location,$state,$timeout,ngToast){
	$scope.addUser = function(){
		if($scope.user.firstName && $scope.user.lastName && $scope.user.email && $scope.user.password && $scope.user.confirmPassword){
			console.log("All entries are filled");
			if($scope.user.password === $scope.user.confirmPassword){
				// console.log($scope.user);
				$http.post('/api/signups/', $scope.user).success(function(response){
					$timeout(function(){
						ngToast.create({
							content:"User created Successfully"
						});
					});
					state.go('signup');
				});
			}else{
				$timeout(function(){
						ngToast.create({
							content:"Password didn't matched"
						});
					});
			}
		}else{
			$timeout(function(){
				ngToast.create({
					content:"Some Fields are empty"
				});
			});
		}

	};
});

app.controller('createCtrl',function(taOptions,$scope,$timeout,ngToast,$http,$location,$state,$rootScope){
	$scope.post = {};
	taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ['html', 'insertLink', 'wordcount', 'charcount']
    ];
    $scope.creates = function(){
    	if($rootScope.loggedIn === true){
    		if($scope.post.title && $scope.post.content){
    			$scope.post.author_id = $rootScope.userId;
    			$scope.post.upVoteCount = 0;
            	$scope.post.downVoteCount = 0;
            	console.log($scope.post);
            	$http.post('/api/blogs/',$scope.post)
            	.then(function(success){
            		$timeout(function(){
            			ngToast.create({
            				content:'Blog Published'
            			});
            		});
            		$state.go('home');
            	},function(err){
            		console.log('some error Occured');
            		$timeout(function(){
            			ngToast.create({
            				content:'Some Error Occured'
            			});
            		});
            	});
    		}else{
    			$timeout(function(){
        			ngToast.create({
        				content:'Something is not right'
        			});
        		});
    		}
    	}
    }
});

app.controller('editCtrl',function($scope,$timeout,$stateParams,$http,taOptions,$state,ngToast){
	taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ['html', 'insertLink', 'wordcount', 'charcount']
    ];
    $scope.getBlog = function(){
		$http.get('/api/blogs/ownblogs/'+$stateParams.id)
		.then(function(response){
			$scope.post = response.data;
			console.log($scope.post);
			$timeout(function(){
				ngToast.create({
					content:'blog retrived'
				});
			});
		},function(err){
			throw err;
			$timeout(function(){
				ngToast.create({
					content:'Something is not right'
				});
			});
		});
	}
    $scope.update= function(){
    	$http.post('/api/blogs/updates/'+$stateParams.id,$scope.post)
    	.then(function(success){
    		$timeout(function(){
    			state.go('home');
				ngToast.create({
					content:'blog updated Successfully'
				});
			});
    	},function(err){
    		throw err;
    		$timeout(function(){
				ngToast.create({
					content:'something is wrong'
				});
			});
    	});
    }
    $scope.removeBlog = function(id){
    	$http.delete('/api/blogs/'+id)
    	.then(function(success){
    		$timeout(function(){
    			ngToast.create({
    				content:'Blog Deleted'
    			});
    		});	
    		$state.go('home');
    	},function(err){
    		$timeout(function(){
    			ngToast.create({
    				content:'Some error Occured'
    			});
    		});
    	});
    }
});

app.controller('MainCtrl',function($scope,$state,$rootScope,$timeout){
	$scope.logout = function(){
		$rootScope.loggedIn = false;
		$timeout (function(){
			ngToast.create({
				content:'user logged out'
			});
		});
		$state.go('login');
	}
});