const search = (() => {
  const reset = () => {
    $('form.search input[type="text"]').val('');
    $('form.search').submit();
  };

  $('form.search').on('submit', function (evt) {
    evt.preventDefault();

    const searchPhrase = $(this)
      .find('input:first')
      .val()
      .toLowerCase();

    $('tbody tr').each((index, element) => {
      const productName = $(element)
        .find('td a')
        .text()
        .toLowerCase();

      if (productName.includes(searchPhrase)) {
        $(element).show();
      } else {
        $(element).hide();
      }
    });
  });

  return { reset };
})();
