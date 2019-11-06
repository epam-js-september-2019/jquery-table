let buttons = `<button class="btn btn-warning edit">edit</button>
               <button class="btn btn-danger delete">delete</button>`;

let mas = [
    {id:'1', name: 'Apple', count: '56', price: '$2', actions: [buttons], email: 'store1@mail.ru', country: 1, checks: [true,true,false]},
    {id:'2', name: 'PlayStation', count: '12', price: '$1', actions: [buttons], email: 'store2@mail.ru', country: 2, checks: [true,false,false]},
    {id:'3', name: 'Pepsi', count: '43', price: '$7', actions: [buttons], email: 'store3@mail.ru', country: 1, checks: [false,true,false]},
    {id:'4', name: 'Guitar', count: '52', price: '$50', actions: [buttons], email: 'store4@mail.ru', country: 0,checks: [false,false,true]}
];

let cities = [{city1:'Moscow',city2:'Saint-P',city3:'Saratov'},
    {city1:'Minsk',city2:'Brest',city3:'Borisov'},
    {city1:'NY',city2:'LA',city3:'Boston'}];


mas.forEach((item) => {
    $('tbody').append( `<tr id ="${item.id}">
                  <th scope="row">${item.id}</th>
                       <td><span class="name">${item.name}</span><span class="count">${item.count}</span></td>
                       <td>${item.price}</td>
                       <td>${item.actions}</td>
                </tr>`);
});


/* --- REFRESH --- */

const masRefresh = (mas) => {
    mas.forEach((item,i) =>{
        item.id = i+1;
    });
};
masRefresh(mas);

const tableRefresh = (mas) => {
    $('tbody').html('');
    mas.forEach((item) => {
        $('tbody').append( `<tr id ="${item.id}">
                  <th scope="row">${item.id}</th>
                       <td><span class="name">${item.name}</span><span class="count">${item.count}</span></td>
                       <td>${item.price}</td>
                       <td>${item.actions}</td>
                </tr>`);
    });
    deleteButtonsRender(mas).then(
        result => {
            mas = result.slice();
            masRefresh(mas);
            tableRefresh(mas);

        }
    );
    editButtonsRender(mas).then(
        result => {
            console.log('edit promise resolved');
            mas = result.slice();
            tableRefresh(mas);
        }
    );
    showNameInfo(mas);
};

/* --- DELETE --- */

const deleteButtonsRender = (mas) => {
   return new Promise(resolve => {
       $('.btn.btn-danger.delete').click((e) => {
           let newMas = mas.slice();
           $('.modal-delete').show();
           let id = $(e.currentTarget).closest('tr').attr('id');
           $('#question-delete').text(`Are you sure you want to delete " ${newMas[id - 1].name} " ? `);

           $('#yes-delete').click( () => {
               setTimeout(function(){
                   $(`tr#${id}`).remove();
                   newMas.splice(id - 1, 1);
                   $('#yes-delete').unbind('click');
                   $('.modal-delete').hide();
                   resolve(newMas);
               },1000);


           });
           $('#no-delete').click(() => {
               $('#yes-delete').unbind('click');
               $('.modal-delete').hide();
           })
       });
   });

};
deleteButtonsRender(mas).then(
    result => {
        console.log(" delete promise resolved");
        mas = result.slice();
        masRefresh(mas);
        tableRefresh(mas);
    }
);

/* --- ADD BUTTON --- */

