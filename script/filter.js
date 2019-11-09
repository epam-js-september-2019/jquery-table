$(function () {
    let tableData;
    let tableRows;
    let searchInput = $('#search');
    let searchButton = $('#search-button');
    let reg;

    let tableFilter = function () {
        tableData = $('table.table').find('.table-data');
        tableRows = $('table.table').find('.table-row');
        reg = new RegExp(searchInput.val(), 'i');
        if(!searchInput.val()) return tableRows.show();
        tableRows.hide().filter(function () {
            return reg.test(this.textContent);
        }).show();
    };
    searchInput.on('input', function () {
        searchInput.keyup(function( event ) {
            if(event.which === window.util.ENTER_BUTTON) {
                tableFilter();
            }
        });
    });
    searchButton.on('click', tableFilter);
});