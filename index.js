let storedNames = JSON.parse(localStorage.getItem("products")) || {};

let errorObject = {
  resetError:arg => {$(arg).remove();},
  invalidClass: arg => {arg.removeClass("valid").addClass("invalid");},
  validClass: arg => {arg.removeClass("invalid").addClass("valid");}
};

async function searchProduct() {
  $("tbody tr ").show();
  let inputSearch = await $(".product-search").val().trim();
  let arrForSearch = [];
   let searchStr;
  for (let i in storedNames) {
    arrForSearch.push(inputSearch.toLowerCase() == storedNames[i].name.toLowerCase());
    if (inputSearch.toLowerCase() == storedNames[i].name.toLowerCase()) {
      searchStr = storedNames[i].name;
    }
  }
 let search = inputSearch.toLowerCase()
  if (arrForSearch.includes(true)) {
    console.log(search)
    $(`tbody tr:not(:contains("${searchStr}"))`).hide();
  } else {
    $("tbody tr ").show();
  }
}

async function appendProductInTable(arg) {
  newId = arg;
  $("tbody tr ").hide();
  let dataForItemTemplate = product => {
    return {
      name: product.name,
      count: product.count,
      price: product.price,
      id: product.id,
      nameForSearch:product.nameForSearch
    };
  };

  let obj = storedNames;

  for (let i in obj) {
    productItem = obj[i];
    let template = await $("#template-product-item").html();
    let compiledTemplate = await _.template(template);
    const dataOfTemplaete = product => {
      return compiledTemplate(dataForItemTemplate(product));
    };

    let arr = [];
    arr.push(productItem);
    let htmlTemplaete = arr.map(dataOfTemplaete).join("");
    $("#myTable tr:last").after(htmlTemplaete);
  }
  setTimeout(editProduct, 1000);
 
  $(".btn-search ").click(function(event) {
    event.preventDefault();
    searchProduct();
  });

  $(".btn-search").on("keypress", function(event) {
    if (event.which == 13) {
      searchProduct();
    }
  });
 deleteProduct();
  showInfo()
}

function showInfo() {
  $('.info').click(function (event) {
    event.preventDefault();
    $('.add-product-modal').show();
    $('input').hide()
    $('.btn-save').hide()
    $('.btn-cancel').hide()
    $('select').hide()
    $('#countriesForSelect').hide()

    let productId = $(this).parents('.product-row').find('.val-product').attr('id');
    let thisProduct = JSON.parse(localStorage.getItem('products'));
    let infoName = thisProduct[productId].name,
        infoPrice = thisProduct[productId].price,
        infoCount = thisProduct[productId].count,
        infoEmail = thisProduct[productId].email;

    $('.name-for-input:eq(0)').after(`<p class='info-name'> </p>`)
    $('h3').text(`${infoName}`);
    $('.info-name').text(`${infoName}`);
    $('.name-for-input:eq(1)').after(`<p class='info-email'> </p>`)
    $('.info-email').text(`${infoEmail}`);
    $('.name-for-input:eq(2)').after(`<p class='info-count'> </p>`)
    $('.info-count').text(`${infoCount}`);
    $('.name-for-input:eq(3)').after(`<p class='info-price'> </p>`)
    $('.info-price').text(`${infoPrice}`);
    $('.name-for-input:eq(4)').after('<button type="button" class="close-info">Close</button>')

    $('.close-info').click(function () {
      $('.add-product-modal').hide();
      $('.name-for-input').next().remove();
    })

  })
}

