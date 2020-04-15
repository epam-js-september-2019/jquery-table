$(function () {
    let tableRows;
    let sortIconName = $('#sort-symbol');
    let sortIconPrice = $('#sort-symbol-price');

    let nameSortUp = true;
    let nameSort = () => {
        nameSortUp = !nameSortUp;
        nameSortUp ? sortIconName.text('↑') : sortIconName.text('↓');
        tableRows = $('table.table').find('.table-row');
        tableRows.sort(function (a,b) {
            return nameSortUp ? $(a).find('[data-name=name-sort]').attr('data-value').toUpperCase().localeCompare($(b).find('[data-name=name-sort]').attr('data-value').toUpperCase()) :
                $(b).find('[data-name=name-sort]').attr('data-value').toUpperCase().localeCompare($(a).find('[data-name=name-sort]').attr('data-value').toUpperCase());
        }).appendTo('table');
    };

    let priceSortUp = true;
    let priceSort = () => {
        priceSortUp = !priceSortUp;
        priceSortUp ? sortIconPrice.text('↑') : sortIconPrice.text('↓');
        tableRows = $('table.table').find('.table-row');
        tableRows.sort(function (a,b) {
            return priceSortUp ? $(b).find('[data-name=price-sort]').attr('data-value') - $(a).find('[data-name=price-sort]').attr('data-value') :
                $(a).find('[data-name=price-sort]').attr('data-value') - $(b).find('[data-name=price-sort]').attr('data-value');
        }).appendTo('table');
    };

    $('.header-link').on('click', nameSort);
    $('.price-link').on('click', priceSort);
});