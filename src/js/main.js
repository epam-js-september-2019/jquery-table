let products = [
    {
        id: 0,
        name: "Some product",
        price: 20000,
        supplierEmail:"example@gmail.com",
        count:5,
        country: "Russia",
        cities:["Saratov", "Moscow","St.Petersburg"]

    },
    {
        id: 1,
        name: "Some product2",
        price: 1000,
        supplierEmail:"example@gmail.com",
        count:1,
        country: "Russia",
        cities:["Saratov", "Moscow","St.Petersburg"]

    }
];
const countries = {
    "USA": ["1","2","3"],
    "Russia":["St.Petersburg","Moscow","Sevastopol"],
    "China":["3","2","1"],
    "Belorus":["9","8","7","6"]
};
let len = products.length+1;

//table
const table = $("<table></table>");
const thead = $("<thead><tr>" +
    "<th scope='col'><a href=''  class='products-name-sort products-name-sort--up'> Name</a></th>" +
    "<th><a href='' class='products-count-sort products-count-sort--up'></a></th></th>" +
    "<th scope='col'><a href='' class='products-price-sort products-price-sort--up'>Price</a></th>" +
    "<th scope='col'>Actions</th></tr></thead>");
const tbody = $("<tbody></tbody>");

thead.addClass("thead-dark");
table.addClass("table table-bordered");
table.append(thead);
table.append(tbody);



//functions

//table update
const getTable = (type) =>{
    tbody.html(""); //clear
    let products = JSON.parse($.cookie(type));
    products.forEach((el)=>{
        const edit_button = $("<button></button>");
        const delete_button = $("<button></button>");
        edit_button.text("Edit");
        edit_button.addClass("products-button btn btn-outline-success");
        edit_button.attr("data-type","edit");
        edit_button.attr("data-id",el.id);
        delete_button.text("Delete");
        delete_button.addClass("products-button btn btn-outline-danger");
        delete_button.attr("data-type","delete");
        delete_button.attr("data-id",el.id);
        const tr = $("<tr></tr>");
        tr.addClass("product-item");
        const td1 = $("<td></td>");
        const td2 = $("<td></td>");
        const td3 = $("<td></td>");
        const td4 = $("<td></td>");
        const tr2 = $("<tr></tr>");
        let a = $("<a href='#'></a>");
        a.attr("data-id",el.id);
        a.text(el.name);
        td1.append(a);
        td4.text(el.count);
        td4.addClass("badge badge-pill badge-dark");
        td2.text(reform(String(el.price)));
        td3.append(edit_button,delete_button);
        tr.append(td1,td4,td2,td3);
        tbody.append(tr);
    });
    if(products.length === 0){
        let label = $("<label>There are not products</label>")
        tbody.append(label)
    }

};

//add new product
const addNewProduct = async (product,newProduct)=>{
    products = JSON.parse($.cookie("products"));
    if(newProduct) {
        await products.push(product);
    }

    await $.cookie("products",JSON.stringify(products));
    await getTable("products");
    await addEventListener("table")
};


//more about product
const getInfo = (id) =>{
    const el = $(".product-info");
    let div = $("<div></div>");
    div.class = "product-info-title";
    div.css("text-align","center");
    let b = $("<b></b>");
    b.text("Product's information:");
    let buttonExit = $("<button type='button' class='btn btn-danger'>X</button>");
    buttonExit.css("float","right");
    buttonExit.on("click", ()=>{
        el.css("display","");
    });
    div.append(b,buttonExit);
    el.append(div);
    let product = products.find((el)=> el.id ==id);
    let dl = $("<dl></dl>");
    dl.addClass("row");


    for (let i in product){

        let dt = $("<dt></dt>");
        let dd = $("<dd></dd>");
        dt.text(i+":");
        dt.addClass("col-2 col-md-3 col-sm-3 col-lg-3 col-xl-3");
        if(i==="price"){
            dd.text(reform(String(product[i])));
        }
        else{
            dd.text(product[i]);
        }
        dd.addClass("col-10 col-md-9 col-sm-9 col-lg-9 col-xl-9");
        dl.append(dt,dd);
    }

    el.append(dl);

};

