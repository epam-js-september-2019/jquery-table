// Инициализация, запись данных в localStorage или их получение, отрисовка имеющихся товаров

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,(c,r)=>('x' == c ?(r=Math.random()*16|0):(r&0x3|0x8)).toString(16));
}

var goods;

if (localStorage.getItem("products") != null) {
    goods = JSON.parse(localStorage.getItem("products"));
    goods.forEach(function(product){
        $("#products").append(createRow(product));
    })
} else {
    goods = [
        {
            id: generateId(),
            name: "Some Product",
            email: "someprdct@prdct.com",
            count: 2,
            price: 123456,
            delivery: ["Saratov", "Moscow", "St. Petersburg", "New-York"],
        },
        {
            id: generateId(),
            name: "Product Name",
            email: "prdctname@prdct.com",
            count: 76,
            price: 7901,
            delivery: ["Saratov", "St. Petersburg", "New-York"],
        },
        {
            id: generateId(),
            name: "Another Product",
            email: "anotherprdct@prdct.com",
            count: 548,
            price: 7788,
            delivery: ["Minsk", "Moscow", "St. Petersburg", "New-York"],
        }
    ];
    localStorage.setItem("products", JSON.stringify(goods));
    goods.forEach(function(product){
        $("#products").append(createRow(product));
    })
}

// Шаблоны

function createRow(product) {
    let tmpl = _.template('<tr id = "<%-id%>"><td class="tdName"><a class="info" href = "#"><%-name%></a><span id = "count"><%-count%></span></td><td class = "tdPrice"><%=priceDivision(price)%></td><td>\
    <a class="btn btn-outline-primary my-btn editBtn" href="#" role="button">Edit</a>\
    <a class="btn btn-outline-secondary my-btn deleteBtn" href="#" role="button" id = "deleteBtn1">Delete</a></td></tr>');
    return tmpl(product);
}

function deleteMessage(product) {
    let tmpl = _.template('<p>Are you sure you want to delete <%-name%> ?</p>\
        <button type="button" class="btn btn-outline-primary modalBtn yesBtn">Yes</button>\
        <button type="button" class="btn btn-outline-secondary modalBtn noBtn">No</button>');
    return tmpl(product);
}

function titleModal(product) {
    let tmpl = _.template('<span><%-name%></span>');
return tmpl(product);
}

function newTitleModal() {
    let tmpl = _.template('<span>Adding a New Product</span>');
return tmpl();
}

// Удаление строки из таблицы и localStorage

$(".deleteBtn").on("click", deleteRow);

function deleteRow (click) {
    let deletedBtn = click.target;
    let deletedRow = deletedBtn.closest("tr");
    $(".modal-delete").css("display", "block");
    var newGoods = JSON.parse(localStorage.getItem("products"));
    var deletedGood = _.remove(newGoods, function(good){
        return good.id == deletedRow.id;
    })
    $(".modal-delete-window-body").append(deleteMessage(deletedGood[0]));
    $(".noBtn").off();
    $(".yesBtn").off();
    $(".noBtn").on("click", function() {
        $(".modal-delete").css("display", "none");
        $(".modal-delete-window-body").children().remove();
    })
    $(".yesBtn").on("click", function() {
        new Promise(function(resolve, reject){
            setTimeout(() => resolve(), 1000);
        }).then(() => {
            deletedRow.parentElement.removeChild(deletedRow);
            localStorage.setItem("products", JSON.stringify(newGoods));
            $(".modal-delete").css("display", "none");
            $(".modal-delete-window-body").children().remove();    
        })
    })
}

// Сортировка по столбцу NAME

function sortNameFromStart(){
    let sortedRows = Array.from(products.rows)
      .slice(1)
      .sort((rowA, rowB) => rowA.cells[0].innerHTML.toLowerCase() > rowB.cells[0].innerHTML.toLowerCase() ? 1 : -1);
    products.tBodies[0].append(...sortedRows);
    $("#triangleName").css("display", "block");
    $("#triangleName-reverse").css("display", "none");
    $("#name").attr("data-sort", "yes");
}

