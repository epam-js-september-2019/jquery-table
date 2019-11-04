/* --- INIT --- */
let buttons = `<button class="btn btn-default edit">edit</button>
               <button class="btn btn-default delete">delete</button>`;

let mas = [
    {id:'1', name: 'Apple', count: '56', price: '$2', actions: [buttons], email: 'store1@mail.ru', country: 1, checks: [true,true,false]},
    {id:'2', name: 'PlayStation', count: '12', price: '$1', actions: [buttons], email: 'store2@mail.ru', country: 2, checks: [true,false,false]},
    {id:'3', name: 'Pepsi', count: '43', price: '$7', actions: [buttons], email: 'store3@mail.ru', country: 1, checks: [false,true,false]},
    {id:'4', name: 'Guitar', count: '52', price: '$50', actions: [buttons], email: 'store4@mail.ru', country: 0,checks: [false,false,true]}
];

let cities = [{city1:'Moscow',city2:'Saint-P',city3:'Saratov'},
    {city1:'Minsk',city2:'Brest',city3:'Borisov'},
    {city1:'NY',city2:'LA',city3:'Boston'}];


let str = '';
let table = document.querySelector('tbody');
    mas.forEach((item) => {
        str += `<tr id ="${item.id}">
                  <th scope="row">${item.id}</th>
                       <td><span class="name">${item.name}</span><span class="count">${item.count}</span></td>
                       <td>${item.price}</td>
                       <td>${item.actions}</td>
                </tr>`
    });
    table.innerHTML = str;


/* --- REFRESH --- */

let masRefresh = () => {
    mas.forEach((item,i) =>{
        item.id = i + 1;
    });
};

let tableRefresh = () => {
    str = '';
    mas.forEach((item) => {
        str += `<tr id="${item.id}">
                  <th scope="row">${item.id}</th>
                       <td><span class="name">${item.name}</span><span class="count">${item.count}</span></td>
                       <td>${item.price}</td>
                       <td>${item.actions}</td>
                </tr>`
    });
    table.innerHTML = str;

    showNameInfo();
    renderDeleteButtons();
    renderEditButtons();

};


/* --- DELETE --- */

const renderDeleteButtons = () => {
    let deleteButtons = document.getElementsByClassName('delete');
    Array.from(deleteButtons).forEach((item) => {
        item.addEventListener('click', (e) => {

            let modal = document.querySelector('.modal-delete');
           modal.style.display = 'block';
            let id = item.closest('tr').firstElementChild.textContent;
            let question = document.getElementById('question-delete');
            let tr = document.getElementById(id);
            question.textContent = `Are you sure you want to delete " ${mas[id - 1].name} " ? `;
            let yesButton = document.getElementById('yes-delete');
            let noButton = document.getElementById('no-delete');

            yesButton.onclick = () => {

                let tr = document.getElementById(id);
                tr.outerHTML = '';
                mas.splice(id - 1, 1);
                masRefresh();
                tableRefresh();
                modal.style.display = 'none';
            };

            noButton.onclick = () => {
                modal.style.display = 'none';
            };


        });
    });
}
renderDeleteButtons();


// ---- функция форматирования поля цены -----

function priceFormatAdd(){


    if (document.forms['form'].elements['price'].value != '') {
        if(document.forms['form'].elements['price'].value[0] === '$'){
            document.forms['form'].elements['price'].value = document.forms['form'].elements['price'].value.slice(1);
        }

        document.forms['form'].elements['price'].value = document.forms['form'].elements['price'].value.split(',').join('.');
        document.forms['form'].elements['price'].value = parseFloat(document.forms['form'].elements['price'].value);
        if(isNaN(document.forms['form'].elements['price'].value)){
            document.forms['form'].elements['price'].value = '';
        }
        let a = document.forms['form'].elements['price'].value;
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
        document.forms['form'].elements['price'].value = result;

        if (!~document.forms['form'].elements['price'].value.indexOf('$')) {
            document.forms['form'].elements['price'].value = '$' + document.forms['form'].elements['price'].value;
        }


    }
}

