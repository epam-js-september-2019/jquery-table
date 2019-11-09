let storedNames = JSON.parse(localStorage.getItem("products")) || {};
let countries = {
    Russia: {
        city1: "Moskow",
        city2: "St.Petersburg",
        city3: "Saratov"
    },
    USA: {
        city1: "San Diego",
        city2: "Chicago",
        city3: "Denver"
    },
    Belarus: {
        city1: "Minsk",
        city2: "Orsha",
        city3: "Grodno"
    }
};
let ID = 0;

$('#add-button').click(function () {
        $('#addModal').show();
        $('#addModal').find('input:text, input:password, input:file, textarea').val('');
        $('#addModal').find('input:radio, input:checkbox')
            .removeAttr('checked').removeAttr('');
        selectCountry();
        selectCity();
    }
);

$(document).on("click", "#cancel-button", function () {
    $('#addModal').hide();
});

$('select').change(selectCity());

function editProduct() {
    $(".edit-button").click(function() {
        $(".add-product-modal").show();
        $("#save-button").unbind("click");
        selectCountry();

        let thisProductId = $(this).parents(".product-row").find(".val-product").attr("id");
        let oldProducts = JSON.parse(localStorage.getItem("products"));
        let nameEditProduct = oldProducts[thisProductId].name,
            priceEditProduct = oldProducts[thisProductId].price,
            countEditProduct = oldProducts[thisProductId].count,
            emailEditProduct = oldProducts[thisProductId].email,
            newName = $("#inputName"),
            newPrice = $("#inputPrice"),
            newCount = $("#inputCount"),
            newEmail = $("#inputEmail");

        newName.val(nameEditProduct);
        newPrice.val(priceEditProduct);
        newCount.val(countEditProduct);
        newEmail.val(emailEditProduct);

        $("#save-button").click(function() {
            let emailEditProduct;

            if (isValid(newName, validateName())  && isValid(newEmail, validateEmail()) &&
                isValid(newCount, validateCount()) && isValid(newPrice, validatePrice())) {
                nameEditProduct = newName.val();
                priceEditProduct = newPrice.val();
                countEditProduct = newCount.val();
                emailEditProduct = newEmail.val();

                let newProducts = {
                    name: nameEditProduct,
                    count: countEditProduct,
                    price: priceEditProduct,
                    email: emailEditProduct,
                    id: thisProductId
                };

                $("#inputName").val("");
                $("#inputCount").val("");
                $("#inputPrice").val("");
                $("#inputEmail").val("");

                $(".add-product-modal").hide();

                let objectName = newProducts.id;
                storedNames[`${objectName}`] = newProducts;
                localStorage.setItem("products", JSON.stringify(storedNames));
                location.reload();
            } else {
                $(".invalid:first").focus();
            }
        });
    });
}

function deleteProduct() {
    $(".delete-button").click(function() {
        $(".delete-product-modal").show();
        let nameDeleteProduct = $(this).parents(".product-row").find(".val-product").text();
        let context = this;
        console.log(this);
        $(".delete-product-name").html(`Are you sure you want to delete ${nameDeleteProduct}?`);

        $("#yes-button").click(function() {
            let pr = JSON.parse(localStorage.getItem("products"));
            let num = $(context).parents(".product-row").find(".val-product").attr("id");
            delete pr[num];
            localStorage.setItem("products", JSON.stringify(pr));
            $(".delete-product-modal").hide();
            location.reload();
        });

        $("#no-button").click(function() {
            $(".delete-product-modal").hide();
        });
    });
}

async function addProductInTable(arg) {
    $("tbody tr ").hide();
    let dataForItemTemplate = product => {
        return {
            name: product.name,
            count: product.count,
            price: product.price,
            id: product.id
        };
    };

    let obj = storedNames;
    let productItem;

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

    editProduct();
    deleteProduct();

    $("#search-button ").click(function(event) {
        event.preventDefault();
        searchProduct();
    });

    $("#search-button").on("keypress", function(event) {
        if (event.which == 13) {
            searchProduct();
        }
    });
}

function selectCountry() {
    let citylist = _.template($("#delivery").html());
    let identifier = $("#country-delivery option:selected").val();
    $("#cities-select").html(citylist(countries[identifier]));
}