function sortNameFromEnd(){
    let sortedRows = Array.from(products.rows)
      .slice(1)
      .sort((rowA, rowB) => rowA.cells[0].innerHTML.toLowerCase() > rowB.cells[0].innerHTML.toLowerCase() ? -1 : 1);
    products.tBodies[0].append(...sortedRows);
    $("#triangleName").css("display", "none");
    $("#triangleName-reverse").css("display", "block");
    $("#name").attr("data-sort", "no");
}

$("#name").click(function(){
    $("#name").attr("data-sort") == "no" ? sortNameFromStart() : sortNameFromEnd();
})

// Сортировка по столбцу PRICE

function sortPriceFromStart(){
    let sortedRows = Array.from(products.rows)
      .slice(1)
      .sort((rowA, rowB) => parseFloat(rowA.cells[1].innerHTML.replace("$", "").split(",").join("")) > parseFloat(rowB.cells[1].innerHTML.replace("$", "").split(",").join("")) ? 1 : -1);
    products.tBodies[0].append(...sortedRows);
    $("#trianglePrice").css("display", "block");
    $("#trianglePrice-reverse").css("display", "none");
    $("#price").attr("data-sort", "yes");
}

function sortPriceFromEnd(){
    let sortedRows = Array.from(products.rows)
      .slice(1)
      .sort((rowA, rowB) => parseFloat(rowA.cells[1].innerHTML.replace("$", "").split(",").join("")) > parseFloat(rowB.cells[1].innerHTML.replace("$", "").split(",").join("")) ? -1 : 1);
    products.tBodies[0].append(...sortedRows);
    $("#trianglePrice").css("display", "none");
    $("#trianglePrice-reverse").css("display", "block");
    $("#price").attr("data-sort", "no");
}

$("#price").click(function(){
    $("#price").attr("data-sort") == "no" ? sortPriceFromStart() : sortPriceFromEnd();
})

//

class Position {
    constructor() {}
}

// Валидация с помощью плагина jQuery + отображение несфокусированной цены

$("#inputEmail").inputmask("email");

$("#inputPrice")
.blur(() => {
    $("#inputPrice").inputmask("remove");
    $("#inputPrice").val(priceDivision($("#inputPrice").val()))
})
.focus(() => $("#inputPrice").inputmask("decimal"));

$("#inputCount").inputmask("integer");

// Сброс инпутов и селектов

function clearInputs() {
    $("#inputName").val("");
    $("#inputEmail").val("");
    $("#inputPrice").val("");
    $("#inputCount").val("");
    $("#errorName").text("");
    $("#errorEmail").text("");
    $("#errorPrice").text("");
    $("#errorCount").text("");
    $("#inputName").removeClass("inputError");
    $("#inputEmail").removeClass("inputError");
    $("#inputPrice").removeClass("inputError");
    $("#inputCount").removeClass("inputError");
    $(".selectCity").prop("checked", false);
    $(".selectAll").prop("checked", false);
    $(".countries").val("0").prop("selected", true);
    $("#Russia").css("display", "none");
    $("#Belorus").css("display", "none");
    $("#USA").css("display", "none");
}

// Добавление новой строки в таблицу с модалкой

$(".my-btn-addNew").on("click", function() {
    new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), 1000)
    }).then(() => {
        $(".modal-editAddNew").css("display", "block");
        $(".modal-editAddNew-window-title").append(newTitleModal());
        $("#saveBtn").off();
        $("#dontSaveBtn").off();
        $("#saveBtn").on("click", function(){
            new Promise(function(resolve, reject){
                setTimeout(() => resolve(), 1000)
            }).then(() => {
                isRightName();
                isRightPrice();
                isRightCount();
                isRightEmail();
                if ((isRightName() && isRightEmail() && isRightCount() && isRightPrice()) == true) {
                    let newGoods = JSON.parse(localStorage.getItem("products"));
                    let position = new Position();
                    position.id = generateId();
                    position.name = $("#inputName").val();
                    position.email = $("#inputEmail").val();
                    position.count = Number($("#inputCount").val());
                    position.price = Number($("#inputPrice").val().split("$").join("").split(",").join(""));
                    let newDelivery = [];
                    Array.from(document.getElementsByClassName("selectCity")).forEach(function(city){
                        if (city.checked == true) {
                            newDelivery.push(city.value);
                            position.delivery = newDelivery;
                        }
                    })
                    newGoods.push(position);
                    localStorage.setItem("products", JSON.stringify(newGoods));
                    $("#products").append(createRow(position));
                    $(".deleteBtn").on("click", deleteRow);
                    $(".editBtn").on("click", editRow);
                    $(".modal-editAddNew").css("display", "none");
                    $(".modal-editAddNew-window-title").children().remove();
                    clearInputs();
                } else $(".inputError:first").focus(); 
            })        
        })
        $("#dontSaveBtn").on("click", function(){
            $(".modal-editAddNew").css("display", "none");
            $(".modal-editAddNew-window-title").children().remove();
            clearInputs();
        })
    });       
});

