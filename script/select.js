$(function () {
    let selectAll = $('#selectAll');
    let deliveryCheckboxes;
    let countrySelect = $('#country');

    countrySelect.on('change', function () {
        if (countrySelect.val() === 'Russia') {
            $('#russia').addClass('d-flex').removeClass('d-none');
            $('#usa').removeClass('d-flex').addClass('d-none');
            $('#belarus').removeClass('d-flex').addClass('d-none');
        }
        if (countrySelect.val() === 'USA') {
            $('#usa').addClass('d-flex').removeClass('d-none');
            $('#russia').removeClass('d-flex').addClass('d-none');
            $('#belarus').removeClass('d-flex').addClass('d-none');
        }
        if (countrySelect.val() === 'Belarus') {
            $('#belarus').addClass('d-flex').removeClass('d-none');
            $('#russia').removeClass('d-flex').addClass('d-none');
            $('#usa').removeClass('d-flex').addClass('d-none');
        }
        selectAll.prop('checked', false);
        deliveryCheckboxes = $('.delivery input');
        deliveryCheckboxes.prop('checked', false);
    });

    selectAll.on('change', function () {
        if(selectAll.prop('checked')) {
            $(`[data=${countrySelect.val()}]`).prop('checked', true);
        } else {
            $(`[data=${countrySelect.val()}]`).prop('checked', false);
        }
    });

    window.select = {
        countrySelect
    }
});