const renderAddButton = (mas) => {
   return new Promise(resolve => {
       let newMas = mas.slice();
       $('#add').click(()=>{
           $('#modalAdd').show();
       });

       let inputs = $('#checkbox-add-id input');
       $('#checkbox-add-id input').first().click(()=>{
           inputs.attr('checked','');
       });

       let selectedCountry = 0;
       $('#select-add').change((e)=>{
           $('#checkbox-add-id').html('');
           $('#checkbox-add-id').append( `
        <input type="checkbox">Select All<br>
        <input type="checkbox">${cities[e.currentTarget.selectedIndex].city1}<br>
        <input type="checkbox">${cities[e.currentTarget.selectedIndex].city2}<br>
        <input type="checkbox">${cities[e.currentTarget.selectedIndex].city3}<br>
     `);
           $('#checkbox-add-id input').first().click(()=>{
               inputs.attr('checked','');
           });
           inputs = $('#checkbox-add-id input');
           selectedCountry = e.currentTarget.selectedIndex;
       });

       let flag1 = false;
       let flag2 = false;
       let flag3 = false;
       let flag4 = false;
       let flag5 = false;
       let flag6 = false;

       $('#button-save-changes-add').click(() => {

           let name = $('#name-add').val();
           let email = $('#email-add').val();
           let count = $('#count-add').val();
           let price = $('#price-add').val();



// Проверка на длину имени
           if (name.length === 0) {
               $('.caution.mandatory.add').show();
               flag1 = false;
           }
           else {
               $('.caution.mandatory.add').hide();
               flag1 = true;
           }
           if (name.length !== 0 && name.length < 5 || name.length > 15) {
               $('.caution.length.add').show();
               flag1 = false;
           }
           else {
               $('.caution.length.add').hide();
               flag1 = true;
           }
           // Проверка на только пробелы
           if (/^\s+$/.test(name)) {
               $('.caution.spaces.add').show();
               flag2 = false;
           }
           else {
               $('.caution.spaces.add').hide();
               flag2 = true;
           }
           // Проверка на валидность e-mail
           if (email.length === 0) {
               $('.caution.mandatory.mail.add').show();
               flag3 = false;
           }
           else {
               $('.caution.mandatory.mail.add').hide();
               flag3 = true;
           }

           if (email.length !== 0 && !/^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i.test(email)) {
               $('.caution.valid.add').show();
               flag3 = false;
           }
           else {
               $('.caution.valid.add').hide();
               flag3 = true;
           }
           //Проверка на количество товара
           if (count.length === 0) {
               $('.caution.mandatory.count-price.add').show();
               flag4 = false;
           }
           else {
               $('.caution.mandatory.count-price.add').hide();
               flag4 = true;
           }
           let isNumber = (num) => {
               return isFinite(num) && !isNaN(num);
           };
           if (!isNumber(count)) {
               $('.caution.is-num.add').show();
               flag4 = false;
           }
           else {
               $('.caution.is-num.add').hide();
               flag4 = true;
           }
           // Проверка на цену

           if (price.slice(1).length === 0) {
               $('.caution.mandatory.price.add').show();
               flag5 = false;
           }
           else {
               $('.caution.mandatory.price.add').hide();
               flag5 = true;
           }

           if (price[1] === '-') {
               $('.caution.pos-num.add').show();
               flag6 = false;

           }
           else {
               $('.caution.pos-num.add').hide();
               flag6 = true;
           }
//    let inputPrice = document.getElementById('price');

           if (name.length !== 0 && email.length !== 0 && count.length !== 0 && price.length !== 0) {
               if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
                 setTimeout(function(){
                     newMas.push({
                         id: '',
                         name: name,
                         count: count,
                         price: price,
                         actions: [buttons],
                         email: email,
                         country: selectedCountry,
                         checks: [inputs[1].checked,
                             inputs[2].checked,
                             inputs[3].checked,]
                     });

                     $('#name-add').val('');
                     $('#email-add').val('');
                     $('#count-add').val('');
                     $('#price-add').val('');
                     $('#modalAdd').hide();

                     resolve(newMas);
                 },1000);

               }
           }
       });

       $('#button-cancel-add').click(()=> {
           $('#name-add').val('');
           $('#email-add').val('');
           $('#count-add').val('');
           $('#price-add').val('');
           $('.caution.mandatory.add').hide();
           $('.caution.mandatory.mail.add').hide();
           $('.caution.mandatory.count-price.add').hide();
           $('.caution.mandatory.price.add').hide();
           $('#modalAdd').hide();

       });
   });
};
renderAddButton(mas).then(
    result => {
        console.log('add promise resolved')
        mas = result.slice();
        masRefresh(mas);
        tableRefresh(mas);
    }
);

/*--- EDIT BUTTONS ---*/

