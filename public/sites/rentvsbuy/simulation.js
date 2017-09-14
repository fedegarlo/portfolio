var tsec = '';
function simulateMorgage(value, province) {
  return new Promise((resolve, reject) => {
    var params = [
      'costeVivienda=' + value,
      'impSolicita=80000',
      'plazo=30',
      'ingresos=2000',
      'numTitu=1'
    ];
    $.ajax({
      url: 'https://www.bbva.es/sistema/datos_hipotecas.jsp?' + params.join('&'),
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'mortgageConditionsCallback',

      // Work with the response
      success: function (conditions) {
        simulation(conditions.Hipotecas);
      },
      error: function (e) {
        reject(e);
      }
    });

    function simulation({HipotecaFija}) {
      var params = {
        getFlows: true,
        getCosts: true,
        homeInsurance: homeInsurance,
        lifeInsurance: {
          fee: {
            amount: HipotecaFija.SeguroProteccionPagos.replace(/[,.]/g,'')/100
          },
          period: {
            timeUnit: {
              id: 'S'
            }
          }
        },
        propertyValue: {
          amount: value,
          currency: 'EUR'
        },
        mortgageAmount: {
          amount: value*0.8,
          currency: 'EUR'
        },
        openingFee: {
          amount: 0.003125,
          currency: 'EUR'
        },
        newHouse: true,
        usualHome: true,
        province: {
          id: province.slice(0,2) || 28
        },
        tranches: [{
          monthsTerm: 360,
          spreadInterestRate: +HipotecaFija.Diferencial,
          referenceIndex: {
            id: 0
          }
        }]
      };
      $.ajax({
        dataType: 'json',
        url: '/afi',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(params),
        success: function (conditions) {
          resolve(conditions);
        },
        error: function (e) {
          reject(e);
        }
      });
    }
  });
}
const homeInsurance = {
          fee: {
            amount: 134.29
          },
          period: {
            timeUnit: {
              id: 'A'
            }
          }
        };