function priceFormatEdit(){
    if (document.forms['form'].elements['price'].value[0] == '-'){
       document.forms['form'].elements['price'].value = '333333';
    }

    if (document.forms['form-edit'].elements['price-edit'].value != '') {
        if(document.forms['form-edit'].elements['price-edit'].value[0] === '$'){
            document.forms['form-edit'].elements['price-edit'].value = document.forms['form-edit'].elements['price-edit'].value.slice(1);
        }
        document.forms['form-edit'].elements['price-edit'].value = document.forms['form-edit'].elements['price-edit'].value.split(',').join('.');
        document.forms['form-edit'].elements['price-edit'].value = parseFloat(document.forms['form-edit'].elements['price-edit'].value);
        if(isNaN(document.forms['form-edit'].elements['price-edit'].value)){
            document.forms['form-edit'].elements['price-edit'].value = '';
        }
        let a = document.forms['form-edit'].elements['price-edit'].value;
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
        document.forms['form-edit'].elements['price-edit'].value = result;

        if (!~document.forms['form-edit'].elements['price-edit'].value.indexOf('$')) {
            document.forms['form-edit'].elements['price-edit'].value = '$' + document.forms['form-edit'].elements['price-edit'].value;
        }


    }
}

/*----  Отображение имён ---- */
const showNameInfo = () => {

    let tr = document.querySelectorAll('tr');
    Array.from(tr).forEach(tr => {
        if (tr.hasAttribute('id')) {
            tr.children[1].firstChild.addEventListener('click', (item) => {
                let id = tr.id;
                document.forms['form-edit'].elements['name-edit'].value = mas[id - 1].name;
                document.forms['form-edit'].elements['email-edit'].value = mas[id - 1].email;
                document.forms['form-edit'].elements['count-edit'].value = mas[id - 1].count;
                document.forms['form-edit'].elements['price-edit'].value = mas[id - 1].price;
                document.getElementById('modal-edit-id').style.display = 'block';
                document.getElementById("button-save-changes-edit").style.display = 'none';

                let inputs = document.forms['form-edit'].querySelectorAll('input');
                Array.from(inputs).forEach(item => {
                    item.setAttribute('readonly','');
                });
                let checkboxEdit = document.getElementById('checkbox-edit-id');

                let select = document.getElementById('select-edit');
                select.selectedIndex = mas[id-1].country;
                select.setAttribute('disabled','');
                checkboxEdit.innerHTML = `
        <input type="checkbox" disabled>Select All<br>
        <input type="checkbox" disabled ${mas[id-1].checks[0] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city1}<br>
        <input type="checkbox" disabled ${mas[id-1].checks[1] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city2}<br>
        <input type="checkbox" disabled ${mas[id-1].checks[2] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city3}<br>        
     `


                let closeButtonEdit = document.getElementById('button-cancel-edit');

                closeButtonEdit.onclick = function () {
                    select.removeAttribute('disabled');
                    document.getElementById("button-save-changes-edit").style.display = 'initial';
                    Array.from(inputs).forEach(item => {
                        item.removeAttribute('readonly');
                    });
                    let modal = document.getElementById('modal-edit-id');
                    modal.style.display = 'none';

                    checkboxEdit.innerHTML = `
        <input type="checkbox">Select All<br>
        <input type="checkbox" ${mas[id-1].checks[0] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city1}<br>
        <input type="checkbox" ${mas[id-1].checks[1] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city2}<br>
        <input type="checkbox" ${mas[id-1].checks[2] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city3}<br>        
     `
                };
            })
        }
    })
};
showNameInfo();