// Редактирование строки в таблице

$(".editBtn").on("click", editRow);
$(".info").on("click", editRow);

function editRow(click){
    $(".modal-editAddNew").css("display", "block");
    $("#saveBtn").off();
    $("#dontSaveBtn").off();
    new Promise (function(resolve, reject){
        setTimeout(() => resolve(), 1000)
    }).then(() => {
        let newGoods = JSON.parse(localStorage.getItem("products"));
        let editedBtn = click.target;
        let editedRow = editedBtn.closest("tr");
        newGoods.forEach((good) => {
            if (good.id == editedRow.id) {
                $("#inputName").val(good.name);
                $("#inputEmail").val(good.email);
                $("#inputPrice").val(priceDivision(good.price));
                $("#inputCount").val(good.count);   
                $(".modal-editAddNew-window-title").append(titleModal(good));
                Array.from(document.getElementsByClassName("selectCity")).forEach(function(checkbox){
                    if (good.delivery.includes(checkbox.value)) {checkbox.checked = true}
                })
            }
        });
        $("#saveBtn").on("click", function(){
            new Promise (function(resolve, reject){
                setTimeout(() => resolve(), 1000)
            }).then(() => {
                isRightName();
                isRightPrice();
                isRightCount();
                isRightEmail();
                if ((isRightName() && isRightEmail() && isRightCount() && isRightPrice()) == true) {
                    newGoods.forEach((good) => {
                        if (good.id == editedRow.id) {
                            good.name = $("#inputName").val();
                            good.email = $("#inputEmail").val();
                            good.count = Number($("#inputCount").val());
                            good.price = Number($("#inputPrice").val().split("$").join("").split(",").join(""));
                            let newDelivery = [];
                            Array.from(document.getElementsByClassName("selectCity")).forEach(function(city){
                                if (city.checked == true) {
                                    newDelivery.push(city.value);
                                    good.delivery = newDelivery;
                                }
                            })
                            localStorage.setItem("products", JSON.stringify(newGoods));
                            $("#" + good.id).children(".tdName").children("p").text(good.name);
                            $("#" + good.id).children(".tdPrice").text(priceDivision(good.price));
                            $("#" + good.id).children(".tdName").children("#count").text(good.count);
                        }
                    })
                    $(".modal-editAddNew").css("display", "none");
                    $(".modal-editAddNew-window-title").children().remove();
                    clearInputs();
                } else $(".inputError:first").focus();    
            })
        })
        $("#dontSaveBtn").on("click", function(){
            $(".modal-editAddNew").css("display", "none");
            $(".modal-editAddNew-window-title").children().remove();
            clearInputs();
        })
    })
}

// Разделение цены на разряды

function priceDivision(price) {
    let parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "$" + parts.join(".")
}

// Поиск строки в таблице по имени

$("#searchBtn").on("click", tableSearch)
$("html").keydown(function(event) {
    if (event.keyCode == 13) {
     console.log("enter")
     tableSearch();
    }
})

function tableSearch() {
    let phrase = document.getElementById('inputSearch');
    let table = document.getElementById('products');
    let regPhrase = new RegExp(phrase.value, 'i');
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        flag = regPhrase.test(table.rows[i].cells[0].children[0].innerText);
        flag ? table.rows[i].style.display = "" : table.rows[i].style.display = "none";
    }
}

