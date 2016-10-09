(function(){
  var app=angular.module("myApp");

var MainCtrl = function($scope){
	$scope.works = [
		{
			title : 'Salvatar Stickers',
			new : true,
			img : 'salvatar.png',
			id : 'salvatar',
			url : 'http://salvatar.fedegarlo.com',
			tags : ['ios', 'stickers', 'xcode', 'diseño']
		},{
			title : 'Salva',
			new : true,
			img : 'salva_app.png',
			id : 'salva',
			url : 'http://appsto.re/es/Pfx6eb.i',
			tags : ['ios', 'xcode', 'node', 'mongodb', 'angular', 'cordova', 'javascript', 'css']
		},{
			title : 'BBVA',
			new : false,
			img : 'bbva.png',
			id : 'helping',
			url : 'http://www.bbva.es',
			tags : ['bbva', 'backbone', 'underscore', 'jquery', 'scss', 'html5', 'javascript', 'mongodb']
		},{
			title : 'Apple Watch Catalogue',
			new : false,
			img : 'watches.png',
			id : 'watch_description',
			url : '/sites/macfools/watch/index.html',
			tags : ['apple', 'watch', 'polymer', 'material design', 'webcomponents', 'javascript', 'phonegap']
		},{
			title : 'Ana y Fede 2014',
			new : false,
			img : 'fedeyana.png',
			id : 'wedding_description',
			url : '/sites/anayfede/index.html',
			tags : ['google maps', 'twitter api', 'responsive', 'nodejs', 'instagram api', 'tipografía iconos']
		},{
			title : 'Macfools',
			new : false,
			img : 'macfools.png',
			id : 'macfools_description',
			url : '/sites/macfools/index.html',
			tags : ['macfools', 'apple', 'responsive design']
		},{
			title : 'Corpo Derma',
			new : false,
			img : 'corpoderma_logo.png',
			id : 'corpoderma_description',
			url : 'http://www.corpoderma.es',
			tags : ['corpoderma', 'php', 'mysql', 'bootstrap', 'responsive']
		},{
			title : 'Money Labels',
			new : false,
			img : 'moneylabels_logo.png',
			id : 'moneylabels_description',
			url : 'https://marketplace.firefox.com/app/moneylabels/',
			tags : ['moneylabels', 'firefoxos', 'javascript']
		},{
			title : 'Portfolio',
			new : false,
			img : 'portfolio.png',
			id : 'portfolio_description',
			url : '',
			tags : ['angular', 'responsive', 'javascript', 'nodejs', 'internacionalización', 'l20n']
		},{
			title : 'Abece Logopedas',
			new : false,
			img : 'abece_logo.png',
			id : 'abece_description',
			url : '/sites/abece/index.html',
			tags : ['abece', 'logopedas']
		},{
			title : 'Bevip',
			new : false,
			img : 'bevip_logo.png',
			id : 'bevip_description',
			url : 'http://corpoderma.esy.es/bevip',
			tags : ['bevip', 'ios', 'php', 'mysql', 'jquery']
		},{
			title : 'Agrupación Marjales',
			new : false,
			img : 'marjales_logo.png',
			id : 'marjales_description',
			url : '/sites/marjales/index.html',
			tags : ['marjales']
		},{
			title : 'Norestenet',
			new : false,
			img : 'norestenet_logo.png',
			id : 'noreste_description',
			url : '/sites/norestenet/index.html',
			tags : ['norestenet']
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
