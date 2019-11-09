$(function() {
    let formBox = $('form.product-form');
    let productTable = $('table.table');
    let reqInput = $('input.form-required');
    let infoContainer = $('div.info-container');
    let productNameEdit;
    let editableElement;
    let editableInfo;
    let isEdit;
    let nameInput = $('#name');
    let emailInput = $('#email');
    let countInput = $('#count');
    let priceInput = $('#price');
    let checkedCheckboxes;
    let deliveryCheckboxes;

    const DATA = [];

    $( "button.product-list__add-button" ).on( "click", function() {
        window.form.numbersInputCheck(countInput);
        window.form.priceInputCheck(priceInput);
        formBox.addClass('product-form--show');
        window.util.overlay.show();
    });

    $(document).keyup(function( event ) {
        if(event.which === window.util.ESC_BUTTON) {
            formBox.removeClass('product-form--show');
            window.popup.popupElement.removeClass('popup--show');
            $('div.product-info').removeClass('d-flex');
            reqInput.val('');
            window.util.overlay.hide();
        }
    });

    $( "button.product-form__cancel" ).on( "click", function() {
        formBox.removeClass('product-form--show');
        reqInput.val('');
        window.util.overlay.hide();
    });

    let onFormActivate = () => {
        deliveryCheckboxes = $('.delivery input');
        checkedCheckboxes = [];
        if(!reqInput.val()) {
            return false;
        }
        if(!window.form.formValuesCheck(nameInput, emailInput, countInput, priceInput)) {
            return false;
        }
        deliveryCheckboxes.map(function (element) {
            if (deliveryCheckboxes[element].checked && deliveryCheckboxes[element].dataset.city !== undefined) {
                checkedCheckboxes.push(deliveryCheckboxes[element].dataset.city);
               return element;
            }
        });
        DATA[nameInput.val()] = {
            name: nameInput.val(),
            email: emailInput.val(),
            count: parseInt(countInput.val()),
            priceNumberData: parseInt(priceInput.val().replace(/[$,.]/g,'')),
            priceData: priceInput.val(),
            country: window.select.countrySelect.val(),
            delivery: checkedCheckboxes
        };

        if (isEdit) {
            editableElement.html(window.product
                .createProduct(nameInput.val(), emailInput.val(), countInput.val(), priceInput.val(), parseInt(priceInput.val().replace(/[$,.]/g,''))).replace(/(<tr[^>]+>|<\/tr>)/gi, ''));
            if (productNameEdit !== nameInput.val()) {
                delete DATA[productNameEdit];
            }
            editableInfo.remove();
            infoContainer.append(window.product
                .createProductInfo(nameInput.val(), emailInput.val(), countInput.val(), priceInput.val(), window.select.countrySelect.val(), checkedCheckboxes.join(', ')));
        } else {
            productTable.append(window.product
                .createProduct(nameInput.val(), emailInput.val(), countInput.val(), priceInput.val(), parseInt(priceInput.val().replace(/[$,.]/g,''))));
            infoContainer.append(window.product
                .createProductInfo(nameInput.val(), emailInput.val(), countInput.val(), priceInput.val(), window.select.countrySelect.val(), checkedCheckboxes.join(', ')));
        }

        formBox.removeClass('product-form--show');
        window.util.overlay.hide();
        reqInput.val('');

        $('a.name-link').on('click', function () {
            $('#' + $(this).text()).addClass('d-flex');
            window.util.overlay.show();
            $('button.close-button').on('click', function () {
                window.util.overlay.hide();
                $('div.product-info').removeClass('d-flex');
            })
        });

        $('button.button-edit').on("click", function () {
            formBox.addClass('product-form--show');
            window.util.overlay.show();
            productNameEdit = $(this).attr('data');
            isEdit = true;
            editableElement = $(this).parent().parent();
            editableInfo = $(`#${productNameEdit}`);
            formBox[0].name.value = DATA[productNameEdit].name;
            formBox[0].email.value = DATA[productNameEdit].email;
            formBox[0].count.value = DATA[productNameEdit].count;
            formBox[0].price.value = DATA[productNameEdit].priceData;
        });
        window.popup.popupActivate();
        isEdit = false;
    };
    $('button.product-form__save').bind('click', onFormActivate);
});