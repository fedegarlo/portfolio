$F = {
  language : navigator.language,
  path : window.location.pathname,
  logado : false,
  urlJSON : 'datos.json'
};

$F.language = ($F.language !== null && $F.language !== undefined) ? $F.language.substr(0,2) : $F.language ;

if ($F.language !== 'es') {
  if ($F.language !== 'en') {
    $F.language = 'en';
  }
}

require.config({
  paths: {
    "jquery": "lib/jquery-1.11.0.min",
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

 define(['jquery', 'bootstrap', 'underscore', 'backbone', 'retina', 'mixins', 'holder','jqueryui' ,'literals'], function() {
  var Profile = Backbone.Model.extend();

  var ProfileList = Backbone.Collection.extend({
      model: Profile,
      url: $F.urlJSON,
      parse: function(response){
       return $F.logado ? response.catalogo : response;
    }
  });   

  var ProfileView = Backbone.View.extend({
      el: "#catalogue",
      template: _.template($('#tmpl_producto').html()),
      events : {
      	'click [data-i-have]' : 'seleccionarModelo',
        'click [data-i-want]' : 'seleccionarModeloQuiero',
        'click [data-order]' : 'ordenarProductos'
      },
      $F : {'order' : 'newer'},
      render: function(eventName) {
      	var products = [],
            productosOrdenados = _.sortBy(this.model.models,function (product, iterator){ 
            if (_.isObject(product) && product.get('fecha').length !== 0 && product.get('principal')) {
              return product.get('fecha');
            }
				}),
        self = this;

        if (_.isEmpty($F.order)) {
          $F.order = "newer";
        }

				$(this.el).find('#product_container').empty();
        _.each(this.obtenerOrden(productosOrdenados).reverse(), function(profile, index){
            var profileTemplate = this.template(profile.toJSON());
            $(this.el).find('#product_container').append(profileTemplate);
        }, this);

        this.loadTuits();
        this.loadPrices(productosOrdenados);

      },

      loadTuits : function () {
        var $currentTuit,
          defaultTuit = { 
            "text" : "No existen noticias relevantes sobre este producto.",
            "user" : "@macfools",
            "url" : "http://www.twitter.com/macfools"
          };

        $.getJSON( "data/tuits.json", function( data ) {
          _.each(data.tuits, function(tuit, index){
            $currentTuit = $('#product_container').find('li[data-ref-producto=' + tuit.id + ']').find('#tuit');
            if (!_.isEmpty(tuit.text)) {
              $currentTuit.html(_.template($('#tmpl_tuit').html(), {data : tuit}));
            } else {
              $currentTuit.html(_.template($('#tmpl_tuit').html(), {data : defaultTuit}));
            }
            $currentTuit.fadeIn();
          });
        });
      },
      loadPrices : function (products) {
        var $currentPrice;

        _.each(products, function(product, index){
          $currentPrice = $('#product_container').find('li[data-ref-producto=' + product.id + ']').find('#precioTag');
          if (!_.isNull(product.get('purchasePrice')[0].number)) {
            $currentPrice.html(_.template($('#tmpl_productPrice').html(), {data : product.get('purchasePrice')[0]}));
          }
          $currentPrice.fadeIn();
        });
      },
      obtenerOrden: function(modelos) {
        var productosOrdenados,
          productosDeprecados;

        switch($F.order) {
        case 'older':
          productosOrdenados = _.sortBy(modelos,function (product){ 
            return product.get('fecha');
          });

          productosOrdenados.reverse();
          break;
        case 'next':
          productosOrdenados = _.filter(modelos,function (model){ 
          	return !model.get('outOfDate');
          });
          productosDeprecados = _.filter(modelos,function (model){ 
            return model.get('outOfDate');
          });
          productosOrdenados  = _.sortBy(productosOrdenados,function (product){ 
            return _.formatProgress({ fechaCalculo : product.get('fecha'), mediaCalculada : product.get('mediaDiasActualizar')} );
          });

          productosOrdenados = productosDeprecados.concat(productosOrdenados);
          break;
        default:
          productosOrdenados = _.sortBy(modelos,function (product){ 
            return product.get('fecha');
          });
          break;
        }
        return productosOrdenados;
      },
      ordenarProductos: function(ev) {

        var productosOrdenados,
        criterioDescripcion = $(ev.currentTarget).html(),
        modelos = this.model.models;

        $F.order = $(ev.currentTarget).attr('data-order');

        $(ev.currentTarget).parent('li').addClass('hidden').siblings().removeClass('hidden');

        $(ev.currentTarget).closest('div').find('.dropdown-toggle').html(criterioDescripcion);

        this.render();
      },
      seleccionarModelo: function(ev) {
      	var data = {},
        idProducto =$(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
        self = this;
      		data.posesion = $(ev.currentTarget).attr('data-i-have');
          modelos = this.model.models[idProducto].get('models');

      	if ((!_.isEmpty(modelos) && modelos.length !== 1) && !data.posesion) {
          $('#modalSeleccionModelo').find('[data-combo-modelos]').html(_.template($('#tmpl_selector_modelo').html(), {modeloPadre : this.model.models[idProducto], idModeloPadre : idProducto,  modelos : modelos, accion : 'tengo'}));
          $('#modalSeleccionModelo').find('#modalSeleccionModeloLabel').html(this.model.models[idProducto].get('nombre'));
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
          data.idProducto = idProducto;
          data.referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto');
          this.marcarTengo(data);
        }
      },
      seleccionarModeloQuiero: function(ev) {
        var data = {},
        idProducto =$(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
        self = this;
          data.posesion = $(ev.currentTarget).attr('data-i-want');
          modelos = this.model.models[idProducto].get('models');

        if ((!_.isEmpty(modelos) && modelos.length !== 1) && !data.posesion) {
          $('#modalSeleccionModelo').find('[data-combo-modelos]').html(_.template($('#tmpl_selector_modelo').html(), {modeloPadre : this.model.models[idProducto], idModeloPadre : idProducto,  modelos : modelos, accion : 'quiero'}));
          $('#modalSeleccionModelo').find('#modalSeleccionModeloLabel').html(this.model.models[idProducto].get('nombre'));
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
          data.idProducto = idProducto;
          data.referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto');
          this.marcarQuiero(data);
        }
      },
      marcarTengoProducto: function(ev) {
        var idProducto = $(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
          referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto'),
          posesion = $(ev.currentTarget).attr('data-i-have'),
          data;

          data.idProducto = idProducto;
          data.referencia = referencia;
          data.posesion = posesion;

          this.marcarTengo(data);
      },
      marcarTengo: function(data) {
        var self = this;

          this.model.models[data.idProducto].set('ownProduct',_.isEmpty(data.posesion));

          this.model.models[data.idProducto].save({
          eventId : 'toggleProduct',
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
      marcarQuieroProducto: function(ev) {
        var idProducto = $(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
          referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto'),
          posesion = $(ev.currentTarget).attr('data-i-want'),
          data;

          data.idProducto = idProducto;
          data.referencia = referencia;
          data.posesion = posesion;

          this.marcarQuiero(data);
      },
      marcarQuiero: function(data) {
        var self = this;

          this.model.models[data.idProducto].set('wantProduct',_.isEmpty(data.posesion));

          this.model.models[data.idProducto].save({
          eventId : 'toggleProduct',
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
      }
  });

  var Device = Backbone.Model.extend();

  var DeviceList = Backbone.Collection.extend({
      model: Device,
      url: $F.urlJSON,
      parse: function(response){
       return response.catalogoUsuario.misDispositivos;
    }
  });

  var DeviceView = Backbone.View.extend({
      el: "#my_product_container",
      template: _.template($('#tmpl_producto_customizado').html()),
      events : {
      	'click [data-i-have]' : 'marcarTengoProducto'
      },
      render: function(eventName) {
      	var productosOrdenados,
        productosDeseados,
        ownProducts = 0;

          productosOrdenados = _.filter(this.model.models,function (product){ 
  				    return product.get('ownProduct');
  				});

        if (!_.isEmpty(productosOrdenados)) {

          $(this.el).empty();

          _.each(productosOrdenados.reverse(), function(device, index){
              var deviceTemplate = this.template(device.toJSON());
              $(this.el).append(deviceTemplate);
              ownProducts++;
          }, this);
        } else {
          $(this.el).html(_.template($('#tmpl_mensaje').html(), { titulo : '¡Vámos!', mensaje : 'Aún no tienes ningún producto. Añade todos los que quieras de la primera pestaña.'}));
        }
        this.reloadProfileWidget(ownProducts);
      },
      reloadProfileWidget : function (ownProducts) {
      	$('#profileWidget').find('.ownBubble').find('span').html(ownProducts);
      },
      marcarTengoProducto: function(ev) {
      	var idProducto = $(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
      		referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto'),
      		posesion = $(ev.currentTarget).attr('data-i-have'),
      		self = this,
      		indice;

      		_.each(this.model.models, function(model, index) {
            if (model.get('index').toString() === idProducto) {
              indice = index;
            }
          });
          //Por aqui
      	this.model.models[indice].save({
      		eventId : 'toggleProduct',
      		referencia: referencia,
          list: 'own',
          actionProduct:_.isEmpty(posesion)
      	}, {
      		success: function (model, response) {
      			$(self.$el).find('[data-producto="'+idProducto+'"]').fadeOut( "slow", function() {
              $(this).remove();
              self.reloadProfileWidget(self.model.length-1);
            if ($('#my_product_container').children().length === 0) {
              $('#my_product_container').html(_.template($('#tmpl_mensaje').html(), { titulo : '¡Vámos!', mensaje : 'Aún no tienes ningún producto. Añade todos los que quieras de la primera pestaña.'}));
            }
          });
      		},
      		error: function(model, response) {},
        	wait: false
      	});
      }
  });  

  var Wish = Backbone.Model.extend();

  var WishList = Backbone.Collection.extend({
      model: Wish,
      url: $F.urlJSON,
      parse: function(response){
       return response.catalogoUsuario.miListaDeseos;
    }
  });

  var WishView = Backbone.View.extend({
      el: "#my_wishlist_container",
      template: _.template($('#tmpl_producto_wishlist').html()),
      events : {
        'click [data-i-want]' : 'marcarQuieroProducto'
      },
      render: function(eventName) {
        var productosOrdenados,
        productosDeseados,
        wantProducts = 0;

          productosDeseados = _.filter(this.model.models,function (product){ 
              return product.get('wantProduct');
          });

        if (!_.isEmpty(productosDeseados)) {

          $('#my_wishlist_container').empty();

          _.each(productosDeseados.reverse(), function(device, index){
              var deviceTemplate = _.template($('#tmpl_producto_wishlist').html(), device.toJSON());
              $('#my_wishlist_container').append(deviceTemplate);
              wantProducts++;
          }, this);
        } else {
          $('#my_wishlist_container').html(_.template($('#tmpl_mensaje').html(), { titulo : '¡Vámos!', mensaje : 'Aún no tienes ningún producto. Añade todos los que quieras de la primera pestaña.'}));
        }
        this.reloadProfileWidget(wantProducts);

      },
      reloadProfileWidget : function (wantProducts) {
      	$('#profileWidget').find('.wantBubble').find('span').html(wantProducts);
      },
      marcarQuieroProducto: function(ev) {
        var idProducto = $(ev.currentTarget).closest('li[data-producto]').attr('data-producto'),
          referencia = $(ev.currentTarget).closest('li[data-producto]').attr('data-ref-producto'),
          posesion = $(ev.currentTarget).attr('data-i-want'),
          self = this,
      		indice;

      		_.each(this.model.models, function(model, index) {
            if (model.get('index').toString() === idProducto) {
              indice = index;
            }
          });
          //Por aqui
      	this.model.models[indice].save({
          eventId : 'toggleProduct',
          referencia: referencia,
          list: 'want',
          actionProduct:_.isEmpty(posesion)
        }, {
          success: function (model, response) {
            $(self.$el).find('[data-producto="'+idProducto+'"]').fadeOut( "slow", function() {
              $(this).remove();
              self.reloadProfileWidget(self.model.length-1);
              if ($('#my_wishlist_container').children().length === 0) {
                $('#my_wishlist_container').html(_.template($('#tmpl_mensaje').html(), { titulo : '¡Vámos!', mensaje : 'Aún no tienes ningún producto. Añade todos los que quieras de la primera pestaña.'}));
              }
            });
          },
          error: function(model, response) {},
          wait: false
        });
      }
  });

  var Setting = Backbone.Model.extend();

  var SettingList = Backbone.Collection.extend({
      model: Setting,
      url: $F.urlJSON,
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

  var Catalogue = Backbone.Model.extend();

  var CatalogueList = Backbone.Collection.extend({
      model: Catalogue,
      url: $F.logado ? $F.urlJSON : 'datosSubCatalogo.json',
      parse: function(response){
       return $F.logado ? response.autocomplete : response;
    }
  });   

  var CatalogueView = Backbone.View.extend({
      el: "#bs-example-navbar-collapse-1",
      template: _.template($('#tmpl_subProducto').html()),
      events : {
      	'keydown #productSearch' : 'preventSearch'
      },
      $F : {'order' : 'newer'},

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
      preventSearch : function (e) {
      	if (e.keyCode === 13) {
			    e.preventDefault();
			  }
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

  var Lista = Backbone.Model.extend();

  var ListaList = Backbone.Collection.extend({
      model: Lista,
      url: $F.urlJSON,
      parse: function(response){
       return response.catalogoUsuario;
    }
  });   

  var ListaView = Backbone.View.extend({
      el: "#profileWidget",
      template: _.template($('#tmpl_profile_widget').html()),
      events : {},

      render: function(eventName) {
      	if (!_.isNull(this.model.models[0].get('userinfo').id_usuario)) {
      		$(this.$el).html(_.template($('#tmpl_profile_widget').html(), this.model.models[0].toJSON()));
      	}
        $(this.$el).removeClass('hidden');
      }
  });  

$(document).ready(function() {

	var profiles = new ProfileList(),
	profilesView = new ProfileView({model: profiles});
  profiles.fetch();
  profiles.bind('reset', function () {
      profilesView.render();
  });
     var catalogues = new CatalogueList(),
  cataloguesView = new CatalogueView({model: catalogues});
    catalogues.fetch();
    catalogues.bind('reset', function () {
      cataloguesView.render();
  });

  if ($F.logado) {
  var devices = new DeviceList(),
  devicesView = new DeviceView({model: devices});
  var wishes = new WishList(),
  wishesView = new WishView({model: wishes});
  var settings = new SettingList(),
  settingsView = new SettingView({model: settings});

  var listas = new ListaList(),
  listasView = new ListaView({model: listas});

  devices.fetch();
  wishes.fetch();
  settings.fetch();

  listas.fetch();

  devices.bind('reset', function () {
    devicesView.render();
  });
  wishes.bind('reset', function () {
      wishesView.render();
  });

  profiles.bind('change', function () {
      devices.fetch();
      wishes.fetch();
      devicesView.render();
      wishesView.render();
  });

  devices.bind('change', function () {
      profiles.fetch();
      profilesView.render();
  });

  wishes.bind('change', function () {
      profiles.fetch();
      profilesView.render();
  });

  settings.bind('reset', function () {
      settingsView.render();
  });


  listas.bind('reset', function () {
      listasView.render();
  });
  }

$( "#productSearch" ).focus();

    $('#myTab a:not([data-target])').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    $('#myTab a[data-target]').click(function (e) {
      e.preventDefault();
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