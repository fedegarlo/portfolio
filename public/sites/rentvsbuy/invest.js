function projectInvest (initialCost, monthlyInstallment, years) {
  var aportacion = monthlyInstallment;
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/invest?initialContribution=${initialCost}&addedContribution=${aportacion}&years=${years}`,
      type: 'GET',
      contentType: 'application/json',
      success: function (response) {
        resolve(response.projections);
      },
      error: function (e) {
        reject(e);
      }
    });
  });
}