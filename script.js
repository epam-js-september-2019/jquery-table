$(function() {
    let formBox = $( 'form.product-form' );
    let overlay = $( 'div.overlay' );
    let productTable = $( 'table.table' );
    let popup = $('div.popup');
    let reqInput = $('input.form-required');
    $( "button.product-list__add-button" ).on( "click", function( event ) {
        formBox.addClass('product-form--show');
        overlay.show();
    });
    $( "button.product-form__cancel" ).on( "click", function( event ) {
        formBox.removeClass('product-form--show');
        overlay.hide();
    });

    $('button.product-form__save').on('click', function () {
        if(!reqInput.val()) {
            return false;
        }
        productTable.append(`<tr class="table-row">
                <td class="align-middle">
                    <a href="#">${$('#name').val()}</a>
                    <span class="float-right">N</span>
                </td>
                <td class="align-middle">$${$('#price').val()}</td>
                <td class="align-middle">
                    <button class="btn btn-primary button-edit" type="button">Edit</button>
                    <button class="btn btn-danger button-delete" type="button">Delete</button>
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