// Своя валидация

function isRightName() {
    let reg = /[\w\s]{5,15}/;
    let spaceReg = /[\s]{5,15}/;
    if ($("#inputName").val().match(reg) == $("#inputName").val()) {
        if ($("#inputName").val().match(spaceReg) != $("#inputName").val()) {
            $("#inputName").removeClass("inputError");
            return true;
        } else {
            $("#inputName").addClass("inputError");
            $("#errorName").text("Имя не должно состоять только из пробелов!");
            return false;
        }
    } else {
        $("#inputName").addClass("inputError");
        $("#errorName").text("Длина имени от 5 до 15 символов");
        return false;
    }
}

function isRightEmail() {
    if ($("#inputEmail").inputmask("isComplete")) {
        $("#inputEmail").removeClass("inputError");
        return true;
    } else {
        $("#inputEmail").addClass("inputError");
        $("#errorEmail").text("Некорректный адрес электронной почты");
        return false;
    }
}

function isRightCount() {
    if ($("#inputCount").val() != "") {
        $("#inputCount").removeClass("inputError");
        return true;
    } else {
        $("#inputCount").addClass("inputError");
        $("#errorCount").text("Введите количество");
        return false;
    }
}

function isRightPrice() {
    let price = $("#inputPrice").val().replace("$", "").split(",").join("");
    if (isNaN(Number(price)) == false ) {
        if (Number(price) > 0) {
            $("#inputPrice").removeClass("inputError");
            return true;
        } else {
            $("#errorPrice").text("Цена должна быть положительной!");
            $("#inputPrice").addClass("inputError");
            return false;
        }
    } else {
        $("#errorPrice").text("Введите число!");
        $("#inputPrice").addClass("inputError");
        return false;
    }
}

// Обработка Delivery

// Russia - 1
// Belorus - 2
// USA - 3

$(".countries").change(function(){
    if ($(".countries option:selected").val() == "1") {
        $("#Russia").css("display", "inline-block");
        $("#Belorus").css("display", "none");
        $("#USA").css("display", "none");
    }
    if ($(".countries option:selected").val() == "2") {
        $("#Russia").css("display", "none");
        $("#Belorus").css("display", "inline-block");
        $("#USA").css("display", "none");
    }
    if ($(".countries option:selected").val() == "3") {
        $("#Russia").css("display", "none");
        $("#Belorus").css("display", "none");
        $("#USA").css("display", "inline-block");
    }
    if ($(".countries option:selected").val() == "0") {
        $("#Russia").css("display", "none");
        $("#Belorus").css("display", "none");
        $("#USA").css("display", "none");
    }

})

// Логика селектов-городов

$(".selectAll").change((click) => {
    if ((click.target.value == "allRussia") && ( click.target.checked)) {
        $(".optionRus").prop("checked", true)
    } else $(".optionRus").prop("checked", false);
    if ((click.target.value == "allBelorus") && ( click.target.checked)) {
        $(".optionBel").prop("checked", true)
    } else $(".optionBel").prop("checked", false);
    if ((click.target.value == "allUSA") && ( click.target.checked)) {
        $(".optionUSA").prop("checked", true)
    } else $(".optionUSA").prop("checked", false);
})

$(".selectCity").change((click) => {
    let className;
    let selectAllId;
    if (click.target.classList.contains("optionRus")) {
        className = "optionRus";
        selectAllId = "#russiaAll";
    } else if(click.target.classList.contains("optionBel")) {
            className = "optionBel"
            selectAllId = "#belorusAll";
        } else {className = "optionUSA";
                selectAllId = "#usaAll";
    }
    if (allChecked(className)) $(selectAllId).prop("checked", true);
    else $(selectAllId).prop("checked", false);
})

function allChecked(name) {
    let i = 0;
    Array.from(document.getElementsByClassName(name)).forEach(function(city){
        city.checked == true ? i++ : i+=0;
    })
    if (i == 3) return true; else return false;
}