function selectCity() {
    $("#country-delivery").change(function() {
        selectCountry();

        $("input:checkbox").change(function() {
            const selectCity = $("#select-all").text();
            let state = false;
            if (selectCity === "Select all") {
                if (this.checked) {
                    state = true;
                }
                $(".city").each(function() {
                    this.checked = state;
                });
            } else {
                state = this.checked;
                $(":checkbox").each(function() {
                    this.checked = false;
                });
                this.checked = state;
            }
        });
    });
}

function isValid(field, validation) {
    // const error = field.parent().find("p");
    if (validation === false) {
        field.css("outlineColor", "red").css("border", "1px solid red");
        return false;
    }
    field.css("outlineColor", "").css("border", "");
    return true;
}

function validateCount() {
    let validCount = $("#inputCount").val();
    if (!/^\d+$/.test(validCount)) {
        $("#inputCount").removeClass("valid").addClass("invalid");
        return false;
    }
    $("#inputCount").removeClass("invalid").addClass("valid");
    return true;
}

function validatePrice() {
    let priceString = $("#inputPrice").val();
    if (!/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(priceString)) {
        $("#inputPrice").removeClass("valid").addClass("invalid");
        return false
    }
    $("#inputPrice").removeClass("invalid").addClass("valid");
    return true;
}

function validateName() {
    let nameString = $("#inputName").val();
    if (nameString.length < 5) {
        $("#inputName").removeClass("valid").addClass("invalid");
        return false
    } else if (nameString.length > 15) {
        $("#inputName").removeClass("valid").addClass("invalid");
        return false
    } else if (nameString == "" || nameString == undefined || nameString.replace(/\s/g, "").length == 0 || typeof nameString !== "string") {
        $("#inputName").removeClass("valid").addClass("invalid");
        return false
    }
    $("#inputName").removeClass("invalid").addClass("valid");
    return true;
}

function validateEmail() {
    let supplier = $("#inputEmail").val();
    const regex = new RegExp(
        "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$"
    );
    if (supplier == "" || supplier == undefined || supplier.replace(/\s/g, "").length == 0 || typeof supplier !== "string") {
        $("#inputEmail").removeClass("valid").addClass("invalid");
        return false
    } else if (!regex.test(supplier)) {
        $("#inputEmail").removeClass("valid").addClass("invalid");
        return false
    }
    $("#inputEmail").removeClass("invalid").addClass("valid");
    return true;
}

async function addNewProduct() {
    let newProduct = {};

    $("#save-button").click(async function() {
        ID = localStorage.getItem("id") || 0;
        let newId = ID;
        newId = Number(newId) + 1;
        newId = String(newId);

        const productName = $("#inputName").val();
        const productCount = $("#inputCount").val();
        const productPrice = $("#inputPrice").val();
        const supplierEmail = $("#inputEmail").val();

        if (isValid($("#inputName"), validateName())  && isValid($("#inputEmail"), validateEmail()) &&
            isValid($("#inputCount"), validateCount()) && isValid($("#inputPrice"), validatePrice())) {
            localStorage.setItem("id", newId);

            newProduct = {
                name: productName,
                count: productCount,
                price: productPrice,
                email: supplierEmail,
                id: newId
            };

            let existingObject = localStorage.getItem("products");
            let objectName = newProduct.id;
            existingObject = existingObject ? JSON.parse(existingObject) : {};
            existingObject[`${objectName}`] = newProduct;
            localStorage.setItem("products", JSON.stringify(existingObject));

            await addProductInTable(newId);

            $("#addModal").hide();
            setTimeout($(".val-product").attr("id", `${newId}`), 2000);
            location.reload();
        } else {
            $(".invalid:first").focus();
        }
    });
}

let showProducts = new Promise((res, rej) => {
    setTimeout(() => {
        $(document).ready(function() {
            $("#addModal").click(function() {
                $("#addModal").show();
                selectCity();
            });
        });
        res();
    }, 300);
});

showProducts
    .then(() => {addProductInTable();})
    .then(() => {setTimeout(addNewProduct, 1000);});