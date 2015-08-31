(function(){
  var app=angular.module("myApp");

var MainCtrl = function($scope){
	$scope.works = [
		{
			title : 'BBVA',
			new : true,
			img : 'bbva.png',
			id : 'helping',
			url : 'http://www.bbva.es'
		},{
			title : 'Apple Watch Catalogue',
			new : true,
			img : 'watches.png',
			id : 'watch_description',
			url : '/sites/macfools/watch/index.html'
		},{
			title : 'Ana y Fede 2014',
			new : false,
			img : 'fedeyana.png',
			id : 'wedding_description',
			url : '/sites/anayfede/index.html'
		},{
			title : 'Corpo Derma',
			new : false,
			img : 'corpoderma_logo.png',
			id : 'corpoderma_description',
			url : '/sites/corpoderma/index.html'
		},{
			title : 'Money Labels',
			new : false,
			img : 'moneylabels_logo.png',
			id : 'moneylabels_description',
			url : 'https://marketplace.firefox.com/app/moneylabels/'
		},{
			title : 'Abece Logopedas',
			new : false,
			img : 'abece_logo.png',
			id : 'abece_description',
			url : '/sites/abece/index.html'
		},{
			title : 'Bevip',
			new : false,
			img : 'bevip_logo.png',
			id : 'bevip_description',
			url : '/sites/bevip/index.html'
		},{
			title : 'Agrupación Marjales',
			new : false,
			img : 'marjales_logo.png',
			id : 'marjales_description',
			url : '/sites/marjales/index.html'
		},{
			title : 'Norestenet',
			new : false,
			img : 'norestenet_logo.png',
			id : 'noreste_description',
			url : '/sites/norestenet/index.html'
		}
	];
	$( document ).ready(function() {
    $('#input-main').focus();
    $('#input-main').blur(function () {
      if ($('#input-main').val()) {
        $(this).parents('span').addClass('inputFilled');
      } else {
      	$(this).parents('span').removeClass('inputFilled');
      }
    });
  });

};

app.controller("MainController",["$scope",MainCtrl]);

}());