const editButtonsRender = (mas) => {
    return new Promise(resolve => {
        let newMas = mas.slice();
        $('.btn.btn-warning.edit').click((e)=>{
            $('#modal-edit-id').show();
            let id = $(e.currentTarget).closest('tr').attr('id');

            let flag1 = false;
            let flag2 = false;
            let flag3 = false;
            let flag4 = false;
            let flag5 = false;
            let flag6 = false;


            $('#name-edit').val(newMas[id - 1].name);
            $('#email-edit').val(newMas[id - 1].email);
            $('#count-edit').val(newMas[id - 1].count);
            $('#price-edit').val(newMas[id - 1].price);

            let name =  $('#name-edit').val();
            let email =  $('#email-edit').val();
            let count = $('#count-edit').val();
            let price =  $('#price-edit').val();

            $('#select-edit')[0].selectedIndex = newMas[id-1].country;
            let selectedCountry =  $('#select-edit')[0].selectedIndex;

            $('#checkbox-edit').html(`
           <input type="checkbox">Select All<br>
        <input type="checkbox" ${newMas[id-1].checks[0] ? 'checked' : 'unchecked'}>${cities[newMas[id-1].country].city1}<br>
        <input type="checkbox" ${newMas[id-1].checks[1] ? 'checked' : 'unchecked'}>${cities[newMas[id-1].country].city2}<br>
        <input type="checkbox" ${newMas[id-1].checks[2] ? 'checked' : 'unchecked'}>${cities[newMas[id-1].country].city3}<br>
        `);

            let inputs = $('#checkbox-edit input');
            $('#checkbox-edit input').first().click(()=>{
                inputs.attr('checked','');
            });

            $('#select-edit').change((e)=>{
                $('#checkbox-edit').html('');
                $('#checkbox-edit').append( `
        <input type="checkbox">Select All<br>
        <input type="checkbox">${cities[e.currentTarget.selectedIndex].city1}<br>
        <input type="checkbox">${cities[e.currentTarget.selectedIndex].city2}<br>
        <input type="checkbox">${cities[e.currentTarget.selectedIndex].city3}<br>
        `);
                $('#checkbox-edit input').first().click(()=>{
                    inputs.attr('checked','');
                });
                inputs = $('#checkbox-edit input');
                selectedCountry = e.currentTarget.selectedIndex;
            });

            $('#button-save-changes-edit').click(()=>{

                name = $('#name-edit').val();
                email = $('#email-edit').val();
                count = $('#count-edit').val();
                price = $('#price-edit').val();

                if (name.length === 0) {
                    $('.caution.mandatory.edit').show();
                    flag1 = false;
                }
                else {
                    $('.caution.mandatory.edit').hide();
                    flag1 = true;
                }
                if (name.length !== 0 && name.length < 5 || name.length > 15) {
                    $('.caution.length.edit').show();
                    flag1 = false;
                }
                else {
                    $('.caution.length.edit').hide();
                    flag1 = true;
                }
                // Проверка на только пробелы
                if (/^\s+$/.test(name)) {
                    $('.caution.spaces.edit').show();
                    flag2 = false;
                }
                else {
                    $('.caution.spaces.edit').hide();
                    flag2 = true;
                }
                // Проверка на валидность e-mail
                if (email.length === 0) {
                    $('.caution.mandatory.mail.edit').show();
                    flag3 = false;
                }
                else {
                    $('.caution.mandatory.mail.edit').hide();
                    flag3 = true;
                }

                if (email.length !== 0 && !/^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i.test(email)) {
                    $('.caution.valid.edit').show();
                    flag3 = false;
                }
                else {
                    $('.caution.valid.edit').hide();
                    flag3 = true;
                }
                //Проверка на количество товара
                if (count.length === 0) {
                    $('.caution.mandatory.count-price.edit').show();
                    flag4 = false;
                }
                else {
                    $('.caution.mandatory.count-price.edit').hide();
                    flag4 = true;
                }
                let isNumber = (num) => {
                    return isFinite(num) && !isNaN(num);
                };
                if (!isNumber(count)) {
                    $('.caution.is-num.edit').show();
                    flag4 = false;
                }
                else {
                    $('.caution.is-num.edit').hide();
                    flag4 = true;
                }
                // Проверка на цену
                if (price.slice(1).length === 0) {
                    $('.caution.mandatory.price.edit').show();
                    flag5 = false;
                }
                else {
                    $('.caution.mandatory.price.edit').hide();
                    flag5 = true;
                }


                if (price[1] === '-') {
                    $('.caution.pos-num.edit').show();
                    flag6 = false;

                }
                else {
                    $('.caution.pos-num.edit').hide();
                    flag6 = true;
                }

                if (name.length !== 0 && email.length !== 0 && count.length !== 0 && price.length !== 0) {
                    if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
                       setTimeout(function(){
                           newMas[id - 1] = {
                               id: id,
                               name: name,
                               count: count,
                               price: price,
                               actions: [buttons],
                               email: email,
                               country: selectedCountry,
                               checks: [inputs[1].checked,
                                   inputs[2].checked,
                                   inputs[3].checked,]
                           };

                           $('#button-save-changes-edit').unbind('click');
                           $('#modal-edit-id').hide();
                           resolve(newMas);
                       },1000);
                    }
                }
            });

            $('#button-cancel-edit').click(()=>{

                $('#button-save-changes-edit').unbind('click');

                $('#modal-edit-id').hide();
            });

        });
    });

};
editButtonsRender(mas).then(
    result => {
        console.log('edit promise resolved');
        mas = result.slice();
        tableRefresh(mas);
    }
);

