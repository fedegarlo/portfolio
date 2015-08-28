  (function () {
    _.mixin({

      c_hito_progreso: function (data) {
        var defaults ={
          literal : '',
          fecha: ''
        };
        return _.template("#hito_progreso", data);
      },

      formatProgress: function (data) {
        var fechaHoy = new Date(),
          progreso;

        fechaHoy = fechaHoy.getTime();
        progreso = (((((fechaHoy - data.fechaCalculo) / 1000) / 3600) / 24) * 100) / data.mediaCalculada;

        return progreso > 100 ? 100 : progreso;
      },

      formatAvatar: function (img, size) {
        var resultado;

        if (!size) {
        	size = 'small';
        }

        switch(size) {
					case 'small':
					  resultado = img;
					  break;
					case 'big':
					  resultado = img.substring(0,img.lastIndexOf('_normal')) + img.substring(img.lastIndexOf('_normal')+7);
					  break;
					case 'medium':
					  resultado = img.substring(0,img.lastIndexOf('_normal')) + '_bigger' + img.substring(img.lastIndexOf('_normal')+7);
					  break;
					default:
					  resultado = img;
					}
        return resultado;
      },

      formatNextProgress: function (data) {
        var fechaHoy = new Date(),
          fechaActualizacion,
          progreso;

        fechaHoy = fechaHoy.getTime();
        fechaActualizacion = (data.mediaCalculada * 24 * 1000 * 3600) + data.fechaCalculo;
        progreso = (((((fechaActualizacion - fechaHoy) / 1000) / 3600) / 24) * 100) / data.mediaCalculada;

        return progreso < 0 ? 0 : progreso;
      },

      isOutOfDate: function (data) {
        var fechaHoy = new Date(),
          fechaActualizacion,
          progreso;

        fechaHoy = fechaHoy.getTime();
        fechaActualizacion = (data.mediaCalculada * 24 * 1000 * 3600) + data.fechaCalculo;

        return fechaActualizacion < fechaHoy ? 1 : 0;
      },

      c_fila_movs_template: function (data) {
        var defaults ={
          elementos: [],
          closable : true,
          classExtra: null
        };
        return _.template("#fila-movs-template", data);
      },

      formatSaldo: function (saldoTotal) {

      saldoTotal=Math.round(saldoTotal*100)/100;
      saldoTotal.toFixed(2);
      saldoTotal = saldoTotal.toString();

      if(saldoTotal.indexOf(".") === -1) {
        saldoTotal = saldoTotal + ".00";
      }
      return saldoTotal;
      },

      formatString: function (literal, data) {

        return literal.replace('{0}', data);
      },

      formatParagraph: function (literal) {
        var resultado='';
        _.each(literal.split('[br]'), function (texto){
          resultado = resultado.concat('<p>').concat(texto).concat('</p>');
        });
        return resultado;
      },

      formatDate: function (value, increment) {
        var fecha = new Date(value),
        fechaHOY = new Date(),
        fechaMovimiento = fecha,
        fechaMilis = fecha.getTime();

        if (increment) {
          fecha = new Date (((((increment) * 1000) * 3600) * 24) + fechaMilis);
        }

        fechaHOY = fechaHOY.getFullYear().toString() + fechaHOY.getMonth().toString() + fechaHOY.getDate().toString();
        fechaMovimiento = fechaMovimiento.getFullYear().toString() + fechaMovimiento.getMonth().toString() + fechaMovimiento.getDate().toString();

        if(parseInt(fechaHOY) === parseInt(fechaMovimiento) + 1) {
          return "Ayer";
        } if (parseInt(fechaHOY) === parseInt(fechaMovimiento)) {
          return "Hoy";
        } else {
          return fecha.getDate() + "/" + (parseInt(fecha.getMonth())+1) + "/" + fecha.getFullYear().toString().substring(0);
        }
      },
      formatLaunchDate: function (value) {
        var fecha = new Date(value);

        return (parseInt(fecha.getMonth())+1) + "/" + fecha.getFullYear().toString().substring(0);
      },
      capitaliseFirstLetter: function (string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      },

      truncate: function (cadena, caracteres) {
        var cadena = cadena;

        if (cadena.length > caracteres) {
          return cadena.substring(0,caracteres) + "...";
        } else {
          return cadena;
        }
        
      }
    });

    _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /\{\{(.+?)\}\}/g,
    escape      : /<%-([\s\S]+?)%>/g
  };
  }());

