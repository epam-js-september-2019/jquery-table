const filter = (() => {
  let type;
  let counter = 0;

  const reset = () => {
    counter = 0;
    $('.sort-triangle').removeClass('down up');
  };

  $('thead a').on('click', function (evt) {
    evt.preventDefault();

    $('.sort-triangle').removeClass('down up');

    if (type === evt.target.dataset.type) {
      counter += 1;
    } else {
      type = evt.target.dataset.type;
      counter = 1;
    }

    const sortIcon = $(this).siblings('.sort-triangle');
    sortIcon.addClass('down');

    $('tbody tr')
      .sort((a, b) => {
        sortIcon.removeClass('up');

        if (counter % 2 === 0) {
          [a, b] = [b, a];
          sortIcon.addClass('up');
        }

        switch (evt.target.dataset.type) {
          case 'string':
            return $(b)
              .find('td a')
              .text()
              .toLowerCase()
              .localeCompare(
                $(a)
                  .find('td a')
                  .text()
                  .toLowerCase()
              );

          case 'number':
            return (
              priceUnformat(
                $(b)
                  .find('td:eq(1)')
                  .text()
              )
              - priceUnformat(
                $(a)
                  .find('td:eq(1)')
                  .text()
              )
            );
        }
      })
      .appendTo('tbody');
  });

  return { reset };
})();
