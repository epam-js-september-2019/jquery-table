const countryRender = (name) => {
  const compiled = _.template('<option><%= name %></option>');
  $('#country').append(compiled({ name }));
};

Object.keys(deliveryCountries).forEach((name) => countryRender(name));
