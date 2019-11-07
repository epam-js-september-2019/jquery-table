let templates = require('./templates.js');

export function getProductId(){
    return new Date().getTime().toString();
}

export function fillTheForm(productId, array){
    const productInfo = array.filter((item)=>item.id === productId)[0];
    $('#name').val(productInfo.productName);
    $('#email').val(productInfo.supplierEmail);
    $('#count').val(productInfo.count);
    $('#price').val(productInfo.price);
    $('#delivery-input').val(productInfo.deliveryCountry);
    // $('.form-check > input:checkbox:checked').val(productInfo.deliveryCities);
    productInfo.deliveryCities.each(function(){
        $(this).prop('checked', true);
    });
}

export function getTrIdWhenEditOrDelete( context){
    return $(context).parent().parent().parent().attr('id');
}

export function saveChanges(isSuchProductExist, array, productID){
    $('#name, #email, #count, #price').removeClass('invalid');
    $('#name, #email, #count, #price').parent().find('p').addClass('hidden');
    if(isFormValid()) {
        const _productID = productID || getProductId();
        if (isSuchProductExist) {
            array.forEach((item) => {
                if (item.id === _productID) {
                    item.productName = $('#name').val();
                    item.supplierEmail = $('#email').val();
                    item.count = $('#count').val();
                    item.price = $('#price').val();
                    item.deliveryCountry = $('#delivery-input').val();
                    item.deliveryCities = $('.form-check > input:checkbox:checked');
                }
            });
            $('#form')[0].reset();
            $('.close-form').click();
            return;
        }
        array.push({
            productName: $('#name').val(),
            supplierEmail: $('#email').val(),
            count: $('#count').val(),
            price: parseInt($('#price').val()),
            deliveryCountry: $('#delivery-input').val(),
            deliveryCities: $('.form-check > input:checkbox:checked'),
            id: getProductId()
        });
        $('#form')[0].reset();
        $('.close-form').click();
    }
   else{ $('.invalid')[0].focus();}
}

export function tableRerender(productArray) {
    $('tbody').find('tr').each(function(){this.remove()});
    productArray.forEach(function(item){
        $('#product-table > tbody:last-child').append(
            templates.tableRow({
                name: item.productName,
                count: item.count,
                price: item.price
            }));
        $('tbody>tr:last-child').attr('id', item.id);
    });
}

export function sort(param, direction, productArray){
    if (param === 'Name') {
        if (direction) {
            productArray.sort(function (a, b) {
                if (a.productName.toLowerCase() < b.productName.toLowerCase()) return -1;
                if (a.productName.toLowerCase() === b.productName.toLowerCase()) return 0;
                if (a.productName.toLowerCase() > b.productName.toLowerCase()) return 1;
            })
        }
        if (!direction) {
            productArray.sort(function (a, b) {
                if (a.productName.toLowerCase() > b.productName.toLowerCase()) return -1;
                if (a.productName.toLowerCase() === b.productName.toLowerCase()) return 0;
                if (a.productName.toLowerCase() < b.productName.toLowerCase()) return 1;
            })
        }
    }
    if (param === 'Price') {
        if (direction) {
            productArray.sort(function (a, b) {
                if (a.price < b.price) return -1;
                if (a.price === b.price) return 0;
                if (a.price > b.price) return 1;
            })
        }
        if (!direction) {
            productArray.sort(function (a, b) {
                if (a.price > b.price) return -1;
                if (a.price === b.price) return 0;
                if (a.price < b.price) return 1;
            })
        }
    }
}

export function countyListener(cityContainer, value){
$('#delivery-input').click(()=> $(".select-city").empty());
$('.select-city').append(
    templates.cityTable({
        city1: cityContainer[value][0],
        city2: cityContainer[value][1],
        city3: cityContainer[value][2]
    })
);

}

export function search(productArray) {
    const productToSearch = $('.search-input').val();
    if(productToSearch===''){
        return (productArray);
    }
    let result = productArray.filter(function(item){
        if(item.productName.trim() === productToSearch) return item;
    });
    console.log(result);
    return(result);
}

function isFormValid(){
    if(!isNameValid()){
        $('#name').addClass('invalid');
        $('#name').parent().find('p').removeClass('hidden');
    }
    if (!isEmailValid()){
        $('#email').addClass('invalid');
        $('#email').parent().find('p').removeClass('hidden');
    }
    if(!isCountValid()){
        $('#count').addClass('invalid');
        $('#count').parent().find('p').removeClass('hidden');
    }
    if(!isPriceValid()){
        $('#price').addClass('invalid');
        $('#price').parent().find('p').removeClass('hidden');
    }
    if (!isNameValid() || !isEmailValid() || !isCountValid() || !isPriceValid()) return false;
    return true;

}
function isNameValid() {

    return /[a-zA-Z\s]{5,15}/.test($('#name').val())&&$('#name').val().trim()!=='';
}

function isEmailValid() {
    return /[a-zA-Z0-9-_\.]+@+[a-zA-Z\.a-z]+/.test($('#email').val());
}

function isCountValid() {
    return /[^0]?\d/.test($('#count').val());
}

function isPriceValid() {
    return /[^0]?\d/.test($('#price').val());
}