function validation() {
  let idForValidation = [];

  $(".add-product-modal-content > input").each(function (index, element) {
    idForValidation.push($(element).attr("id"));
  });

  for (let id of idForValidation) {
    switch (id) {
      case "name":
        const nameSpace = $(".product-name").val().replace(/ /g, "");

        if (!nameSpace) {
          errorObject.resetError(".error")
          errorObject.invalidClass($(".product-name"));
          $(".product-name").after("<p class='error'> </p>")
          $('.error').attr('class', 'error');
          $(".error").addClass('nameIsNull')
          $(".nameIsNull").text("You should enter text");

        } else if (nameSpace.length < 5) {
          errorObject.resetError(".error")
          $(".product-name").after("<p class='error'> </p>")
          $('.error').attr('class', 'error');
          $(".error").addClass('minLength')
          $(".minLength").text("Min length must be more then 5");
          errorObject.invalidClass($(".product-name"));

        } else if (nameSpace.length > 15) {
          errorObject.resetError(".error")
          $(".product-name").after("<p class='error'> </p>")
          $('.error').attr('class', 'error');
          $(".error").addClass('maxLength')
          $(".maxLength").text("Max length must be less then 15");
          errorObject.invalidClass($(".product-name"));

        } else {
          errorObject.resetError(".error")
          errorObject.validClass($(".product-name"));
        }
        break;

      case "email":
        const validEmail = $(".mail").val().replace(/ /g, "");
        const emaqlReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!validEmail) {
          errorObject.resetError(".errorEmail")
          $(".mail").after("<p class='errorEmail'> </p>")
          $('.errorEmail').attr('class', 'errorEmail');
          $(".errorEmail").addClass('nullEmail')
          $(".nullEmail").text("You should enter text");
          errorObject.invalidClass($(".mail"));

        } else if (!emaqlReg.test(validEmail)) {
          errorObject.resetError(".errorEmail")
          $(".mail").after("<p class='errorEmail'> </p>")
          $('.errorEmail').attr('class', 'errorEmail');
          $(".errorEmail").addClass('invalidEmail')
          $(".invalidEmail").text("Please enter valid email");
          errorObject.invalidClass($(".mail"));

        } else {
          errorObject.resetError(".errorEmail")
          errorObject.validClass($(".mail"));
        }
        break;

      case "count": {
        const validdCount = $(".count").val().replace(/ /g, "");

        if (!validdCount) {
          errorObject.resetError(".errorCount")
          $(".count").after("<p class='errorCount'> </p>");
          $(".errorCount").text("You should enter text");
          errorObject.invalidClass($(".count"));

        } else {
          errorObject.resetError(".errorCount")
          errorObject.validClass($(".count"));
        }
      }
        break;

     case "price": {
       const validPrice = $(".price").val().replace(/ /g, "");

      if (!validPrice) {
        errorObject.resetError(".errorPrice");
        $(".price").after("<p class='errorPrice'> </p>");
        $(".errorPrice").text("You should enter text");
        errorObject.invalidClass($(".price"));

      } else {
        errorObject.validClass($(".price"));
        errorObject.resetError(".errorPrice");
      }
    }
    }
  }
}


function selectDelivery() {
  let countries = {
    ru: {
      city1: "Moskow",
      city2: "St.Petersburg",
      city3: "Saratov"
    },
    usa: {
      city1: "San Diego",
      city2: "Chicago",
      city3: "Denver"
    },
    blr: {
      city1: "Minsk",
      city2: "Orsha",
      city3: "Grodno"
    }
  };
  let citylist = _.template($("#devivery").html());
  let identifier = $("#select-country option:selected").val();
  $("#countriesForSelect").html(citylist(countries[identifier]));
}

async function addNewProduct() {
  $(".btn-save").unbind("click");
  $(".count").on("input change", function() {
    let validCount = $(".count").val();
    $(".count").val(validCount.replace(/[\W_a-zA-Zа-яА-Я]/g, ""));
  });

  $(".price").blur(function() {
    let validPrice = $(".price").val();
    let format;
    validPrice = $(".price").val(validPrice.replace(validPrice, validPrice.substring(0, 9)));
    newValidPrice = $(".price").val();
    let validate = (+newValidPrice).toFixed(2).split(".");
    format = ["$", priceFormat(validate[0] | 0), ".", validate[1]].join("");
    $(".price").val(newValidPrice.replace(newValidPrice, format));

    function priceFormat(num) {
      let str = num + "";
      let arr = [];
      let i = str.length - 1;

      while (i >= 0) {
        arr.push((str[i - 2] || "") + (str[i - 1] || "") + (str[i] || ""));
        i = i - 3;
      }
      return arr.reverse().join(",");
    }
  });

  let products = {};

  $(".btn-save").click(async function() {
    let localId = localStorage.getItem("id") || 0;
    $(".first").text(`${localId}`);
    let newId = $(".first").text();
    newId = Number(newId) + 1;
    newId = String(newId);

    validation();
    const productName = $(".product-name").val();
    const productCount = $(".count").val();
    const productPrice = $(".price").val();
    const supplierEmail = $(".mail").val();

    if ($(".valid").length < 4) {
      $(".invalid")[0].focus();
      console.log($(".error"))
      return false;
       
    } else {
      localStorage.setItem("id", newId);
      nameForSearch =  productName.toLowerCase()
      products = {
        name: productName,
        count: productCount,
        price: productPrice,
        email: supplierEmail,
        id: newId,
        nameForSearch
      };

      let existingObject = localStorage.getItem("products");
      let objectName = products.id;
      existingObject = existingObject ? JSON.parse(existingObject) : {};
      existingObject[`${objectName}`] = products;
      localStorage.setItem("products", JSON.stringify(existingObject));

      appendProductInTable(newId);
      $(".add-product-modal").hide();
      setTimeout($(".val-product").attr("id", `${newId}`), 2000);
      location.reload();
    }
  });

  $(".btn-cancel").click(async function() {
    $("input").val("");
    $(".add-product-modal").hide();
    location.reload();
  });
}

