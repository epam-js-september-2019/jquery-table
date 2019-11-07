$(document).ready(function () {
    class Product {
        constructor() {
            this.name = $("#product-name-input").val();
            this.email = $("#email-input").val();
            this.count = +$("#count-input").val();
            this.price = +$("#price-input").val().replace(/[,\$]/g, "");
            this.country = $("#delivery-input").val();
            this.deliveryCity = $(".check-city:checked").map(function () {
                return $(this).siblings().text()
            }).get()
        };
    };

    let products = {};

    let deliveryCountry = {
        russia: ["Moscow", "S.petersburg", "Saratov"],
        belarus: ["Minsk", "Brest", "Gomel"],
        usa: ["Washington", "New York", "Seattle"],
    };


    openModalsWindow()


    // Click Save
    $(".save-change-button").unbind("click").click(saveForm)
    $(".confirm-delete").click(deleteProduct)


    $(".product-head__search-button").click(searchProduct)
    $(".product-head__search-input").keypress((e) => {
        if (e.which == 13) {
            $(".product-head__search-button").click()
        }
    })
    $(".product-head__search-input").focusout(function () {
        if ($.trim($(this).val()) == '') {
            $('.product').show()
        }
    })

    //Filter table 
    $(".table__name-head").click(sortTable)
    $(".table__price-head").click(sortTable)


    // Open modal and check input
    function openModalsWindow(){
            // Open modal window
    $(".product-head__add-button").click(() => {
        $(".product-name").text("New product")
        $(".addProduct-modal").toggleClass("addProduct-modal-active")
    })
    // Cancel modal window
    $(".cancel-modal").click(() => {
        clearForm();
        $(".addProduct-modal-active").removeClass("addProduct-modal-active")
        if ($(".product-edit")) {
            $(".product-edit").toggleClass("product-edit") 
            $(".addProduct-modal").toggleClass("edit")
        }

    })

    // Cancel deleteModal window
    $(".cancel-deleteModal").click(() => {
        $(".delete-product").toggleClass("delete-product")
        $(".delete-modal").toggleClass("delete-modal-active")
    })


    //Only numbers in count input
    $("#count-input").on("input", function () {
        let number = $(this).val().replace(/[^0-9]/g, '');
        $(this).val(number)
    })

    $("#price-input").on("input", function () {
        let number = $(this).val().match(/\d*[.]?(\d+)?/);
        let value = number[0] ? number[0] : '';
        $(this).val(value)
    })

    //Transform str price into money
    $("#price-input").focusout(function () {
        if ($(this).val().match(/^[0-9]*[.]?[0-9]+$/)) {
            let price = +$(this).val()
            $(this).val(`$${price.toLocaleString("en-EN")}`)
        }
    })

    //Transform money into str price
    $("#price-input").focus(function () {
        $(this).val($(this).val().replace(/[,\$]/g, ""))
    })


    // Filter country
    $("#delivery-input").keyup(function () {
        if (!$('.dropdown-menu-country').hasClass("show")) {
            $('.dropdown-menu-country').addClass('show');
            $('.dropdown-toggle').attr("aria-expanded", true);
            $('.input-group-append').addClass('show');
        }

        let value = $(this).val().toLowerCase();

        $(".dropdown-menu-country li").each(function () {
            let item = $(this).text().toLowerCase().indexOf(value) > -1;
            $(this).toggle(item)
        });

        //Show checkboxes
        showCityBlock()
    });

    // Add country into input
    $(".dropdown-menu-country li").click(function () {
        $("#delivery-input").val($(this).text())
        if ($('.dropdown-menu-country').hasClass("show")) {
            $('.dropdown-menu-country').removeClass('show');
            $('.dropdown-toggle').attr("aria-expanded", false);
            $('.input-group-append').removeClass('show');
        }

        //Show checkboxes
        showCityBlock()
    });

    //Check all
    $("#checkAll").click(() => {
        if ($("#checkAll")[0].checked) {
            $(".delivery-city .check-city").each(function () {
                $(this)[0].checked = true;
            })
        } else {
            $(".delivery-city .check-city").each(function () {
                $(this)[0].checked = false;
            })
        }
    })
    //CheckON all if checkbox true
    $(".delivery-city .check-city").click(function () {
        if ($(this)[0].checked) {
            let temp = true;
            $(".delivery-city .check-city").each(function () {
                if (!$(this)[0].checked) {

                    temp = false;
                }
            })
            if (temp) {
                $("#checkAll")[0].checked = true;
            }
        } else {
            $("#checkAll")[0].checked = false;
        }
    })
    }

    //Save product edit/add form
    function saveForm() {
        checkForm()

        if (!$(".addProduct-modal input").hasClass("border-danger") && $(".addProduct-modal").hasClass("edit")) {

            $(".addProduct-modal-active").removeClass("addProduct-modal-active")


            let promise = new Promise(function (resolve, reject) {
                setTimeout(() => resolve("done"), 1000);
            });

            promise.then(
                function () {


                    //Delte old product
                    let deletedPeoduct = $(".product-edit .table__name-products").text();
                    delete products[deletedPeoduct];

                    products[$("#product-name-input").val()] = new Product();
                    //edit product into obj products


                    $(".product-edit .table__name-products").text(products[$("#product-name-input").val()].name);
                    $(".product-edit .table__price").text(`$${products[$("#product-name-input").val()].price.toLocaleString("en-EN")}`);
                    $(".product-edit .table__count").text(products[$("#product-name-input").val()].count);

                    $(".product-edit").toggleClass("product-edit")
                    $(".addProduct-modal").toggleClass("edit")
                    clearForm();

                }
            );
        } else if (!$(".addProduct-modal input").hasClass("border-danger")) {

            $(".addProduct-modal-active").removeClass("addProduct-modal-active")

            let promise = new Promise(function (resolve, reject) {
                setTimeout(() => resolve("done"), 1000);
            });

            promise.then(
                function () {

                    //create new product into obj products
                    products[$("#product-name-input").val()] = new Product();
                    let currentProduct = products[$("#product-name-input").val()];
                    let currentPrice = `$${currentProduct.price.toLocaleString("en-EN")}`;

                    // Add product into table with lodash
                    let value = $('#tr-template').text()
                    let tmpl = _.template(value);
                    let param = tmpl({
                        name: currentProduct.name,
                        count: currentProduct.count,
                        price: currentPrice
                    });
                    $('.tbody').append(param);
                    clearForm();

                    //add click event to edit button
                    $(".product").unbind("click").click(function () {
                        if ($(event.target).hasClass("table__edit-button") || $(event.target).hasClass("table__name-products")) {
                            $(".addProduct-modal").toggleClass("addProduct-modal-active");

                            addInfo(this)
                        } else if ($(event.target).hasClass("table__delete-button")) {
                            // Open modal window

                            $(".delete-modal").toggleClass("delete-modal-active")
                            $(this).toggleClass("delete-product")
                            $(".delete-txt").text(`Are you sure you want to delete ${$(this).find(".table__name-products").text()}`)
                        }
                    })
                }
            );

        } else {
            $(".addProduct-modal .border-danger:first").focus()
        }

    }

    //Add info about product into modal window and activate edit class for save button
    function addInfo(editedProduct) {

        let currentName = $(editedProduct).find(".table__name-products").text()
        
        
        $(editedProduct).toggleClass("product-edit")
        $(".addProduct-modal").toggleClass("edit")
        $(".product-name").text(currentName)
        $("#product-name-input").val(products[currentName].name)
        $("#email-input").val(products[currentName].email)
        $("#count-input").val(products[currentName].count)
        $("#price-input").val(products[currentName].price)
        $("#delivery-input").val(products[currentName].country)

        $(".check-city").each(function () {
            products[currentName].deliveryCity.map((item) => {
                if (item == $(this).siblings().text()) {
                    $(this).prop('checked', true)
                }
            })
        })
        showCityBlock()

    }


    //Show and choose city in checkboxes
    function showCityBlock() {
        if ($("#delivery-input").val().toLowerCase() in deliveryCountry) {
            $(".label-city").each(function (i) {
                $(this).text(`${deliveryCountry[$("#delivery-input").val().toLowerCase()][i]}`)
            })
            if (!$(".addProduct-modal").hasClass("edit")) {
                $(".delivery-city .form-check-input").each(function () {
                    $(this).prop("checked", false);
                })
            }
            $(".delivery-city").removeClass('d-none')
        } else {
            $(".delivery-city").addClass('d-none')
        }
    };


    //Clear modal window form

    function clearForm() {
        $(".addProduct-modal input").each(function () {
            $(this).val(null);
        })
        $(".delivery-city .check-city").each(function () {
            $(this)[0].checked = false;
        })
        showCityBlock()
    }


    function searchProduct(event) {

        event.preventDefault();

        let value = $(".product-head__search-input").val().toLowerCase()
        $('.product').show();
        $('.product').each(function () {
            if (!($(this).find(".table__name-products").text().toLowerCase() === value.toLowerCase())) {
                $(this).hide()
            }
        })
    }

    function deleteProduct() {


        delete products[$(".delete-product").find(".table__name-products").text()]

        $(".delete-product").remove()
        $(".delete-modal").toggleClass("delete-modal-active")

    }


    function sortTable() {
        if ($("tbody").children().length > 2) {
            if ($(this).hasClass("table__name-head")) {
                $(".table__price-head .triangle").removeClass("triangle-down").removeClass("triangle-up")
                if ($(".table__name-head .triangle").hasClass("triangle-down")) {
                    $(".table__name-head .triangle").removeClass('triangle-down').addClass('triangle-up')
                    let sortedRows = Array.from($(".table tr"))
                        .slice(2)
                        .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? -1 : 1);

                    $("tbody")[1].append(...sortedRows);
                } else {
                    $(".table__name-head .triangle").addClass('triangle-down').removeClass('triangle-up')
                    let sortedRows = Array.from($(".table tr"))
                        .slice(2)
                        .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1);

                    $("tbody")[1].append(...sortedRows);
                }
            } else if ($(this).hasClass("table__price-head")) {
                $(".table__name-head .triangle").removeClass("triangle-down").removeClass("triangle-up")
                if ($(".table__price-head .triangle").hasClass("triangle-down")) {
                    $(".table__price-head .triangle").removeClass('triangle-down').addClass('triangle-up')
                    let sortedRows = Array.from($(".table tr"))
                        .slice(2)
                        .sort((rowA, rowB) => +rowA.cells[1].innerHTML.replace(/[,\$]/g, "") > +rowB.cells[1].innerHTML.replace(/[,\$]/g, "") ? 1 : -1);
                    
                    $("tbody")[1].append(...sortedRows);
                } else {
                    $(".table__price-head .triangle").addClass('triangle-down').removeClass('triangle-up')
                    let sortedRows = Array.from($(".table tr"))
                        .slice(2)
                        .sort((rowA, rowB) => +rowA.cells[1].innerHTML.replace(/[,\$]/g, "") > +rowB.cells[1].innerHTML.replace(/[,\$]/g, "") ? -1 : 1);

                    $("tbody")[1].append(...sortedRows);
                }
            }
        }
    }

    //Check validation of forms
    function checkForm() {
        if ($("#product-name-input").val().trim() === '' || $("#product-name-input").val().length > 15 || $("#product-name-input").val().trim().length < 5) {
            $("#product-name-input").addClass("border border-danger");
            $("#product-name-input").addClass("text-danger");
        } else {
            $("#product-name-input").removeClass("border border-danger");
            $("#product-name-input").removeClass("text-danger");
        }

        if (!/^[a-zA-Z0-9.!#$%&*+/=?^_'{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test($("#email-input").val())) {
            $("#email-input").addClass("border border-danger");
            $("#email-input").addClass("text-danger");
        } else {
            $("#email-input").removeClass("border border-danger");
            $("#email-input").removeClass("text-danger");
        }

        if (!$("#count-input").val()) {
            $("#count-input").addClass("border border-danger");
        } else {
            $("#count-input").removeClass("border border-danger");
        }

        if (!$("#price-input").val()) {
            $("#price-input").addClass("border border-danger");
        } else {
            $("#price-input").removeClass("border border-danger");
        }
    }


})