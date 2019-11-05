$('#city-list').on('click', 'input[id ^= city_]', (evt) => {
  toggleSelectAllCities();

  const country = $('#country').val();
  const city = $(evt.target)
    .siblings('label')
    .text()
    .trim();

  if ($(evt.target).is(':checked')) {
    tempDelivery[country].push(city);
  } else {
    const index = tempDelivery[country].indexOf(city);
    tempDelivery[country].splice(index, 1);
  }
});
