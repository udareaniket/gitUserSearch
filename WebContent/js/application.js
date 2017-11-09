'use strict';

var app = angular.module('myApp', [ 'ui.router', 'ngRoute', 'ngMaterial',
		'ngMessages' ]);
app.config(function($stateProvider) {
	$stateProvider.state('main', {
		url : '/main',
		templateUrl : 'pages/main.html'
	}).state('mainSearch', {
		url : '/main/:a',
		templateUrl : 'pages/main.html'
	}).state('user', {
		url : '/user/:a',
		templateUrl : 'pages/user.html'
	}).state('otherwise', {
		url : '*path',
		templateUrl : 'pages/main.html'
	})
});
/*
 * app.config(function($mdAriaProvider) { $mdAriaProvider.disableWarnings(); });
 */
app.controller('indexController', function($state, $route, $mdDialog, $http,
		$rootScope, $scope, $location, $filter, $mdToast) {
	$scope.navigateHome = function() {
		$location.url('/menu')
	}
	$scope.goToSearch = function(){
		$state.go('mainSearch',{
			a:$rootScope.searchQueryForBack
		})
	}
});

app.controller('MainController', function($state,$stateParams, $mdDialog, $http, $rootScope,
		$scope, $location, $filter, $mdToast) {
	$rootScope.showGoToResult = false;
	$rootScope.loadingModal = false
	$rootScope.navHeader = "GitHub User Search";
	$rootScope.rootHeader = true;
	$rootScope.searchResult = [];
	$scope.pageNumber = 1;
	$scope.searchQuery = "";
	$scope.showAs = 1;
	$scope.search = function() {
		$scope.showSearchResults = true;
		$scope.pageNumber = 1;
		$http.get(
				"https://api.github.com/search/users?q=" + $scope.searchQuery
						+ "&page=" + $scope.pageNumber + "&per_page=100")
				.success(function(data, status, headers, config) {
					var scrollDiv = document.getElementById("scrollDiv");
					scrollDiv.scrollTop = 0;
					$rootScope.searchResult = data;
					$scope.disbalePrev = true;
					if (data.items.length < 100) {
						$scope.disbaleNext = true;
					} else {
						$scope.disbaleNext = false;
					}
				})
	}
	if($stateParams.a!=undefined){
		$scope.searchQuery = $stateParams.a;
		$scope.search();
	}
	$scope.next = function() {
		$scope.pageNumber++;
		$('#myModal').modal({
			show : true,
			backdrop : 'static'
		});
		$http.get(
				"https://api.github.com/search/users?q=" + $scope.searchQuery
						+ "&page=" + $scope.pageNumber + "&per_page=100").then(
				function(response) {
					$('#myModal').modal('hide');
					var scrollDiv = document.getElementById("scrollDiv");
					scrollDiv.scrollTop = 0;
					if (response.data.items.length > 0) {
						$rootScope.searchResult = response.data;
					}
					if ($rootScope.searchResult.items.length < 100) {
						$scope.disbaleNext = true;
					} else {
						$scope.disbaleNext = false;
					}
				})
	}
	$scope.prev = function() {
		$scope.pageNumber--;
		$('#myModal').modal({
			show : true,
			backdrop : 'static'
		});
		$http.get(
				"https://api.github.com/search/users?q=" + $scope.searchQuery
						+ "&page=" + $scope.pageNumber + "&per_page=100").then(
				function(response) {
					$('#myModal').modal('hide');
					var scrollDiv = document.getElementById("scrollDiv");
					scrollDiv.scrollTop = 0;
					$rootScope.searchResult = response.data;
					if ($rootScope.searchResult.items.length < 100) {
						$scope.disbaleNext = true;
					} else {
						$scope.disbaleNext = false;
					}
				})
	}
	$scope.goToUser = function(login){
		$rootScope.searchQueryForBack = $scope.searchQuery;
		$state.go('user',{
			a:login
		});
	}
});
app
		.controller(
				'userController',
				function($stateParams, $mdDialog, $http, $rootScope, $scope,
						$location, $filter, $mdToast) {
					$rootScope.showGoToResult = true;
					$('#myModal').modal({
						show : true,
						backdrop : 'static'
					});
					$http
							.get(
									"https://api.github.com/users/"
											+ $stateParams.a)
							.success(
									function(response) {
										$('#myModal').modal('hide');
										$rootScope.selectedUser = response;
										if ($rootScope.selectedUser == undefined) {
											$location.url('/main')
										}
										if ($rootScope.selectedUser.name == null) {
											$rootScope.selectedUser.name = $rootScope.selectedUser.login;
										}
										$scope.pageNumber = 1;
										$('#myModal').modal({
											show : true,
											backdrop : 'static'
										});
										$http
												.get(
														"https://api.github.com/users/"
																+ $rootScope.selectedUser.login
																+ "/followers?page="
																+ $scope.pageNumber
																+ "&per_page=1000")
												.success(
														function(response) {
															$('#myModal')
																	.modal(
																			'hide');
															var scrollDiv = document
																	.getElementById("scrollDiv");
															scrollDiv.scrollTop = 0;
															$scope.showing = (($scope.pageNumber - 1) * 100 + 1)
																	+ " - ";
															$rootScope.followers = response;
															if (response.length < 100) {
																$scope.disbaleNext = true;
																$scope.showing += $scope.pageNumber
																		+ response.length;
															} else {
																$scope.disbaleNext = false;
																$scope.showing += (($scope.pageNumber - 1) * 100) + 100;
															}
														});
										$scope.next = function() {
											$scope.pageNumber++;
											$('#myModal').modal({
												show : true,
												backdrop : 'static'
											});
											$http
													.get(
															"https://api.github.com/users/"
																	+ $rootScope.selectedUser.login
																	+ "/followers?page="
																	+ $scope.pageNumber
																	+ "&per_page=100")
													.then(
															function(response) {
																$('#myModal')
																		.modal(
																				'hide');
																var scrollDiv = document
																		.getElementById("scrollDiv");
																scrollDiv.scrollTop = 0;
																$scope.showing = (($scope.pageNumber - 1) * 100 + 1)
																		+ " - ";
																$rootScope.followers = response.data;
																if (response.data.length < 100) {
																	$scope.disbaleNext = true;
																	$scope.showing += (($scope.pageNumber - 1) * 100)
																			+ response.data.length;
																} else {
																	$scope.disbaleNext = false;
																	$scope.showing += (($scope.pageNumber - 1) * 100) + 100;
																}
															})
										}
										$scope.prev = function() {
											$scope.pageNumber--;
											$('#myModal').modal({
												show : true,
												backdrop : 'static'
											});
											$http
													.get(
															"https://api.github.com/users/"
																	+ $rootScope.selectedUser.login
																	+ "/followers?page="
																	+ $scope.pageNumber
																	+ "&per_page=100")
													.then(
															function(response) {
																$('#myModal')
																		.modal(
																				'hide');
																var scrollDiv = document
																		.getElementById("scrollDiv");
																scrollDiv.scrollTop = 0;
																$scope.showing = (($scope.pageNumber - 1) * 100 + 1)
																		+ " - ";
																$rootScope.followers = response.data;
																if (response.data.length < 100) {
																	$scope.disbaleNext = true;
																	$scope.showing += (($scope.pageNumber - 1) * 100)
																			+ response.data.length;
																} else {
																	$scope.disbaleNext = false;
																	$scope.showing += (($scope.pageNumber - 1) * 100) + 100;
																}
															})
										}
									})

				});
