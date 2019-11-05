$(function() {
    let formBox = $('form.product-form');
    let overlay = $('div.overlay');
    let productTable = $('table.table');
    let popup = $('div.popup');
    let reqInput = $('input.form-required');
    let nameInput = $('#name');
    let emailInput = $('#email');
    let countInput = $('#count');
    let priceInput = $('#price');
    let regEmail = /[a-zA-Z0-9_\.]+@[a-zA-Z]+\.[a-z]+/;
    let reNumbers = /[0-9]+/;

    let numbersInputCheck = (element) => {
        element.bind("change keyup input click", function() {
            if (this.value.match(/[^0-9]/g)) {
                this.value = this.value.replace(/[^0-9]/g, '');
            }
        });
    };

    $( "button.product-list__add-button" ).on( "click", function( event ) {
        numbersInputCheck(countInput);
        numbersInputCheck(priceInput);
        formBox.addClass('product-form--show');
        overlay.show();
    });


    $(document).keyup(function( event ) {
        if(event.which === 27) {
            formBox.removeClass('product-form--show');
            popup.removeClass('popup--show');
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

        if( nameInput.val().length < 5 ||
            nameInput.val().length > 15 ||
            // nameInput.val().length === (nameInput.val()).match(/ /g).length ||
            nameInput.val().length === 0) {
            warningShow(nameInput, $('p.warning-message--name'));
            return false;
        } else {
            warningHide(nameInput, $('p.warning-message--name'));
        }


        if(!regEmail.test(emailInput.val())) {
            warningShow(emailInput, $('p.warning-message--email'));
            return false;
        } else {
            warningHide(emailInput, $('p.warning-message--email'));
        }


        if(!reNumbers.test(countInput.val())) {
            warningShow(countInput, $('p.warning-message--count'));
            return false;
        } else {
            warningHide(countInput, $('p.warning-message--count'));
        }

        return true;
    };


    $('button.product-form__save').on('click', function () {
        if(!reqInput.val()) {
            return false;
        }
        if(!formValuesCheck()) {
            return false;
        }
        productTable.append(`<tr class="table-row">
                <td class="align-middle">
                    <a href="#">${nameInput.val()}</a>
                    <span class="float-right product-count">${countInput.val()}</span>
                </td>
                <td class="align-middle">$${$('#price').val()}</td>
                <td class="align-middle">
                    <button class="btn btn-primary button-edit" type="button">Edit</button>
                    <button class="btn btn-danger button-delete float-right" type="button">Delete</button>
                </td>
            </tr>`);
        formBox.removeClass('product-form--show');
        overlay.hide();
        reqInput.val('');
            $('button.button-delete').on("click", function () {
                popup.addClass('popup--show');
                overlay.show();
                let $parent = $(this).parent().parent();
                $('button.popup__button--yes').on('click', function () {
                    setTimeout(function () {
                        $parent.remove();
                    });
                    popup.removeClass('popup--show');
                    overlay.hide();
                });
                $('button.popup__button--no').on('click', function () {
                    popup.removeClass('popup--show');
                    overlay.hide();
                });
            });
    });
});



