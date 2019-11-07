let $ = require('jquery');
let methods = require('./methods.js');
let productArray = [];
let currentID = '';
let sortDirection=false;

let cityContainer = {
    Russia: ['Moscow', "Saint-Petersburg", "Rostov-on-don" ],
    Belarus: ["Minsk", "Brest", "Gomel"],
    USA: ["Los-Angeles", "New-York", "San-Francisco"]
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

$('document').ready(function () {
    $('.search-input').keypress((event)=>{
        if(event.which == 13){
            $('#search').click();
            console.log('enter');
        }
    })
    $('#search').click(()=>{
        let promise = new Promise((resolve, reject)=>{
           setTimeout(()=> {
               const result = methods.search(productArray);
               console.log(result);
               if (result.length > 0) resolve(result);
               if (result.length === 0) reject();
           }, 500);
        });
        promise.then((result)=>{
            methods.tableRerender(result);
            },
            ()=>{
            console.log('There are no matches!');
            }
        );
    });
    $('.add-new').click(() => {
        currentID = '';
    });

    $('#save-product').click(() => {
        const productIDArray = $('tbody').find('tr').map(function () {
            return this.id
        }).get();
        let promise = new Promise((resolve) => {
            setTimeout(() => {
                const isSuchProductExist = productIDArray.some((item) => item === currentID);
                console.log(isSuchProductExist);
                resolve(isSuchProductExist);
            }, 500);
        });
        promise.then((result) => {
            methods.saveChanges(result, productArray, currentID);
            methods.tableRerender(productArray);
        });
    });

    $('.close-form').click(() => $('#form')[0].reset());

    $('.dropdown-item').on('click', function () {
        $('#delivery-input').val($(this).attr('data-value'));
        methods.countyListener(cityContainer, $(this).attr('data-value'));
    });

    $('.select-city').on('click', '.form-check-input', function(){
        if($(this).hasClass('select-all')){
            $('.city').each(function () {
                $(this).prop('checked', $('.select-all').is(':checked'))
            });
    }
        else{
            if($('.select-all').is(':checked')){
                $('.select-all').prop('checked', false);
            }
        }
        if($('.city:checked').length ===3){
            $('.select-all').prop('checked', true);
        }
        if($('.city:checked').length === 0){
            $('.select-all').prop('checked', false);
        }
        });



    $('#product-table').on('click', '#delete-product', function () {
        const deleteAgree = new Promise((resolve, reject) => {
            $('#delete-agree').click(() => resolve());
            $('#delete-reject').click(() => reject());
            $('.close-modal-form').click(() => reject());
        });
        deleteAgree.then(() => {
                let selectedId = methods.getTrIdWhenEditOrDelete(this);
                let productForDelete = productArray.map((item, index) => {
                    if (item.id === selectedId) {
                        return index;
                    }
                })[0];
                productArray.splice(productForDelete, 1);
                $('#' + selectedId).remove();
            },
            () => {
                console.log('Deleting was rejected')
            });
    });

    $('#product-table').on('click', '#edit-product-info', function () {
        currentID = methods.getTrIdWhenEditOrDelete(this);
        methods.fillTheForm(currentID, productArray);
    });

    $('#product-table').on('click', '#show-product-info', function () {
        currentID = $(this).parent().parent().attr('id');
        methods.fillTheForm(currentID, productArray);
    });
    $('.sort').click(function(){
        sortDirection = !sortDirection;
        console.log($(this).text());
        let parameter = '';
        if ($(this).text() === 'Name') parameter = 'Name';
        if ($(this).text() === 'Price') parameter = 'Price';
        let promise = new Promise((resolve) => {
            setTimeout(() => {
                console.log(productArray);
                methods.sort(parameter, sortDirection, productArray);

                resolve(productArray);
            }, 500);
        });
        promise.then((result) => {
            methods.tableRerender(result);
            if (sortDirection){
                $('.arrow'+parameter).removeClass('arrow-down').addClass('arrow-up');
            }
            if(!sortDirection){
                $('.arrow'+parameter).removeClass('arrow-up').addClass('arrow-down');
            }
        });
    });
});