/* --- SEARCH --- */

const searchButtonRender = () => {

    $('#search').keydown((e) => {
        if (e.code == "Enter") {
            tableSearch();
            e.preventDefault();
        }
    });

    $('#search-button').click(()=>{
        tableSearch();
    });

    const tableSearch = () => {
        tableRefresh(mas);
        let table = $('#table');
        let phrase = $('#search');
        let regPhrase = new RegExp(search.value, 'i');

        let flag = false;
        for (let i = 1; i < table[0].rows.length; i++) {
            if (!regPhrase.test(table[0].rows[i].cells[1].firstElementChild.textContent)) {
                table[0].rows[i].style.display = 'none';
            }
        }

    };

};
searchButtonRender();

/* --- SORT BUTTONS --- */

const renderSortButtons = () => {

    let buttonSortNameUp = document.getElementById('up-name');
    let buttonSortPriceUp = document.getElementById('up-price');
    let buttonSortNameDown = document.getElementById('down-name');
    let buttonSortPriceDown = document.getElementById('down-price');

    $('#down-name').click(() => {
        mas = mas.sort(function (a, b) {
            if (a.name < b.name) {
                return -1
            }
            if (a.name > b.name) {
                return 1
            }
            return 0
        });
        $('#down-name').hide();
        $('#up-name').show();
        masRefresh(mas);
        tableRefresh(mas);
    });

    $('#down-price').click( () => {
        mas = mas.sort((obj1, obj2) => {
            return obj1.price.slice(1).split(',').join('.').split('.').join('') - obj2.price.slice(1).split(',').join('.').split('.').join('');
        })
        $('#down-price').hide();
        $('#up-price').show();
        masRefresh(mas);
        tableRefresh(mas);
    });

    $('#up-name').click(() => {
        mas = mas.sort(function (b, a) {
            if (a.name < b.name) {
                return -1
            }
            if (a.name > b.name) {
                return 1
            }
            return 0
        });
        $('#up-name').hide();
        $('#down-name').show();
        masRefresh(mas);
        tableRefresh(mas);
    });

    $('#up-price').click( () => {
        mas = mas.sort((obj2, obj1) => {
            return obj1.price.slice(1).split(',').join('.').split('.').join('') - obj2.price.slice(1).split(',').join('.').split('.').join('');
        })
        $('#up-price').hide();
        $('#down-price').show();
        masRefresh(mas);
        tableRefresh(mas);
    });

};
renderSortButtons();