function editProduct() {
  $(".btn-edit").click(function() {
    $(".add-product-modal").show();
    $(".btn-save").unbind("click");
    $('input').show()
    $('.btn-save').show()
    $('.btn-cancel').show()
    $('select').show()
    $('#countriesForSelect').show()
     
    selectCity();

    let thisProductId = $(this).parents(".product-row").find(".val-product").attr("id");
    let oldProducts = JSON.parse(localStorage.getItem("products"));
    let nameEditProduct = oldProducts[thisProductId].name,
      priceEditProduct = oldProducts[thisProductId].price,
      countEditProduct = oldProducts[thisProductId].count,
      emailEditProduct = oldProducts[thisProductId].email,
      newName = $(".product-name"),
      newPrice = $(".price"),
      newCount = $(".count"),
      newEmail = $(".mail");

    $(".add-product-modal").show();

    newName.val(nameEditProduct);
    newPrice.val(priceEditProduct);
    newCount.val(countEditProduct);
    newEmail.val(emailEditProduct);

    $(".btn-save").click(function() {
      validation();
      if ($(".valid").length < 4) {
        errorObject.setFocus($(".invalid"));
        $(".invalid")[0].focus();
        return false;

      } else {
        nameEditProduct = newName.val();
        priceEditProduct = newPrice.val();
        countEditProduct = newCount.val();
        emailtEditProduct = newEmail.val();

        let newProducts = {
          name: nameEditProduct,
          count: countEditProduct,
          price: priceEditProduct,
          email: emailtEditProduct,
          id: thisProductId
        };

        $(".product-name").val("");
        $(".count").val("");
        $(".price").val("");
        $(".add-product-modal").hide();

        let objectName = newProducts.id;
        storedNames[`${objectName}`] = newProducts;
        localStorage.setItem("products", JSON.stringify(storedNames));
      }
      location.reload();
    });
  });
}
function deleteProduct() {
  $(".btn-delete").click(function() {
    $(".space-for-delete-product-modal").show();
    let nameDeleteProduct = $(this).parents(".product-row").find(".val-product").text();
    let context = this;
    console.log(this);
    $(".delete-product-name").html(`Are you sure you want to delete ${nameDeleteProduct}?`);
    $(".btn-save").unbind("click");

    $(".btn-yes").click(function() {
      let pr = JSON.parse(localStorage.getItem("products"));
      let num = $(context).parents(".product-row").find(".val-product").attr("id");
      delete pr[num];
      localStorage.setItem("products", JSON.stringify(pr));
      $(".space-for-delete-product-modal").hide();
      location.reload();
    });

    $(".btn-no").click(function() {
      $(".space-for-delete-product-modal").hide();
    });
  });
}

function sortAction(name, column) {
  $(name).unbind("click");
  let tbody = $("#myTable tbody");
  let state = 1;
  let arrow = $(name).siblings().find("i");
  return function() {
    if (state === 1) {
      state = 2;
      tbody.find("tr").sort((a, b) => {
          a = $(a).find(column).text();
          b = $(b).find(column).text();
          return a > b ? 1 : a < b ? -1 : 0;
        }).appendTo(tbody);
      $(arrow).removeClass();
      $(arrow).toggleClass("fas fa-caret-up");
    } else if (state === 2) {
      state = 1;
      tbody .find("tr").sort((a, b) => {
          a = $(a).find(column).text();
          b = $(b).find(column).text();
          return a < b ? 1 : a > b ? -1 : 0;
        }).appendTo(tbody);
      $(arrow).removeClass();
      $(arrow).toggleClass("fas fa-caret-down");
    }
  };
}

function sortTable(name, column) {
  $(name).click(sortAction(name, column));
}
sortTable("th .col-name", "td:eq(0)");
sortTable("th .col-price", "td:eq(1)");

let arrForDelivery = [];

function selectCity() {
  $("#select-country").change(function() {
    selectDelivery();
    $("#select-all").change(function()  {
      let group = $(this).attr('data-group');
      $(`.one[data-group="${group}"]`).prop("checked", this.checked);
  });

  $(".one").change(function()  {
      let group = $(this).attr('data-group');
      let allChecked = $(`.one[data-group="${group}"]:not(:checked)`).length == 0;
      $(`.all[data-group="${group}"]`).prop("checked", allChecked);
      console.log($("input[type='checkbox']").text())
  });
     
  });
}

let showProducts = new Promise((res, rej) => {
  setTimeout(() => {
    $(document).ready(function() {
      $(".btn-add-new").click(function() {
        $(".add-product-modal").show();
        selectCity();
      });
    });
    res();
  }, 300);
});

showProducts
  .then(() => {appendProductInTable();})
  .then(() => {setTimeout(addNewProduct, 1000);});
