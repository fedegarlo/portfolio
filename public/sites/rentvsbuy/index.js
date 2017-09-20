var seguroAnual = 150;
var seguroInquilino = 120;
var mantenimientoAnual = 0.01;
var IBI = 150;
var comunidad = 60;

function submit() {
  $('#mensualRent').html('--- €');
  var houseVal = +$('#houseValue').val();
  var province = $('#province').val();
  var total = 0;
  var years = +$('#years').val()
  var houseGrow = 1 + $('#housegrow').val()/100;
  var rentgrow = 1 + $('#rentgrow').val()/100;
  var investreturn = 1 + $('#investreturn').val()/100;
  var extras = getExtras();

  simulateMorgage(houseVal, province).then(mortgage => {
    var initialCost = mortgageInitialCost(houseVal, mortgage);
    var recurringCost = mortgageRecurrentCost(mortgage, houseVal, years);
    var monthlyInstallment = mortgage.tranches[0].monthlyInstallment.amount;

    projectInvest(initialCost, monthlyInstallment, years).then(projections => {
        var oportunityCosts = mortgageOportunityCost(mortgage, investreturn, years, initialCost);
        var newOportunityCosts = serviceOportunityCost(projections, initialCost, monthlyInstallment, years);
        var benefits = buyBenefits(mortgage, houseVal, houseGrow, years);

        total =  initialCost + recurringCost + newOportunityCosts - benefits;
        $('#total').html(Math.ceil(total));

        //Despejar el valor del alquiler mensual
        var factorInvest = resolveRentInvestFactors (rentgrow, investreturn, years);
        var factorRent = resolveRentRentFactor (rentgrow, years);

        //Resuelvo la X teniendo en cuenta la fiscalidad
        var rent = ((total - extras) / (0.79*factorInvest + 0.21*factorRent));
        var mensualRent = Math.ceil(rent/12);

        // Pintar los datos
        $('#initialCostBuy').html(Math.ceil(initialCost));
        $('#recurrentCostBuy').html(Math.ceil(recurringCost));
        $('#oportunityCostBuy').html(Math.ceil(oportunityCosts));
        $('#benefitsBuy').html(Math.ceil(benefits));

        $('#mensualRent').html(mensualRent + '€');
        $('#recurringCosts').html( Math.ceil(resolveTotalRent(rent, years, rentgrow)));
        $('#oportunityCosts').html( Math.ceil(resolveOportunityCosts(rent, years, rentgrow, investreturn)));
        $('#initialCostRent').html(Math.ceil(mensualRent * 2));
        $('#benefitsRent').html(Math.ceil(mensualRent));
    });
  });

  function getExtras () {
    return years * seguroInquilino;
  }
}
// ----- BUY -------
function mortgageInitialCost(houseVal, mortgage){
  var neverForgetCosts = Object.keys(mortgage.costs).reduce((acc, key) => acc+mortgage.costs[key].amount, 0);
  return houseVal * 0.2 + neverForgetCosts;
}

function mortgageRecurrentCost(mortgage, houseVal, years){
  var fees =  mortgage.amortisationTable.slice(0, 1 + years*12).reduce((acc, next) => acc + next.installment.amount, 0);
  $('#monthFee').html(mortgage.amortisationTable[1].installment.amount);
  return fees + seguroAnual*years + houseVal*mantenimientoAnual*years + IBI*years + comunidad*years*12;
}

function mortgageOportunityCost(mortgage, investreturn, years, initialCost){
  var anualFee = mortgage.amortisationTable.slice(0, 13).reduce((acc, next) => acc + next.installment.amount, 0);
  var totalFee =  anualFee*years;
  // La formula es rent *  (1- investPercent ^ years ) / (1 - investPercent)
  var totalInvest = anualFee * (1- Math.pow(investreturn, years) ) / (1 - investreturn);

  var initialCostReturns = initialCost * Math.pow(investreturn, years);
  return fiscalidadFondo(totalInvest - totalFee + initialCostReturns - initialCost);
}

function serviceOportunityCost(projections, initialCost, monthlyInstallment, years) {
  var final = projections[years*12].returnValue.amount;
  var finalWithoutInvest = initialCost + monthlyInstallment*12*years;
  return fiscalidadFondo(final-finalWithoutInvest);
}

function fiscalidadFondo(amount) {
  // De 0 a 6.000, tributa al 19% en el 2016.
  // De 6.000 euros a 50.000 euros, tributa al 21% durante 2016.
  // Más de 50.000 euros, tributa al 23% durante 2016.
  if (amount > 49999) {
    return amount * 0.77;
  } else if (amount > 5999) {
    return amount * 0.79;
  } else if (amount > 0) {
    return amount * 0.81;
  }
  return amount;
}

function buyBenefits(mortgage, houseVal, houseGrow, years){
  var finalValue = houseVal*Math.pow(houseGrow, years);
  var plusvalia = 0*(finalValue-houseVal)*0.3;
  var cancellationCost = 0 * mortgageCancellationCost(mortgage, houseVal, years);
  return finalValue - houseVal - plusvalia - cancellationCost;
}

function mortgageCancellationCost(mortgage, houseVal, years) {
  // Notaría	Unos 500 € (pequeños cambios según importe)	500 €
  // Registro	Unos 200 € (pequeños cambios según importe)	200 €
  // Gestoría	150€ a 300 € (no están regulados por Ley, conviene pedir previsión)	250 €
  // Tasación	
  // Según la ficha de https://www.bbva.es/productos/ficha/hipoteca-fija/t000000796
  // Compensación por riesgo de tipo amortización parcial o total del préstamo: hasta un máximo del 1 % del capital pendiente en el momento de la cancelación
  var capitalPendiente = mortgage.amortisationTable[1+years*12].pendingCapital.amount;
  return 500 + 200 + 250 + mortgage.costs.mortgageValuation.amount + capitalPendiente*0.01;
}

// ----- RENT -------


/*****
 * r - rent grow
 * b - invest return
 * n - years 
 */
function resolveRentInvestFactors (r, b, n) {
  //La formula es b ( b^n + b^n-1 * r + ... + r ^ n-1 )
  var i = n-1;
  var result = Math.pow(b, i);

  while (i>1) {
    i--;
    result += Math.pow(b, i)*Math.pow(r, n-i-1);
  }
  return b * (result + Math.pow(r, n-1));
}

function resolveRentRentFactor(rentGrow, years) {
  // Formula (1- rentGrow ^ years ) / (1 - rentGrow)
  return (1- Math.pow(rentGrow, years) ) / (1 - rentGrow);
}

//Sumatorio de todos los alquileres, n años, multiplicado por el interés compuesto de r
function resolveTotalRent (rent, years, rentGrow) {
  // La formula es rent *  (1- rentGrow ^ years ) / (1 - rentGrow)
  return rent * (1- Math.pow(rentGrow, years) ) / (1 - rentGrow);
}

/*****
 * r - rent grow
 * b - invest return
 */
function resolveOportunityCosts (rent, years, r, b) {
  // La formula seria rent * b(b^n + b^n-1 * r^1 + ... + r^n) - totalRent
  return rent * resolveRentInvestFactors (r, b, years) -  resolveTotalRent(rent, years, r);
}