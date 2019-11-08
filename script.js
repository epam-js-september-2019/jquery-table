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

    const DATA = [];
    countrySelect.on('change', function () {
        if (countrySelect.val() === 'russia') {
            $('#russia').addClass('d-flex').removeClass('d-none');
            $('#usa').removeClass('d-flex').addClass('d-none');
            $('#belarus').removeClass('d-flex').addClass('d-none');
        }
        if (countrySelect.val() === 'usa') {
            $('#usa').addClass('d-flex').removeClass('d-none');
            $('#russia').removeClass('d-flex').addClass('d-none');
            $('#belarus').removeClass('d-flex').addClass('d-none');
        }
        if (countrySelect.val() === 'belarus') {
            $('#belarus').addClass('d-flex').removeClass('d-none');
            $('#russia').removeClass('d-flex').addClass('d-none');
            $('#usa').removeClass('d-flex').addClass('d-none');
        }
    });

    let numbersInputCheck = (element) => {
        element.bind("change keyup input click", function() {
            if (this.value.match(/[^0-9]/g)) {
                this.value = this.value.replace(/[^0-9]/g, '');
            }
        });
    };

    $( "button.product-list__add-button" ).on( "click", function( event ) {
        numbersInputCheck(countInput);
        // numbersInputCheck(priceInput);
        formBox.addClass('product-form--show');
        overlay.show();
    });


    $(document).keyup(function( event ) {
        if(event.which === 27) {
            formBox.removeClass('product-form--show');
            popup.removeClass('popup--show');
            $('div.product-info').removeClass('d-flex');
            overlay.hide();
        }
    });

    $( "button.product-form__cancel" ).on( "click", function( event ) {
        formBox.removeClass('product-form--show');
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
        if(priceInput.val() === '' || priceInput.val()[0] === '0' || priceInput.val().length < 3 || priceInput.val().length > 21) {
            warningShow(priceInput, $('p.warning-message--price'));
            isCorrect = false;
        } else {
            warningHide(priceInput, $('p.warning-message--price'));
        }

        return isCorrect;
    };

    priceInput.on('keyup', function () {
        if(this.value.length > 2) {
            this.value = this.value.replace('.','');
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

    let createProduct = (name = nameInput.val(), email = emailInput.val(), count = countInput.val(), price = priceStr) => {
          return `<tr class="table-row" data-row="${name}">
                <td class="align-middle">
                    <a href="#" class="name-link">${name}</a>
                    <span class="float-right product-count border border-info rounded px-2">${count}</span>
                </td>
                <td class="align-middle">${price}</td>
                <td class="align-middle">
                    <button class="btn btn-primary button-edit" type="button" data="${name}">Edit</button>
                    <button class="btn btn-danger button-delete float-right" type="button" data="${name}">Delete</button>
                </td>
            </tr>`;
    };

    let createProductInfo = (name = nameInput.val(), email = emailInput.val(), count = countInput.val(), price = priceStr) => {
        return  `<div class="product-info flex-column position-absolute container border border-primary px-5 py-4 shadow-lg bg-white w-25" id="${name}">
                    <p class="my-2">Name: ${name}</p>
                    <p class="my-2">Email: <span>${email}</span></p>
                    <p class="my-2">Count: <span>${count}</span></p>
                    <p class="my-2">Price: <span>${price}</span></p>
                    <p class="my-2">Delivery: <span>Russia</span></p>
                    <button class="align-self-start btn btn-primary mt-2 w-100 close-button" type="button">Close</button>
                </div>`;
    };


    let onFormActivate = () => {
        if(!reqInput.val()) {
            return false;
        }
        if(!formValuesCheck()) {
            return false;
        }
        DATA[nameInput.val()] = {name: nameInput.val(), email: emailInput.val(), count: parseInt(countInput.val()), priceNumberData: parseInt(priceInput.val().replace(/[$,.]/g,'')), priceData: priceInput.val()};
        console.log(DATA);
        priceStr = priceInput.val();

        if (isEdit) {
            editableElement.html(createProduct().replace(/(<tr[^>]+>|<\/tr>)/gi, ''));
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
            // console.log(this.text());
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
    // $('button.product-form__save').on('click', function () {
    //     if(!reqInput.val()) {
    //         return false;
    //     }
    //     if(!formValuesCheck()) {
    //         return false;
    //     }
    //     DATA[nameInput.val()] = {name: nameInput.val(), email: emailInput.val(), count: parseInt(countInput.val()), priceData: parseInt(priceInput.val().replace(/[$,.]/g,''))};
    //     console.log(DATA);
    //     priceStr = priceInput.val();
    //
    //     productTable.append(createProduct());
    //     infoContainer.append(createProductInfo());
    //     formBox.removeClass('product-form--show');
    //     overlay.hide();
    //     reqInput.val('');
    //         $('a.name-link').on('click', function () {
    //             // console.log(this.text());
    //             $('#' + $(this).text()).addClass('d-flex');
    //             overlay.show();
    //             $('button.close-button').on('click', function () {
    //                 overlay.hide();
    //                 $('div.product-info').removeClass('d-flex');
    //             })
    //         });
    //
    //         $('button.button-edit').on("click", function () {
    //             formBox.addClass('product-form--show');
    //             overlay.show();
    //             productNameEdit = $(this).attr('data');
    //             console.log($(this).parent().parent());
    //             formBox[0].name.value = DATA[productNameEdit].name;
    //             formBox[0].email.value = DATA[productNameEdit].email;
    //             formBox[0].count.value = DATA[productNameEdit].count;
    //             formBox[0].price.value = DATA[productNameEdit].priceData;
    //             $('button.product-form__save').bind('click', function () {
    //                 $(`[data-row=${productNameEdit}]`).innerHTML.replaceAll(createProduct());
    //                 $('button.product-form__save').unbind('click', editHandler);
    //             });
    //         });
    //
    //         $('button.button-delete').on("click", function () {
    //             productNameDelete.text($(this).attr('data'));
    //             popup.addClass('popup--show');
    //             overlay.show();
    //             tableRow = $(this).parent().parent();
    //             $('button.popup__button--yes').on('click', function () {
    //                 setTimeout(function () {
    //                     tableRow.remove();
    //                 });
    //                 popup.removeClass('popup--show');
    //                 overlay.hide();
    //             });
    //             $('button.popup__button--no').on('click', function () {
    //                 popup.removeClass('popup--show');
    //                 overlay.hide();
    //             });
    //         });
    // });
});