/*--- SEARCH --- */
const renderSearchButton = () => {

    let button = document.getElementById('search-button');
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('keydown', (e) => {
        if (e.code == "Enter") {
            tableSearch();
            e.preventDefault();
        }
    });

    button.addEventListener('click', () => {
        tableSearch();
    });

    function tableSearch() {
        tableRefresh();
        let table = document.getElementById('table');
        let phrase = document.getElementById('search');
        let regPhrase = new RegExp(search.value, 'i');

        let flag = false;
        for (let i = 1; i < table.rows.length; i++) {
            if (!regPhrase.test(table.rows[i].cells[1].firstElementChild.textContent)) {
                table.rows[i].style.display = 'none';
            }
        }

        let formEdit = document.getElementById('form-edit');
        let editButtons = document.getElementsByClassName("btn btn-default edit");
        Array.from(editButtons).forEach(item => {
            item.addEventListener('click', (e) => {
                let modal = document.getElementById('modal-edit-id');
                modal.style.display = 'block';
                let id = item.closest('tr').firstElementChild.textContent;
                editModal(id);
            });


        });

        function editModal(id) {
            let changeButtonEdit = document.getElementById('button-save-changes-edit');
            let closeButtonEdit = document.getElementById('button-cancel-edit');


        }
    }

};
renderSearchButton();
/* ==== MODAL ==== */

// CLOSE MODAL

const closeDeleteModal = () =>{
    let modal = document.getElementById('modalDelete');
    modal.style.display = 'none';
};

const closeAddModal =() => {
    let modal = document.getElementById('modalAdd');
    modal.style.display = 'none';
};

const closeEditModal = () => {
    let modal = document.getElementById('modal-edit-id');
    modal.style.display = 'none';
}

// ---- ADD BUTTON ---- //
const renderAddButton = () => {

    let addButton = document.getElementById('add');
    addButton.addEventListener('click',() => {
        let modal = document.querySelector('.modal-add');
        let priceFix = document.forms['form'].elements['price'];
        modal.style.display = 'block';
    });


    // ADD MODAL LOGIC
    let flag1 = false;
    let flag2 = false;
    let flag3 = false;
    let flag4 = false;
    let flag5 = false;

    let select = document.getElementById('select');
    let checkbox = document.getElementById('checkbox-id');
    let inputs = checkbox.querySelectorAll('input');

    let inputsSelectAll = checkbox.getElementsByTagName('input');
    let selectAllElem = checkbox.firstElementChild;
    selectAllElem.onclick = function() {
        Array.from(inputsSelectAll).forEach(item => {
            item.setAttribute('checked','');
        });
    };

    select.onchange = function(){
        checkbox.innerHTML = `
        <input type="checkbox">Select All<br>
        <input type="checkbox">${cities[select.selectedIndex].city1}<br>
        <input type="checkbox">${cities[select.selectedIndex].city2}<br>
        <input type="checkbox">${cities[select.selectedIndex].city3}<br>
     `
        let inputsSelectAll = checkbox.getElementsByTagName('input');
        let selectAllElem = checkbox.firstElementChild;
        selectAllElem.onclick = function() {
            Array.from(inputsSelectAll).forEach(item => {
                item.setAttribute('checked','');
            });
        };
        inputs = checkbox.querySelectorAll('input');
    };


    let buttonSaveChanges = document.getElementById('button-save-changes');
    let buttonCancel = document.getElementById('button-cancel');
    let formAdd = document.getElementById('form');
    let priceFix = document.forms['form'].elements['price'];
    buttonSaveChanges.addEventListener('click', (e) => {
        let name = document.forms['form'].elements['name'].value;
        let email = document.forms['form'].elements['email'].value;
        let count = document.forms['form'].elements['count'].value;
        let price = document.forms['form'].elements['price'].value;

        // Проверка на длину имени
        if (name.length === 0) {
            let caut = document.querySelector('.caution.mandatory');
            caut.style.display = 'block';
            flag1 = false;
        }
        else {
            let caut = document.querySelector('.caution.mandatory');
            caut.style.display = 'none';
            flag1 = true;
        }
        if (name.length !== 0 && name.length < 5 || name.length > 15) {
            let caut = document.querySelector('.caution.length');
            caut.style.display = 'block';
            flag1 = false;
        }
        else {
            let caut = document.querySelector('.caution.length');
            caut.style.display = 'none';
            flag1 = true;
        }
        // Проверка на только пробелы
        if (/^\s+$/.test(name)) {
            let caut = document.querySelector('.caution.spaces');
            caut.style.display = 'block';
            flag2 = false;
        }
        else {
            let caut = document.querySelector('.caution.spaces');
            caut.style.display = 'none';
            flag2 = true;
        }
        // Проверка на валидность e-mail
        if (email.length === 0) {
            let caut = document.querySelector('.caution.mandatory.mail');
            caut.style.display = 'block';
            flag3 = false;
        }
        else {
            let caut = document.querySelector('.caution.mandatory.mail');
            caut.style.display = 'none';
            flag3 = true;
        }

        if (email.length !== 0 && !/^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i.test(email)) {
            let caut = document.querySelector('.caution.valid');
            caut.style.display = 'block';
            flag3 = false;
        }
        else {
            let caut = document.querySelector('.caution.valid');
            caut.style.display = 'none';
            flag3 = true;
        }
        //Проверка на количество товара
        if (count.length === 0) {
            let caut = document.querySelector('.caution.mandatory.count-price');
            caut.style.display = 'block';
            flag4 = false;
        }
        else {
            let caut = document.querySelector('.caution.mandatory.count-price');
            caut.style.display = 'none';
            flag4 = true;
        }
        let isNumber = (num) => {
            return isFinite(num) && !isNaN(num);
        };
        if (!isNumber(count)) {
            let caut = document.querySelector('.caution.is-num');
            caut.style.display = 'block';
            flag4 = false;
        }
        else {
            let caut = document.querySelector('.caution.is-num');
            caut.style.display = 'none';
            flag4 = true;
        }
        // Проверка на цену

        if (price.slice(1).length === 0) {
            let caut = document.querySelector('.caution.mandatory.price');
            caut.style.display = 'block';
            flag5 = false;
        }
        else {
            let caut = document.querySelector('.caution.mandatory.price');
            caut.style.display = 'none';
            flag5 = true;
        }

        if (price[1] === '-') {
            let caut = document.querySelector('.caution.pos-num');

                caut.style.display = 'block';
                flag6 = false;

        }
        else {
            let caut = document.querySelector('.caution.pos-num');
            caut.style.display = 'none';
            flag6 = true;
        }
        let inputPrice = document.getElementById('price');

        if (name.length !== 0 && email.length !== 0 && count.length !== 0 && price.length !== 0) {
            if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
                mas.push({
                    id: '',
                    name: name,
                    count: count,
                    price: price,
                    actions: [buttons],
                    email: email,
                    country: select.selectedIndex,
                    checks: [inputs[1].checked,
                        inputs[2].checked,
                        inputs[3].checked,]
                });
                masRefresh();
                tableRefresh();
                document.forms['form'].elements['name'].value = '';
                document.forms['form'].elements['email'].value = '';
                document.forms['form'].elements['count'].value = '';
                document.forms['form'].elements['price'].value = '';
                closeAddModal();

            }
        }
    });

