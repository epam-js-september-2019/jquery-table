$(function() {
    let formBox = $('form.product-form');
    let overlay = $('div.overlay');
    let productTable = $('table.table');
    let popup = $('div.popup');
    let reqInput = $('input.form-required')
    let infoContainer = $('div.info-container');
    let countrySelect = $('#country');
    let productNameEdit;
    let editableElement;
    let editableInfo;

    let ESC_BUTTON = 27;
    let ENTER_BUTTON = 13;

    let isEdit;

    let priceStr;


    let isCorrect;
    let tableRow;

    let nameInput = $('#name');
    let emailInput = $('#email');
    let countInput = $('#count');
    let priceInput = $('#price');
    let productNameDelete = $('#product');
    let regEmail = /[a-zA-Z0-9_\.]+@[a-zA-Z]+\.[a-z]+/;
    let reNumbers = /[0-9]+/;
    let checkedCheckboxes;
    let deliveryCheckboxes;

    const DATA = [];

    let selectAll = $('#selectAll');

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



    let numbersInputCheck = (element) => {
        element.bind("change keyup input click", function() {
            if (this.value.match(/[^0-9]/g)) {
                this.value = this.value.replace(/[^0-9]/g, '');
            }
        });
    };

    let priceInputCheck = (element) => {
        element.bind("change keyup input click", function() {
            if (this.value.match(/[^0-9]/g)) {
                this.value = this.value.replace(/[^0-9$,\.]/g, '');
            }
        });
    };


    $( "button.product-list__add-button" ).on( "click", function( event ) {
        numbersInputCheck(countInput);
        priceInputCheck(priceInput);
        formBox.addClass('product-form--show');
        overlay.show();
    });


    $(document).keyup(function( event ) {
        if(event.which === ESC_BUTTON) {
            formBox.removeClass('product-form--show');
            popup.removeClass('popup--show');
            $('div.product-info').removeClass('d-flex');
            reqInput.val('');
            overlay.hide();
        }
    });

    $( "button.product-form__cancel" ).on( "click", function( event ) {
        formBox.removeClass('product-form--show');
        reqInput.val('');
        overlay.hide();
    });

    let warningShow = (element, message) => {
        element.css('box-shadow', '0 0 5px red');
        message.show();
    };

    let warningHide = (element, message) => {
        element.css('box-shadow', 'none');
        message.hide();
    };

    let formValuesCheck = () => {
        isCorrect = true;
        if( nameInput.val().length < 5 ||
            nameInput.val().length > 15 ||
            // nameInput.val().length === (nameInput.val()).match(/ /g).length ||
            nameInput.val().length === 0) {
            warningShow(nameInput, $('p.warning-message--name'));
            isCorrect = false;
        } else {
            warningHide(nameInput, $('p.warning-message--name'));
        }


        if(!regEmail.test(emailInput.val())) {
            warningShow(emailInput, $('p.warning-message--email'));
            isCorrect = false;
        } else {
            warningHide(emailInput, $('p.warning-message--email'));
        }

        if(!reNumbers.test(countInput.val())) {
            warningShow(countInput, $('p.warning-message--count'));
            isCorrect = false;
        } else {
            warningHide(countInput, $('p.warning-message--count'));
        }
        if(priceInput.val() === '' ||
            priceInput.val()[0] === '0' ||
            priceInput.val().length > 21) {
            warningShow(priceInput, $('p.warning-message--price'));
            isCorrect = false;
        } else {
            warningHide(priceInput, $('p.warning-message--price'));
        }

        return isCorrect;
    };

    priceInput.on('keyup', function () {
        this.value = this.value.replace('.','');
        if(this.value.length > 2) {;
            this.value = this.value.substring(0, this.value.length - 2) + '.' + this.value.substring(this.value.length - 2, this.value.length);
        }
    });

    priceInput.on('blur', function () {
       if(this.value.length > 2) {
           this.value = '$' + this.value.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
       }
    });

    priceInput.on('focus', function () {
        this.value = this.value.replace('$','').replace(',','');
    });

    let createProduct = (name = nameInput.val(), email = emailInput.val(), count = countInput.val(), price = priceStr, priceData = parseInt(priceInput.val().replace(/[$,.]/g,''))) => {
          return `<tr class="table-row" data-row="${name}">
                <td class="align-middle table-data" data-name="name-sort" data-value="${name}">
                    <a href="#" class="name-link">${name}</a>
                    <span class="float-right product-count border border-info rounded px-2">${count}</span>
                </td>
                <td class="align-middle" data-name="price-sort" data-value="${priceData}">${price}</td>
                <td class="align-middle">
                    <button class="btn btn-primary button-edit" type="button" data="${name}">Edit</button>
                    <button class="btn btn-danger button-delete float-right" type="button" data="${name}">Delete</button>
                </td>
            </tr>`;
    };

    let createProductInfo = (name = nameInput.val(), email = emailInput.val(), count = countInput.val(), price = priceStr, country = countrySelect.val(), cities = checkedCheckboxes.join(', ')) => {
        return  `<div class="product-info flex-column position-absolute container border border-primary px-5 py-4 shadow-lg bg-white w-25" id="${name}">
                    <p class="my-2">Name: ${name}</p>
                    <p class="my-2">Email: <span>${email}</span></p>
                    <p class="my-2">Count: <span>${count}</span></p>
                    <p class="my-2">Price: <span>${price}</span></p>
                    <p class="my-2">Delivery: <span>${country}</span></p>
                    <p class="my-2">Cities: <span>${cities}</span></p>
                    <button class="align-self-start btn btn-primary mt-2 w-100 close-button" type="button">Close</button>
                </div>`;
    };

    let onFormActivate = () => {
        deliveryCheckboxes = $('.delivery input');
        checkedCheckboxes = [];
        if(!reqInput.val()) {
            return false;
        }
        if(!formValuesCheck()) {
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
            delivery: checkedCheckboxes
        };
        priceStr = priceInput.val();

        if (isEdit) {
            editableElement.html(createProduct().replace(/(<tr[^>]+>|<\/tr>)/gi, ''));
            if (productNameEdit !== nameInput.val()) {
                delete DATA[productNameEdit];
            }
            editableInfo.remove();
            infoContainer.append(createProductInfo());
        } else {
            productTable.append(createProduct());
            infoContainer.append(createProductInfo());
        }
        formBox.removeClass('product-form--show');
        overlay.hide();
        reqInput.val('');
        $('a.name-link').on('click', function () {
            $('#' + $(this).text()).addClass('d-flex');
            overlay.show();
            $('button.close-button').on('click', function () {
                overlay.hide();
                $('div.product-info').removeClass('d-flex');
            })
        });

        $('button.button-edit').on("click", function () {
            formBox.addClass('product-form--show');
            overlay.show();
            productNameEdit = $(this).attr('data');
            isEdit = true;
            editableElement = $(this).parent().parent();
            editableInfo = $(`#${productNameEdit}`);
            formBox[0].name.value = DATA[productNameEdit].name;
            formBox[0].email.value = DATA[productNameEdit].email;
            formBox[0].count.value = DATA[productNameEdit].count;
            formBox[0].price.value = DATA[productNameEdit].priceData;
        });

        $('button.button-delete').on("click", function () {
            productNameDelete.text($(this).attr('data'));
            popup.addClass('popup--show');
            overlay.show();
            tableRow = $(this).parent().parent();
            $('button.popup__button--yes').on('click', function () {
                setTimeout(function () {
                    tableRow.remove();
                });
                popup.removeClass('popup--show');
                overlay.hide();
            });
            $('button.popup__button--no').on('click', function () {
                popup.removeClass('popup--show');
                overlay.hide();
            });
        });
        isEdit = false;
    };
    $('button.product-form__save').bind('click', onFormActivate);

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
            if(event.which === ENTER_BUTTON) {
                tableFilter();
            }
        });
    });
    searchButton.on('click', tableFilter);

    let nameSortUp = true;
    $('.header-link').on('click', function (evt) {
        nameSortUp = !nameSortUp;
        nameSortUp ? $('#sort-symbol').text('↑') : $('#sort-symbol').text('↓');
        evt.preventDefault();
        tableRows = $('table.table').find('.table-row');
        tableRows.sort(function (a,b) {
            return nameSortUp ? $(a).find('[data-name=name-sort]').attr('data-value').toUpperCase().localeCompare($(b).find('[data-name=name-sort]').attr('data-value').toUpperCase()) :
                $(b).find('[data-name=name-sort]').attr('data-value').toUpperCase().localeCompare($(a).find('[data-name=name-sort]').attr('data-value').toUpperCase());
        }).appendTo('table');
    });

    let priceSortUp = true;
    $('.price-link').on('click', function (evt) {
        priceSortUp = !priceSortUp;
        priceSortUp ? $('#sort-symbol-price').text('↑') : $('#sort-symbol-price').text('↓');
        evt.preventDefault();
        tableRows = $('table.table').find('.table-row');
        tableRows.sort(function (a,b) {
           return priceSortUp ? $(b).find('[data-name=price-sort]').attr('data-value') - $(a).find('[data-name=price-sort]').attr('data-value') :
                $(a).find('[data-name=price-sort]').attr('data-value') - $(b).find('[data-name=price-sort]').attr('data-value');
        }).appendTo('table');
    });
});



