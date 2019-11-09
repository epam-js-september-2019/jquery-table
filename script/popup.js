$(function () {
    let productNameDelete = $('#product');
    let popupElement = $('div.popup');
    let tableRow;
    let popupActivate = () => {
        $('button.button-delete').on("click", function () {
            productNameDelete.text($(this).attr('data'));
            popupElement.addClass('popup--show');
            window.util.overlay.show();
            tableRow = $(this).parent().parent();
            $('button.popup__button--yes').on('click', function () {
                setTimeout(function () {
                    tableRow.remove();
                });
                popupElement.removeClass('popup--show');
                window.util.overlay.hide();
            });
            $('button.popup__button--no').on('click', function () {
                popupElement.removeClass('popup--show');
                window.util.overlay.hide();
            });
        });
    };

    window.popup = {
        popupActivate,
        popupElement
    }
});