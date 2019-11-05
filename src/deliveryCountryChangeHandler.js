$('#country').on('change', function () {
  const value = $(this).val();

  if (!Object.prototype.hasOwnProperty.call(tempDelivery, value)) {
    tempDelivery[value] = [];
  }

  $('.delivery-city').remove();

  deliveryCountries[value].forEach((item, index) => {
    cityRender(item, index + 1);
  });
  toggleSelectAllCities();

  $('#city-list').show();
});