// Модальное Cancel
    buttonCancel.addEventListener('click', (e) => {
        document.forms['form'].elements['name'].value = '';
        document.forms['form'].elements['email'].value = '';
        document.forms['form'].elements['count'].value = '';
        document.forms['form'].elements['price'].value = '';
        let caut1 = document.querySelector('.caution.mandatory');
        caut1.style.display = 'none';
        let caut2 = document.querySelector('.caution.mandatory.mail');
        caut2.style.display = 'none';
        let caut3 = document.querySelector('.caution.mandatory.count-price');
        caut3.style.display = 'none';
        let caut4 = document.querySelector('.caution.mandatory.price');
        caut4.style.display = 'none';
        closeAddModal();

    });

}
renderAddButton();


// --- Modal Edit ---
const renderEditButtons = () => {

    let formEdit = document.getElementById('form-edit');
    let editButtons = document.getElementsByClassName("btn btn-default edit");
    Array.from(editButtons).forEach(item => {
        item.addEventListener('click', (e) => {
            let modal = document.getElementById('modal-edit-id');
            modal.style.display = 'block';
            let id = item.closest('tr').firstElementChild.textContent;
            editModal(id);
        });


    });

    function editModal(id) {
        let flag1 = false;
        let flag2 = false;
        let flag3 = false;
        let flag4 = false;
        let flag5 = false;
        let flag6 = false;

        let changeButtonEdit = document.getElementById('button-save-changes-edit');
        let closeButtonEdit = document.getElementById('button-cancel-edit');
        document.forms['form-edit'].elements['name-edit'].value = mas[id - 1].name;
        document.forms['form-edit'].elements['email-edit'].value = mas[id - 1].email;
        document.forms['form-edit'].elements['count-edit'].value = mas[id - 1].count;
        document.forms['form-edit'].elements['price-edit'].value = mas[id - 1].price;

        let name = document.forms['form-edit'].elements['name-edit'].value;
        let email = document.forms['form-edit'].elements['email-edit'].value;
        let count = document.forms['form-edit'].elements['count-edit'].value;
        let price = document.forms['form-edit'].elements['price-edit'].value;

        /*--- delivery logic default---*/
        let checkboxEdit = document.getElementById('checkbox-edit-id');

        let select = document.getElementById('select-edit');
        select.selectedIndex = mas[id-1].country;
        checkboxEdit.innerHTML = `
        <input type="checkbox">Select All<br>
        <input type="checkbox" ${mas[id-1].checks[0] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city1}<br>
        <input type="checkbox" ${mas[id-1].checks[1] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city2}<br>
        <input type="checkbox" ${mas[id-1].checks[2] ? 'checked' : 'unchecked'}>${cities[mas[id-1].country].city3}<br>
     `

        let inputs = checkboxEdit.getElementsByTagName('input');
        let selectAllElem = checkboxEdit.firstElementChild;
        selectAllElem.onclick = function() {
            Array.from(inputs).forEach(item => {
               item.setAttribute('checked','');
            });
        };

        select.onchange = function(){
            checkboxEdit.innerHTML = `
        <input type="checkbox">Select All<br>
        <input type="checkbox">${cities[select.selectedIndex].city1}<br>
        <input type="checkbox">${cities[select.selectedIndex].city2}<br>
        <input type="checkbox">${cities[select.selectedIndex].city3}<br>
     `
            inputs = checkboxEdit.getElementsByTagName('input');
            selectAllElem = checkboxEdit.firstElementChild;
            selectAllElem.onclick = function() {
                Array.from(inputs).forEach(item => {
                    item.setAttribute('checked','');
                });
            };
        };



        changeButtonEdit.onclick = function () {

let inputsEdit = checkboxEdit.querySelectorAll('input');

            name = document.forms['form-edit'].elements['name-edit'].value;
            email = document.forms['form-edit'].elements['email-edit'].value;
            count = document.forms['form-edit'].elements['count-edit'].value;
            price = document.forms['form-edit'].elements['price-edit'].value;


            if (name.length === 0) {
                let caut = document.querySelector('.caution.mandatory.edit');
                caut.style.display = 'block';
                flag1 = false;
            }
            else {
                let caut = document.querySelector('.caution.mandatory.edit');
                caut.style.display = 'none';
                flag1 = true;
            }
            if (name.length !== 0 && name.length < 5 || name.length > 15) {
                let caut = document.querySelector('.caution.length.edit');
                caut.style.display = 'block';
                flag1 = false;
            }
            else {
                let caut = document.querySelector('.caution.length.edit');
                caut.style.display = 'none';
                flag1 = true;
            }
            // Проверка на только пробелы
            if (/^\s+$/.test(name)) {
                let caut = document.querySelector('.caution.spaces.edit');
                caut.style.display = 'block';
                flag2 = false;
            }
            else {
                let caut = document.querySelector('.caution.spaces.edit');
                caut.style.display = 'none';
                flag2 = true;
            }
            // Проверка на валидность e-mail
            if (email.length === 0) {
                let caut = document.querySelector('.caution.mandatory.mail.edit');
                caut.style.display = 'block';
                flag3 = false;
            }
            else {
                let caut = document.querySelector('.caution.mandatory.mail.edit');
                caut.style.display = 'none';
                flag3 = true;
            }

            if (email.length !== 0 && !/^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i.test(email)) {
                let caut = document.querySelector('.caution.valid.edit');
                caut.style.display = 'block';
                flag3 = false;
            }
            else {
                let caut = document.querySelector('.caution.valid.edit');
                caut.style.display = 'none';
                flag3 = true;
            }
            //Проверка на количество товара
            if (count.length === 0) {
                let caut = document.querySelector('.caution.mandatory.count-price.edit');
                caut.style.display = 'block';
                flag4 = false;
            }
            else {
                let caut = document.querySelector('.caution.mandatory.count-price.edit');
                caut.style.display = 'none';
                flag4 = true;
            }
            let isNumber = (num) => {
                return isFinite(num) && !isNaN(num);
            };
            if (!isNumber(count)) {
                let caut = document.querySelector('.caution.is-num.edit');
                caut.style.display = 'block';
                flag4 = false;
            }
            else {
                let caut = document.querySelector('.caution.is-num.edit');
                caut.style.display = 'none';
                flag4 = true;
            }
            // Проверка на цену
            if (price.slice(1).length === 0) {
                let caut = document.querySelector('.caution.mandatory.price.edit');
                caut.style.display = 'block';
                flag5 = false;
            }
            else {
                let caut = document.querySelector('.caution.mandatory.price.edit');
                caut.style.display = 'none';
                flag5 = true;
            }


            if (price[1] === '-') {
                let caut = document.querySelector('.caution.pos-num.edit');
                    caut.style.display = 'block';
                    flag6 = false;

            }
            else {
                let caut = document.querySelector('.caution.pos-num.edit');
                caut.style.display = 'none';
                flag6 = true;
            }


            if (name.length !== 0 && email.length !== 0 && count.length !== 0 && price.length !== 0) {
                if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {

                        mas[id - 1] = {
                            id: id,
                            name: name,
                            count: count,
                            price: price,
                            actions: [buttons],
                            email: email,
                            country: select.selectedIndex,
                            checks: [inputsEdit[1].checked,
                                inputsEdit[2].checked,
                                inputsEdit[3].checked,]
                        };
                        tableRefresh();
                        let modal = document.getElementById('modal-edit-id');
                        modal.style.display = 'none';

                }
            }
        };

        closeButtonEdit.onclick = function () {
            let modal = document.getElementById('modal-edit-id');
            modal.style.display = 'none';
        };
    }
};
renderEditButtons();