const getSort = (e,className,data) => {

    let type = $(e.target);
    let element = className.split("-")[1];
    const sortPromise = new Promise((res)=>{
        setTimeout(()=>{
            console.log("Я ресолвюсь");
            res();
        },1000)
    });
    let newClassName,oldClassName,sortType;
    if(type.hasClass(className+"--down")) {
        newClassName = className+"--up";
        oldClassName = className+"--down";
        sortType = "up";
    }
    else {
        newClassName = className+"--down";
        oldClassName = className+"--up";
        sortType = "down";
    }
        sortPromise.then(()=>{sort(sortType,data,element)})
            .then(()=>{$.cookie("products",JSON.stringify(products))})
            .then(()=>{getTable("products")})
            .then(()=>{addEventListener("table")})
            .then(()=>{type.removeClass(oldClassName);
                type.addClass(newClassName)});
};

const addEventListenerToSort = ()=>{
    //сортировка по имени (по алфавиту)
    $(".products-name-sort").click((e)=>{
        e.preventDefault();
        products = JSON.parse($.cookie("products"));
        getSort(e,"products-name-sort",products)
    });
    //сортировка по количеству
    $(".products-count-sort").click((e)=>{
        e.preventDefault();
        products = JSON.parse($.cookie("products"));
        getSort(e,"products-count-sort",products)
    });
    //сортировка по цене
    $(".products-price-sort").click((e)=>{
        e.preventDefault();
        products = JSON.parse($.cookie("products"));
        getSort(e,"products-price-sort",products)
    });
};

const addEventListener = (to)=> {
    $("td a").click((e)=>{
        let id = $(e.target).attr("data-id");
        let elem = $(".product-info");
            elem.html("");
            const prom = new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve(id);
                },0)
            });
            prom.then(()=>{getInfo(id)});
            elem.css("display","block");

    });
    //делигирование
    $(""+to+" button").click((e)=>{
        e.preventDefault();
        const type = $(e.target).attr("data-type");
        let product_id = $(e.target).attr("data-id");
        let successButon =  $(".products-form-actions .btn-outline-success");
        switch (type){
            case "add":
                successButon.attr("data-type","save");
                openForm();
                break;
            case "edit":
                successButon.attr("data-type","refresh");
                editProduct(product_id);
                break;
            case "delete":
                toDeleteProduct( $(e.target).attr("data-id"));
                break;
            case "search":
                let forSearch = $("#product-search").val();
                let prom = new Promise((res)=>{
                    setTimeout(()=>{
                        res(searchProduct(forSearch) );
                    },1000);
                });
                prom.then((data)=>{ $.cookie("filtered_products",JSON.stringify(data));})
                    .then(()=>{getTable("filtered_products");})
                    .then(()=>{addEventListener("table");});

                break;
            case "save":
                let result = saveChanges(false);
                if(!result){
                    alert("Проверьте правильность введенных данных")
                }
                else {
                    //отправляем
                    let pr = setTimeout(()=>{loadData(result,true)},2000);
                    $(".products-form").css("display","");
                    $(".products-list").css("opacity","");
                    $(".product-info").css("opacity","")
                }
                break;
            case "refresh":
                let update = saveChanges(true);
                if(!update)
                    alert("Проверьте правильность введенных данных");
                else {
                    //отправляем
                    let pr = setTimeout(()=>{loadData(update,false)},2000);
                     makeBackgroundType(0.1,0);
                }
                break;
            case "cancel":
                cancel("form");
                break;

            case "yes":
                //удаляем по id
                const deletePromise = new Promise((res)=>{
                    setTimeout(()=>{
                        console.log("Я ресолвюсь");
                        res();
                    },1000)
                });
                deletePromise.then(()=>{deleteProduct(product_id)})
                    .then(()=>{getTable("products")}) //обновляем таблицу
                    .then(()=>{addEventListener("table")}); //к обновленной таблице добавляем обработчик событий
                $(".modal-window").fadeOut();
                $(".products-form").css("display","");
                $(".products-list").css("opacity","");
                $(".product-info").css("opacity","")
                break;
            case "no":
                cancel("modal");
                $(".products-form").css("display","");
                $(".products-list").css("opacity","");
                $(".product-info").css("opacity","")
                break;
        }
    });
};


$(`#selectAll`).click((e)=>{
    if(!e.target.checked){
        $(".product-delivery-city ul li input").each((i,v)=>{
            if(i!==0)
                $(v)[0].checked = false;

        })
    }
    else {
        $(".product-delivery-city ul li input").each((i, v) => {
            if(i!==0)
                $(v)[0].checked = true;
        })
    }

});