/*--- SHOW NAME INFO --- */
const showNameInfo = () => {

    $('.name').click((e)=>{
        let id = $(e.currentTarget).closest('tr').attr('id');

        $('#name-edit').val(mas[id - 1].name);
        $('#email-edit').val(mas[id - 1].email);
        $('#count-edit').val(mas[id - 1].count);
        $('#price-edit').val(mas[id - 1].price);
        $('#modal-edit-id').show();
        $("#button-save-changes-edit").hide();

        $('#form-edit input').prop('readonly',true);
        $('#select-edit')[0].selectedIndex = mas[id-1].country;
        $('#select-edit').prop('disabled',true);
        $('#checkbox-edit').html(`
        <input type="checkbox" disabled>Select All<br>
        <input type="checkbox" disabled ${mas[id-1].checks[0] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city1}<br>
        <input type="checkbox" disabled ${mas[id-1].checks[1] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city2}<br>
        <input type="checkbox" disabled ${mas[id-1].checks[2] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city3}<br> 
        `);

        $('#button-cancel-edit').click(()=>{
            $('#form-edit input').prop('readonly',false);
            $('#select-edit').prop('disabled',false);
            $('#checkbox-edit').html(`
        <input type="checkbox">Select All<br>
        <input type="checkbox" ${mas[id-1].checks[0] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city1}<br>
        <input type="checkbox" ${mas[id-1].checks[1] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city2}<br>
        <input type="checkbox" ${mas[id-1].checks[2] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city3}<br> 
        `);


         $("#button-save-changes-edit").show();
         $('#modal-edit-id').hide();

        });
    });

};
showNameInfo();

/* --- Price input edit ---- */

const priceFormatAdd = () => {

        if ($('#price-add').val() != '') {
        if($('#price-add').val()[0] === '$'){
            $('#price-add').val($('#price-add').val().slice(1));
        }

        $('#price-add').val($('#price-add').val().split(',').join('.'));
        $('#price-add').val(parseFloat($('#price-add').val()));
        if(isNaN($('#price-add').val())){
            $('#price-add').val('');
        }
        let a = $('#price-add').val();
        a = a.split(',').join('.');
        let b = a.split('.')[0];
        let c = a.split('.')[1];

        let mas = b.split('');
        let result;
        for (let i = mas.length - 3; i > 0; i = i - 3) {
            mas.splice(i, 0, ',');
        }
        let str = mas.join('');

        if (c === undefined) {
            result = `${str}`
        }
        else {
            result = `${str}.${c.slice(0,2)}`
        }
        $('#price-add').val(result);

        if (!~$('#price-add').val().indexOf('$')) {
            $('#price-add').val('$' +  $('#price-add').val());
        }


    }
};

function priceFormatEdit(){
    if ($('#price-edit').val() != '') {
        if($('#price-edit').val()[0] === '$'){
            $('#price-edit').val($('#price-edit').val().slice(1));
        }

        $('#price-edit').val($('#price-edit').val().split(',').join('.'));
        $('#price-edit').val(parseFloat($('#price-edit').val()));
        if(isNaN($('#price-edit').val())){
            $('#price-edit').val('');
        }
        let a = $('#price-edit').val();
        a = a.split(',').join('.');
        let b = a.split('.')[0];
        let c = a.split('.')[1];

        let mas = b.split('');
        let result;
        for (let i = mas.length - 3; i > 0; i = i - 3) {
            mas.splice(i, 0, ',');
        }
        let str = mas.join('');

        if (c === undefined) {
            result = `${str}`
        }
        else {
            result = `${str}.${c.slice(0,2)}`
        }
        $('#price-edit').val(result);

        if (!~$('#price-edit').val().indexOf('$')) {
            $('#price-edit').val('$' +  $('#price-edit').val());
        }


    }
}

/* --- count input add and edit --- */

const forceNumericOnlyAdd = () => {
    $('#count-add').on('input', () => {
        $('#count-add').val($('#count-add').val().replace(/[^0-9]/g, ''));
    });
};

const forceNumericOnlyEdit = () => {
    $('#count-edit').on('input', () => {
        $('#count-edit').val($('#count-edit').val().replace(/[^0-9]/g, ''));
    });
};