// --- sort  buttons --- //

const renderSortButtons = () => {

    let buttonSortNameUp = document.getElementById('up-name');
    let buttonSortPriceUp = document.getElementById('up-price')
    let buttonSortNameDown = document.getElementById('down-name');
    let buttonSortPriceDown = document.getElementById('down-price');

    buttonSortNameDown.addEventListener('click', () => {
        mas = mas.sort(function (a, b) {
            if (a.name < b.name) {
                return -1
            }
            if (a.name > b.name) {
                return 1
            }
            return 0
        });
        buttonSortNameDown.style.display = 'none';
        buttonSortNameUp.style.display = 'block';
        masRefresh();
        tableRefresh();
    });

    buttonSortPriceDown.addEventListener('click', () => {
        mas = mas.sort((obj1, obj2) => {
            return obj1.price.slice(1).split(',').join('.').split('.').join('') - obj2.price.slice(1).split(',').join('.').split('.').join('');
        })
        buttonSortPriceDown.style.display = 'none';
        buttonSortPriceUp.style.display = 'block';
        masRefresh();
        tableRefresh();
    });

    buttonSortNameUp.addEventListener('click', () => {
        mas = mas.sort(function (b, a) {
            if (a.name < b.name) {
                return -1
            }
            if (a.name > b.name) {
                return 1
            }
            return 0
        });
        buttonSortNameDown.style.display = 'block';
        buttonSortNameUp.style.display = 'none';
        masRefresh();
        tableRefresh();
    });

    buttonSortPriceUp.addEventListener('click', () => {
        mas = mas.sort((obj2, obj1) => {
            return obj1.price.slice(1).split(',').join('.').split('.').join('') - obj2.price.slice(1).split(',').join('.').split('.').join('');
        })
        buttonSortPriceDown.style.display = 'block';
        buttonSortPriceUp.style.display = 'none';
        masRefresh();
        tableRefresh();
    });

};
renderSortButtons();