//counry + cities
$("#product-delivery").on("change", (e) =>{
  const country = $(e.target).val();
    $(".product-delivery-city ul li input")[0].checked = false;
    $(".product-delivery-city ul li").each((i,v)=>{
        if(i!==0)
            $(v).remove();
    });

  countries[country].forEach((el)=>{
     let li = $("<li></li>");
     let input = $("<input type='checkbox'>");
      let span = $("<span>");

         span.text(el);
     li.append(input,span);
      $(".product-delivery-city ul").append(li);
  });

});

//to add new product
const openForm = ()=>{
    clearForm();
    makeBackgroundType(0.1,0);
    $(".products-form").fadeIn();

};
const clearForm = () => {
    $("#product-name").val("");
    $("#product-count").val("");
    $("#product-price").val("");
    $("#product-supplier-email").val("");
    $("#China").attr("selected","").change();
};
//to change current product
const editProduct = (id) => {

    let product = products.find(product => product.id == id);
    $("form").attr("id",id);
    $("#product-name").val(product.name);
    $("#product-count").val(product.count);
    $("#product-price").val(reform(String(product.price)));
    $("#product-supplier-email").val(product.supplierEmail);
    $("#"+product.country).attr("selected", "");
    $("#product-delivery").change();
    //product.
    makeBackgroundType(0.1,0);
    $(".products-form").fadeIn();
};

//to delete current product
const toDeleteProduct = (id) =>{

    $("button[data-type='yes']").attr("data-id",id);
    let productName = products.find(product => product.id == id).name;
    $(".modal-window-body label").text(`Are you sure you want to delete ${productName}?`);
    $(".modal-window").fadeIn(300);
    makeBackgroundType(0.1,0);
};
const makeBackgroundType = (val,z) =>{
    $(".products-list").css({"opacity":val,
        "z-index":z
    });
    $(".product-info").css({"opacity":val,
        "z-index":z
    });
};
//
const deleteProduct = (id) =>{

    let index = -1;
    let products = JSON.parse($.cookie("products"));

    products.forEach((el,i)=>{
        if(el.id==id){
          index = i;
        }
    });
    products.splice(index, 1); //удаляем по индексу
    $.cookie("products",JSON.stringify(products));

};

//search
const searchProduct = (name) =>{
    products = JSON.parse($.cookie("products"));
    let result = [];
    products.forEach((e)=>{
        let currentName = e.name.toLowerCase();
        if (currentName.includes(name.toLowerCase())){
            result.push(e);
        }
    });
    return result;
};


//cancel changes
const cancel = (window,e) => {

 switch (window){
     case "form":
         $(".products-form").css("display","");
         $(".products-list").css("opacity","");
         $(".product-info").css("opacity","");
         break;
     case "modal":

         $(".modal-window").fadeOut(300,()=>{

             $(".products").css("opacity","");
             $(".products-list").css("display","");
             $(".product-info").css("opacity","");
         });
         break;
 }

};

//update data
const loadData = async(product,newProduct) =>{
    await addNewProduct(product,newProduct);
};


//right data
const defineValidation = (type) =>{
    let result = false;
    switch (type){
        case "product-name":
            let name = $("#product-name").val();

            if(name.match(/\s+/)&&!name.match(/[a-zA-Zа-яА-Я]+/))// одни пробелы и нет букв
            {
                return "It has to contain the letters";
            }
            if(name.length < 5)
                return "Name min length is 5 characters";
            if(name.length > 15)
                return "Name max length is 15 characters";
            break;
        case "product-supplier-email":
            let email = $("#product-supplier-email").val();
            if (!email.match(/[@]/))
                return "It has to contain @";
            break;
        case "product-count":
            let count = $("#product-count").val();
            if(count.match(/\D/))
                return "It can be only number";
            break;
        case "product-price":
            let price = $("#product-price").val().substring(1).split(",").join("");
            if(price.match(/[^0-9.^0-9]+/))
                return "It can be only a positive number";

            break;
        default:
            let cities = [];
            type.each((i,e)=>{
               if($(e).children()[0].checked){
                  if(i!==0)
                    cities.push($(e).children().eq(1).text());
                   result = true;
               }
            });
            if(!result)
                return false;
            else
                return cities;
    }
    return true;
};

