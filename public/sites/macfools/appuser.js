$F = {
  language : navigator.language,
  usuario : window.location.search.substr(1),
  path : window.location.pathname
};

$F.user = $F.path.substr($F.path.lastIndexOf('/')+1);

$F.language = ($F.language !== null && $F.language !== undefined) ? $F.language.substr(0,2) : $F.language ;

if ($F.language !== 'es') {
  if ($F.language !== 'en') {
    $F.language = 'en';
  }
}

require.config({
  paths: {
    "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min",
    "bootstrap" : "lib/bootstrap",
    "twitter" : "lib/twitter",
    "underscore" : "lib/underscore",
    "backbone" : "lib/backbone",
    "retina" : "lib/retina-1.1.0.min",
    "mixins" : "js/mixins",
    "holder" : "lib/holder",
    "l20n" : "lib/l20n.min",
    "jqueryui" : "lib/jquery-ui-1.10.4.custom.min",
    "literals" : "js/app.literals_" + $F.language
  },
  shim: {
	  'underscore': {
	    deps: [],
	    exports: '_'
	  },
	  'backbone': {
	    deps: ['jquery','underscore'],
	    exports: 'Backbone'
	  },
	  'bootstrap': {
	    deps: ['jquery']
	  },
    'mixins': {
      deps: ['jquery', 'underscore']
    },
    'jqueryui': {
      deps: ['jquery']
    }
  },
  waitSeconds: 40
});

 define(['jquery', 'bootstrap', 'twitter', 'underscore', 'backbone', 'retina', 'mixins', 'holder', 'l20n' , 'jqueryui','literals'], function() {
  var Profile = Backbone.Model.extend(),
  Catalogue = Backbone.Model.extend();

  var ctx = L20n.getContext();
  ctx.linkResource('./locales/'+ $F.language +'/website.l20n');
  ctx.requestLocales();


  if (_.isEmpty($F.usuario)) {
    $F.usuario = "";
  }

  var CatalogueList = Backbone.Collection.extend({
      model: Catalogue,
      url: '../datos.php?user=' + $F.user,
      parse: function(response){
       return response.productosUsuario;
    }
  });   

  var CatalogueView = Backbone.View.extend({
      el: "#profileContainer",
      template: _.template($('#tmpl_producto_perfil').html()),
      events : {
      },

      render: function(eventName) {
        var self = this;
        $(self.el).find('#my_product_container').empty();
        $('#uroboroContainer').addClass('hidden');
        _.each(this.model.models, function(model){
          $(self.el).find('#my_product_container').append(_.template($('#tmpl_producto_perfil').html(), model.toJSON()));
        });
        $('#tab6').html('@'+$F.user);
      }
  });

  var Setting = Backbone.Model.extend();

  var SettingList = Backbone.Collection.extend({
      model: Setting,
      url: '../datos.php',
      parse: function(response){
       return response.perfilUsuario;
    }
  });

  var SettingView = Backbone.View.extend({
      el: "#profilelist_container",
      template: _.template($('#preference_pane').html()),
      events : {},
      render: function(eventName) {
      	if (!_.isEmpty(this.model.models)) {
      		$('#profiletab').removeClass('hidden');
      		this.showSettings(this.model.models);
      	};
      },
      showSettings: function(settings) {
      	var self = this;
      	_.each(settings, function(setting){
      		self.$el.append(_.template($('#preference_pane').html(), {data : setting.attributes}));
      	});
      }
  });

  var Buscador = Backbone.Model.extend(),
  	BuscadorList = Backbone.Collection.extend({
      model: Buscador,
      url: '../datos.php',
      parse: function(response){
       return response.autocomplete;
    }
  }),
  	BuscadorView = Backbone.View.extend({
      el: "#bs-example-navbar-collapse-1",
      template: _.template($('#tmpl_subProducto').html()),
      events : {},
      $F : {'order' : 'next'},

      render: function(eventName) {
        var products = [];

        _.each(this.model.models,function (product, iterator){ 
              var nombre;
            if (_.isObject(product) && product.get('fecha').length !== 0 ) {
              if (product.get('principal')) {
                nombre = product.get('nombre');
              } else {
                nombre = product.get('nombre') + ' ' + product.get('version');
              }
            products.push({value : nombre,id : product.get('id'), label : nombre, desc : nombre});
            }
        });
        this.loadSearchProducts(products);

      },
      loadSearchProducts : function (products) {
      	var self = this;

        $( "#productSearch" ).autocomplete({
          source: products,
          select: function( event, ui ) {
            $( "#productSearch" ).val( ui.item.value );
            $('#uroboroContainer').removeClass('hidden');
            $('#uroboro').css({'top':(window.innerHeight/2)-50, 'right':(window.innerWidth/2)-50, 'position' : 'absolute'});
            window.location.href = '/product/' + ui.item.id;
          }
        });
      }
  });  


$(document).ready(function() {

	$('#uroboro').css({'top':(window.innerHeight/2)-50, 'right':(window.innerWidth/2)-50, 'position' : 'absolute'});
	$('#uroboro').removeClass('hidden');

  var 
  catalogues = new CatalogueList(),
  cataloguesView = new CatalogueView({model: catalogues}),
  settings = new SettingList(),
	settingsView = new SettingView({model: settings}),
  buscador = new BuscadorList(),
	buscadorView = new BuscadorView({model: buscador});
  catalogues.fetch();
  settings.fetch();
  buscador.fetch();

  catalogues.bind('reset', function () {
      cataloguesView.render();
  });

  settings.bind('reset', function () {
      settingsView.render();
  });

  buscador.bind('reset', function () {
      buscadorView.render();
  });

    $('#myTab a:not([data-target]):not([data-link])').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $('#myTab a[data-target]').click(function (e) {
      e.preventDefault();
    });

    $('html').click(function(e) {
      if (e.target.id != 'secondaryCatalogue' && $(e.target).parents('#secondaryCatalogue').length == 0 && $F.catalogueOpen) {
        $('#secondaryCatalogue').fadeOut( "slow", function() {
          $('#secondaryCatalogue').find('ul').empty().addClass('emptyCatalogue');
          $('body').find('.modal-backdrop').remove();
          $F.catalogueOpen = false;
        });
      }
    });

    var hash = document.location.hash;
    var prefix = "";
    if (hash) {
        $('.nav-tabs a[href='+hash.replace(prefix,"")+']:not([data-target])').tab('show');
    } 

    // Change hash for page-reload
    $('[data-toggle="tab"]').on('click', function (e) {
        window.location.hash = e.target.hash.replace("#", "#" + prefix);
    });

    $('[data-dismiss="secondaryCatalogue"]').on('click', function (e) {
      $(e.currentTarget).closest('div').fadeOut( "slow", function() {
        $(e.currentTarget).closest('div').find('ul').empty().addClass('emptyCatalogue');
        $('body').find('.modal-backdrop').remove();
        $F.catalogueOpen = false;
      });
    });
});
}); 