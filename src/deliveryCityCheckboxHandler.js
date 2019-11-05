$('#select-all-cities').on('change', function () {
  const country = $('#country').val();

  if (this.checked) {
    $('input[id ^= city_]').prop('checked', true);

    tempDelivery[country].length = 0;

    for (let i = 0; i < deliveryCountries[country].length; i += 1) {
      tempDelivery[country].push(deliveryCountries[country][i]);
    }
  } else {
    $('input[id ^= city_]').prop('checked', false);
    tempDelivery[country].length = 0;
  }
});
