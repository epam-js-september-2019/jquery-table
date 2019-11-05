const cityRender = (city, index) => {
  const cityTemplate = $('#delivery-city-template').html();
  const compiled = _.template(cityTemplate);

  const country = $('#country').val();
  let checked;

  if (tempDelivery[country].includes(city)) {
    checked = 'checked';
  }

  const cityData = {
    city,
    checked,
    index
  };

  $('#city-list').children().append(compiled(cityData));
};