//
const saveChanges = (update) =>{
    const form = $(".products-form form");
    let confident  = true;
    let result,currentElement,label;
    //проверка
    form.children().each((index,el)=>{
        //if button
        if(index===5)
            return false;

        //if city
        if(index===4){
           result =  defineValidation($(".product-delivery-city ul li"));
           currentElement = $(".product-delivery-city");
            if(!result){
               currentElement.css("border-color","red");
                confident = false;
            }
            else{
                currentElement.css("border-color","green")
            }
        }
        else{
            result = defineValidation($(el).children().get(1).id);
            currentElement =  $(el).children().eq(1);
            label =  $(el).children().eq(2);
            if (result!==true){
                label.text(result);
                label.css("visibility","visible");
                currentElement.css("border-color","red").focus();
                currentElement.eq(1).blur((e)=>{
                    $(e.target).focus();
                });
                confident = false;
            }
            else{
                label.css("visibility","");
                currentElement.css("border-color","green");
            }
        }


    });
    if(update){
        products = JSON.parse($.cookie("products"));
        let obj = products.find((pr)=>pr.id == form.attr("id"));
        obj.name =  $("#product-name").val();
        obj.price = convertData($("#product-price").val());
        obj.supplierEmail = $("#product-supplier-email").val();
        obj.count = Number($("#product-count").val());
        obj.country = $("#product-delivery").val();
        obj.cities = result;
        $.cookie("products",JSON.stringify(products));
    }
    if(confident) {
        //данные, которые отправляются
        let len = JSON.parse($.cookie("products")).length;
        let data = {
            id: Number(String(Math.random()*100).substring(0,2))+Number(String(Math.random()*100).substring(0,2)),
            name: $("#product-name").val(),
            price: convertData($("#product-price").val()),
            supplierEmail: $("#product-supplier-email").val(),
            count: Number($("#product-count").val()),
            country: $("#product-delivery").val(),
            cities: result
        };

        return data;
    }
    return false;
};

//$
$("#product-price").blur(function(e){
    $(e.target).val(reform($(e.target).val()))
}).focus(function (e) {
    $(e.target).val(reformToEdit($(e.target).val()))
});
const reformToEdit = (el) =>{
    return el.substr(1,el.length).split(",").join("");
};
const reform = (el) => {

    let value = el.split(".");
    let decimal = value[0].split("");
    let part = value[1];
    let newDecimal = [];
    let count = 0;
    for (let char = decimal.length-1; char>-1; char--){

        if(count===3) {
            newDecimal.unshift(",");
            count=0;
        }
        newDecimal.unshift(decimal[char]);
        count++;
    }
    if(part)
        return "$"+newDecimal.join("")+"."+part;
    return "$"+newDecimal.join("")
};

const convertData = (data) =>{
  return Number(data.substring(1).split(",").join(""));
};

//sort of products
function sort(type,data,element){


    switch (type){
        case "up":
            if(element === 'name'){
                data.sort((a,b)=>{
                    let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
                    if (nameA < nameB) //сортируем строки по возрастанию
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0 // Никакой сортировки
                });
                return false;
            }
            for(let i=0; i<data.length; i++) {
                for (let j = 0; j < data.length - 1 - i; j++) {
                    if(data[j][element]>data[j+1][element]){
                        [data[j],data[j+1]] = [data[j+1],data[j]];
                    }
                }
            }
            break;
        case "down":
            if(element === 'name'){
                data.sort((a,b)=>{
                    let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
                    if (nameA > nameB) //сортируем строки по возрастанию
                        return -1;
                    if (nameA < nameB)
                        return 1;
                    return 0 // Никакой сортировки
                });
                return false;
            }
            for(let i=0; i<data.length; i++) {
                for (let j = 0; j < data.length - 1 - i; j++) {
                    if(data[j][element]<data[j+1][element]){
                        [data[j],data[j+1]] = [data[j+1],data[j]];
                    }
                }
            }
            break;
    }
}

$("textarea").on("keydown",(e)=>{
   if(e.keyCode === 13){
        e.preventDefault();
   $("button[data-type='search']").click();
   }
});
$( document ).ready(()=>{
    console.log( $("button[data-type='search']"))
    $(".products-list-table").append(table);
    if(!$.cookie("products")) {
        $.cookie("products", JSON.stringify(products));
    }
    products =  JSON.parse($.cookie("products"));
    getTable("products");
    addEventListenerToSort();
    addEventListener(".container");
});

