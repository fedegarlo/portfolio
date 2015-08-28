$F = {
  language : navigator.language,
  usuario : window.location.search.substr(1),
  path : window.location.pathname
};
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

$F.product = QueryString.product;

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
    "underscore" : "lib/underscore",
    "backbone" : "lib/backbone",
    "retina" : "lib/retina-1.1.0.min",
    "mixins" : "js/mixins",
    "holder" : "lib/holder",
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

 define(['jquery', 'bootstrap', 'underscore', 'backbone', 'retina', 'mixins', 'holder' , 'jqueryui','literals'], function() {
  var Profile = Backbone.Model.extend(),
  Catalogue = Backbone.Model.extend();


  if (_.isEmpty($F.usuario)) {
    $F.usuario = "";
  }

  var ProfileList = Backbone.Collection.extend({
      model: Profile,
      url: 'datosSubcatalogo.json',
      parse: function(response){
       return _.filter(response, function (product) {
         return product.id === $F.product;
       });
    }
  });   

  var ProfileView = Backbone.View.extend({
      el: "#mainProduct",
      template: _.template($('#tmpl_producto_general').html()),
      events : {},
      $F : {'order' : 'next'},
      render: function(eventName) {
        if (this.model.models.length !== 0) {
          this.$el.append(_.template($('#tmpl_producto_general').html(), {modelo :this.model.models[0].attributes}));
          this.loadTuits(this.model.models[0].id);
          this.loadTexts(this.model.models[0].id);
          if (!_.isEmpty(this.model.models[0].id)) {
            $('#disqus_thread').show();
          }
        } else {
          this.$el.append(_.template($('#tmpl_mensaje').html(), { titulo : '¡Oops!', mensaje : 'No hemos encontrado el producto que buscabas.'}));
        }
        $F.currentProduct = this.model.models[0].toJSON();
        //window.document.title.replace('::',':' + $F.currentProduct.nombre + $F.currentProduct.version + ':');
      },
      loadTuits : function (id) {
        var $currentTuit,
          defaultTuit = { 
            "text" : "No existen noticias relevantes sobre este producto.",
            "user" : "@fedegarlo",
            "url" : "http://www.fedegarlo.com"
          };

        $.getJSON( "data/tuits.json", function( data ) {
          _.each(data.tuits, function(tuit, index){
            if (tuit.id === id) {
              $currentTuit = $('#versionCatalogue').find('#tuit');
              if (!_.isEmpty(tuit.text)) {
                $currentTuit.html(_.template($('#tmpl_tuit').html(), {data : tuit}));
              } else {
                $currentTuit.html(_.template($('#tmpl_tuit').html(), {data : defaultTuit}));
              }
              $currentTuit.fadeIn();
            }
          });
        });
      },
      loadTexts : function (id) {
        var defaultText = { 
            "text" : "No existen noticias relevantes sobre este producto."
          },
          $currentText = $('#reviewContainer');

        $.getJSON( "data/texts.json", function( data ) {
          _.each(data.texts, function(text, index){
            if (text.id === id) {
              _.each(text.reviews, function(review, index){
                if (review.lang === $F.language) {
                  $currentText.html(_.template($('#tmpl_review').html(), {data : review}));
                }
                $currentText.fadeIn();
            });
          }
        });
      });
    }
  });

  var CatalogueList = Backbone.Collection.extend({
      model: Catalogue,
      url: 'datosSubcatalogo.json?product=' + $F.product,
      parse: function(response){
       return response.subProductos;
    }
  });   

  var CatalogueView = Backbone.View.extend({
      el: "#secondaryProducts",
      template: _.template($('#tmpl_subProducto').html()),
      events : {
        'click [data-i-have]' : 'seleccionarModelo',
        'click [data-i-want]' : 'seleccionarModeloQuiero',
      },
      $F : {'order' : 'next'},

      render: function(eventName) {
        var self = this;
        $(self.el).find('ul#product_container').empty();
        $('#uroboroContainer').addClass('hidden');
        _.each(this.model.models, function(model){
          $(self.el).show().find('ul#product_container').append(_.template($('#tmpl_subProducto').html(), model.toJSON()));
        });
      },
      seleccionarModelo: function(ev) {
        var data = {},
        indice,
        modelos,
        idProducto =$(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
        self = this;
          data.posesion = $(ev.currentTarget).attr('data-i-have');

          _.each(this.model.models, function(model, index) {
            if (model.get('index').toString() === idProducto) {
              indice = index;
            }
          });
        modelos = this.model.models[indice].get('models');

        if ((!_.isEmpty(modelos) && modelos.length !== 1) && !data.posesion) {
          $('#modalSeleccionModelo').find('[data-combo-modelos]').html(_.template($('#tmpl_selector_modelo').html(), {modeloPadre : this.model.models[indice], idModeloPadre : indice,  modelos : modelos, accion: 'tengo'}));
          $('#modalSeleccionModelo').find('#modalSeleccionModeloLabel').html(this.model.models[indice].get('nombre') + ' ' + this.model.models[indice].get('version'));
          $('#modalSeleccionModelo').find('li').on('click', function (e) {

            data.idProducto = $(e.currentTarget).closest('ul').attr('data-id-modelo-padre');
            data.referencia = $(e.currentTarget).closest('ul').attr('data-ref-modelo-padre');
            data.modeloElegido = $(e.currentTarget).attr('data-modelo-seleccionado');
            data.posesion = false;
            self.marcarTengo(data);
            $('#modalSeleccionModelo').modal('hide');
          });
          $('#modalSeleccionModelo').modal('show');
        } else {
          if (modelos.length === 1) {
            data.modeloElegido = modelos[0].id;
          }
          data.idProducto = indice;
          data.referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto');
          this.marcarTengo(data);
        }
      },
      marcarTengo: function(data) {
        var self = this,
        indexProducto;

          this.model.models[data.idProducto].set('ownProduct',_.isEmpty(data.posesion));

          this.model.models[data.idProducto].save({
          eventId : 'toggleSubProduct',
          referencia: data.referencia,
          list: 'own',
          modelo : !_.isEmpty(data.modeloElegido) ? data.modeloElegido : '',
          actionProduct:_.isEmpty(data.posesion)
        }, {
          success: function (model, response) {
            self.render();
          },
          error: function(model, response) {},
          wait: false
        });
      },
      seleccionarModeloQuiero: function(ev) {
        var data = {},
        indice,
        modelos,
        idProducto =$(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
        self = this;
          data.posesion = $(ev.currentTarget).attr('data-i-want');

          _.each(this.model.models, function(model, index) {
            if (model.get('index').toString() === idProducto) {
              indice = index;
            }
          });
        modelos = this.model.models[indice].get('models');

        if ((!_.isEmpty(modelos) && modelos.length !== 1) && !data.posesion) {
          $('#modalSeleccionModelo').find('[data-combo-modelos]').html(_.template($('#tmpl_selector_modelo').html(), {modeloPadre : this.model.models[indice], idModeloPadre : indice,  modelos : modelos, accion: 'quiero'}));
          $('#modalSeleccionModelo').find('#modalSeleccionModeloLabel').html(this.model.models[indice].get('nombre') + ' ' + this.model.models[indice].get('version'));
          $('#modalSeleccionModelo').find('li').on('click', function (e) {

            data.idProducto = $(e.currentTarget).closest('ul').attr('data-id-modelo-padre');
            data.referencia = $(e.currentTarget).closest('ul').attr('data-ref-modelo-padre');
            data.modeloElegido = $(e.currentTarget).attr('data-modelo-seleccionado');
            data.posesion = false;
            self.marcarQuiero(data);
            $('#modalSeleccionModelo').modal('hide');
          });
          $('#modalSeleccionModelo').modal('show');
        } else {
          if (modelos.length === 1) {
            data.modeloElegido = modelos[0].id;
          }
          data.idProducto = indice;
          data.referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto');
          this.marcarQuiero(data);
        }
      },
      marcarQuiero: function(data) {
        var self = this,
        indexProducto;

          this.model.models[data.idProducto].set('wantProduct',_.isEmpty(data.posesion));

          this.model.models[data.idProducto].save({
          eventId : 'toggleSubProduct',
          referencia: data.referencia,
          list: 'want',
          modeloDeseado : !_.isEmpty(data.modeloElegido) ? data.modeloElegido : '',
          actionProduct:_.isEmpty(data.posesion)
        }, {
          success: function (model, response) {
            self.render();
          },
          error: function(model, response) {},
          wait: false
        });
      },
      loadTuits : function (id) {
        var $currentTuit,
          defaultTuit = { 
            "text" : "No existen noticias relevantes sobre este producto.",
            "user" : "@fedegarlo",
            "url" : "http://www.fedegarlo.com"
          };

        $.getJSON( "data/tuits.json", function( data ) {
          _.each(data.tuits, function(tuit, index){
            if (tuit.id === id) {
              $currentTuit = $('#versionCatalogue').find('#tuit');
              if (!_.isEmpty(tuit.text)) {
                $currentTuit.html(_.template($('#tmpl_tuit').html(), {data : tuit}));
              } else {
                $currentTuit.html(_.template($('#tmpl_tuit').html(), {data : defaultTuit}));
              }
              $currentTuit.fadeIn();
            }
          });
        });
      }
  });

  var Setting = Backbone.Model.extend();

  var SettingList = Backbone.Collection.extend({
      model: Setting,
      url: 'datosSubcatalogo.json',
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
      url: 'datosSubcatalogo.json',
      parse: function(response){
       return response;
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
            window.location.href = './product.html?product=' + ui.item.id;
          }
        });
      }
  });  


$(document).ready(function() {

	$('#uroboro').css({'top':(window.innerHeight/2)-50, 'right':(window.innerWidth/2)-50, 'position' : 'absolute'});
	$('#uroboro').removeClass('hidden');

  var profiles = new ProfileList(),
  profilesView = new ProfileView({model: profiles}),
  catalogues = new CatalogueList(),
  cataloguesView = new CatalogueView({model: catalogues}),
  settings = new SettingList(),
	settingsView = new SettingView({model: settings}),
  buscador = new BuscadorList(),
	buscadorView = new BuscadorView({model: buscador});
  profiles.fetch();
  catalogues.fetch();
  settings.fetch();
  buscador.fetch();

  profiles.bind('reset', function () {
      profilesView.render();
  });

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
        window.location.hash = e.currentTarget.hash.replace("#", "#" + prefix);
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