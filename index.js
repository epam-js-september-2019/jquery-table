$(document).ready(function () {

    const App = {
        init: function () {
            this.products = {
                'id-1': {
                    name: 'Samsung',
                    email: 'placeholder@mail.com',
                    count: 3,
                    price: '$2,000',
                    delivery: {
                        country: 'Russia',
                        cities: ['Moscow'],
                    },
                },
                'id-2': {
                    name: 'Apple',
                    email: 'placeholder@mail.com',
                    count: 10,
                    price: '$4,000.47',
                    delivery: {
                        country: 'USA',
                        cities: ['Los-Angeles', 'San Francisco'],
                    },
                },
                'id-3': {
                    name: 'Xiaomi',
                    email: 'placeholder@mail.com',
                    count: 30,
                    price: '$1,000.01',
                    delivery: {
                        country: 'Belorus',
                        cities: ['Minsk', 'Brest'],
                    },
                },
            };
            this.countriesAndCities = {
                Russia: [
                    'Moscow',
                    'Samara',
                    'Rostow',
                ],
                Belorus: [
                    'Minsk',
                    'Grodno',
                    'Brest',
                ],
                USA: [
                    'New-York',
                    'Los-Angeles',
                    'San Franciso',
                ],
            };

            this.bindEvents();
            this.render();
        },

        render: function () {
            const idArray = Object.keys(this.products);
            $(".table tbody").html('');
            idArray.map((id) => {
                $(".table tbody").append(`
                <tr data-id="${id}">
                <td class="align-middle">
                  <a class="product-name" href="#">${this.products[id].name}</a>
                  <div class="d-inline-block float-right p-1 rounded bg-secondary text-white">
                    <span>${this.products[id].count}</span>
                  </div>
                </td>
              
                <td class="align-middle">${this.products[id].price}</td>
              
                <td>
                  <div class="row">
                    <div class="col-6">
                      <button type="button" class="btn btn-info btn-block btn-edit">
                        Edit
                      </button>
                    </div>
                    <div class="col-6">
                      <button
                        data-id="${id}"
                        type="button"
                        class="btn btn-danger btn-block btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
                `);
            });
        },

        bindEvents: function () {
            $('.table-name').on('click', this.sortName.bind(this));
            $('.table-price').on('click', this.sortPrice.bind(this));
            $('.btn-search').on('click', this.search.bind(this));
            $('.btn-search').on('keydown', (e) => {
                if (e.code === "Enter") {
                    this.search();
                    e.preventDefault();
                }
            });
            $('.btn-add-new').on('click', this.showAddNewModal.bind(this));
            $('.btn-cancel').on('click', this.hideEditingModal.bind(this));
            $('.btn-save-changes').on('click', this.addNewProduct.bind(this));
            $('.btn-no').on('click', this.hideDeletingModal.bind(this));
            $('.btn-yes').on('click', this.deleteProduct.bind(this));
            $('.table').on('click', '.btn-delete', this.showDeletingModal.bind(this));
            $('.table').on('click', '.btn-edit', this.showEditingModal.bind(this));
            $('.table').on('click', '.product-name', this.showPreviewModal.bind(this));
            $('.editing').on('change', '.select-all', this.selectAll.bind(this));

            $('#product-delivery-country').on('change', this.chooseDelivery.bind(this));

            $('#product-price').focusin(this.priceToEditMode.bind(this));
            $('#product-price').focusout(this.priceToRepresentMode.bind(this));

            $('#product-count').on('input', () => {
                $('#product-count').val($('#product-count').val().replace(/[^0-9]/g, ''));
            });
        },

        selectAll: function (e) {
            if ($(e.target).prop('checked')) {
                $(e.target).parent().siblings().each(function () {
                    $(this).children().prop('checked', true);
                });
            } else {
                $(e.target).parent().siblings().each(function () {
                    $(this).children().prop('checked', false);
                });
            }
        },

        chooseDelivery: function () {
            const country = $('#product-delivery-country').val();
            this.renderCities(country);
        },

        renderCities: function (country) {
            switch (country) {
                case 'Russia':
                    $('.cities').html('<label class="select-all"><input type="checkbox"/>Select all</label>');
                    this.countriesAndCities[country].map((city) => $('.cities').append(`<label><input type="checkbox"/>${city}</label>`));
                    break;
                case 'Belorus':
                    $('.cities').html('<label class="select-all"><input type="checkbox"/>Select all</label>');
                    this.countriesAndCities[country].map((city) => $('.cities').append(`<label><input type="checkbox"/>${city}</label>`));
                    break;
                case 'USA':
                    $('.cities').html('<label class="select-all"><input type="checkbox"/>Select all</label>');
                    this.countriesAndCities[country].map((city) => $('.cities').append(`<label><input type="checkbox"/>${city}</label>`));
                    break;
                default:
                    $('.cities').html('');
            }
        },

        sortName: function () {
            const values = Object.entries(this.products);
            const sorted = values.sort(function (a, b) {
                const [, productInfoA] = a;
                const [, productInfoB] = b;
                var nameA = productInfoA.name.toUpperCase();
                var nameB = productInfoB.name.toUpperCase();
                if ($(`#name_order`).val() === 'desc') {
                    if (nameA < nameB) {
                        return 1;
                    }
                    if (nameA > nameB) {
                        return -1;
                    }
                    return 0;
                } else {
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                }
            });
            const newProductsObj = sorted.reduce((acc, product) => {
                const [productId, productInfo] = product;
                return { ...acc, [productId]: productInfo }
            }, {});
            this.products = newProductsObj;
            $('.sort-arrow-name').toggleClass('direct-sort');
            const promise = new Promise((resolve) => {
                setTimeout(function() {
                    resolve();
                }, 1000);
            })
            promise.then(() => this.render());
            this.changeSortOrder('name');
        },

        sortPrice: function () {
            const values = Object.entries(this.products);
            const sorted = values.sort(function (a, b) {
                const [, productInfoA] = a;
                const [, productInfoB] = b;
                var priceA = productInfoA.price;
                var priceB = productInfoB.price;
                if ($(`#price_order`).val() === 'desc') {
                    if (priceA < priceB) {
                        return 1;
                    }
                    if (priceA > priceB) {
                        return -1;
                    }
                    return 0;
                } else {
                    if (priceA < priceB) {
                        return -1;
                    }
                    if (priceA > priceB) {
                        priceA
                        return 1;
                    }
                    return 0;
                }
            });
            const newProductsObj = sorted.reduce((acc, product) => {
                const [productId, productInfo] = product;
                return { ...acc, [productId]: productInfo }
            }, {});
            this.products = newProductsObj;
            $('.sort-arrow-price').toggleClass('direct-sort');
            const promise = new Promise((resolve) => {
                setTimeout(function() {
                    resolve();
                }, 1000);
            })
            promise.then(() => this.render());
            this.changeSortOrder('price');
        },

        changeSortOrder: function (columnName) {
            const currentOrder = $(`#${columnName}_order`).val();
            currentOrder === 'asc' ?
                $(`#${columnName}_order`).val('desc')
                : $(`#${columnName}_order`).val('asc');
        },

        search: function (e) {
            e.preventDefault();
            const searchString = $('#search').val().toLowerCase();
            const productArray = Object.entries(this.products);
            const filtered = productArray.filter((product) => {
                const [, productInfo] = product;
                const productName = productInfo.name.toLowerCase();
                return productName.includes(searchString);
            });
            const newProductsObj = filtered.reduce((acc, product) => {
                const [productId, productInfo] = product;
                return { ...acc, [productId]: productInfo }
            }, {});
            this.products = newProductsObj;
            const promise = new Promise((resolve) => {
                setTimeout(function() {
                    resolve();
                }, 500);
            })
            promise.then(() => this.render());
            $('#search').val('');
        },

        showAddNewModal: function () {
            $('.editing .product-name').text(``);
            $('.overlay-editing').removeClass('display-off');
        },

        hideEditingModal: function () {
            $('.overlay-editing').addClass('display-off');
            $('.warning').remove();
            this.formClear();
            $('#product-name').prop('disabled', false);
            $('#product-email').prop('disabled', false);
            $('#product-count').prop('disabled', false);
            $('#product-price').prop('disabled', false);
            $('#product-delivery-country').prop('disabled', false);
            $('.cities input').prop('disabled', false);

            $('.btn-save-changes').prop('disabled', false);
        },

        showDeletingModal: function (e) {
            $('.deleting-confirmation p').text(`Are you sure you want to delete '${$(e.target).parents('tr').find('.product-name').text()}'?`);
            const id = this.getElementId($(e.target).parents('tr'), 'data-id');
            $('.btn-yes').attr('data-id', id);
            $('.overlay-deleting').removeClass('display-off');
        },

        showEditingModal: function (e) {
            $('.editing .product-name').text(`${$(e.target).parents('tr').find('.product-name').text()}`);
            const row = $(e.target).parents('tr');
            const id = this.getElementId(row, 'data-id');
            const {
                name,
                email,
                count,
                price,
                delivery: {
                    country,
                    cities,
                }
            } = this.products[id];

            $('#product-name').val(name);
            $('#product-email').val(email);
            $('#product-count').val(count);
            $('#product-price').val(price);
            $('#product-delivery-country').val(country);
            this.renderCities(country);
            $('.cities input').parent().each(function () {
                cities.includes($(this).text()) ? $(this).children().prop('checked', true) : null;
            });

            $('.overlay-editing').removeClass('display-off');
        },

        showPreviewModal: function (e) {
            $('.editing .product-name').text(`${$(e.target).parents('tr').find('.product-name').text()}`);
            const row = $(e.target).parents('tr');
            const id = this.getElementId(row, 'data-id');
            const {
                name,
                email,
                count,
                price,
                delivery: {
                    country,
                    cities
                }
            } = this.products[id];

            $('#product-name').val(name).prop('disabled', true);
            $('#product-email').val(email).prop('disabled', true);
            $('#product-count').val(count).prop('disabled', true);
            $('#product-price').val(price).prop('disabled', true);
            $('#product-delivery-country').val(country).prop('disabled', true);
            this.renderCities(country);
            $('.cities input').parent().each(function () {
                cities.includes($(this).text()) ? $(this).children().prop('checked', true) : null;
            });
            $('.cities input').prop('disabled', true);

            $('.btn-save-changes').prop('disabled', true);
            $('.overlay-editing').removeClass('display-off');
        },

        hideDeletingModal: function () {
            $('.overlay-deleting').addClass('display-off');
        },

        deleteProduct: function (e) {
            const id = this.getElementId(e.target, 'data-id');
            const strId = id.toString();
            const productArray = Object.entries(this.products);
            const filtered = productArray.filter((product) => {
                const [productId] = product;
                return productId !== strId;
            });
            const newProductsObj = filtered.reduce((acc, product) => {
                const [productId, productInfo] = product;
                return { ...acc, [productId]: productInfo }
            }, {});
            this.products = newProductsObj;
            this.hideDeletingModal();
            const promise = new Promise((resolve) => {
                setTimeout(function() {
                    resolve();
                }, 500);
            })
            promise.then(() => this.render());
        },

        getElementId: function (e, attrName) {
            return $(e).attr(attrName);
        },

        addNewProduct: function () {
            const idNumber = this.products ? Object.keys(this.products).length + 1 : 1;
            if (this.isFormValid()) {
                this.products = {
                    ...this.products, [`id-${idNumber}`]: {
                        name: $('#product-name').val(),
                        email: $('#product-email').val(),
                        count: $('#product-count').val(),
                        price: this.priceToRepresentMode(),
                        delivery: {
                            country: $('#product-delivery-country').val(),
                            cities: this.getCities(),
                        }
                    }
                };
                this.formClear();
            }
            this.hideEditingModal();
            const promise = new Promise((resolve) => {
                setTimeout(function() {
                    resolve();
                }, 500);
            })
            promise.then(() => this.render());
        },

        isFormValid: function () {
            let nameValid = false;
            let emailValid = false;
            let countValid = false;
            let priceValid = false;
            const isNameValid = () => {
                const productName = $('#product-name').val();
                if (productName.length < 5) {
                    nameValid = false
                    $('#product-name').focus();
                    $('.warning').remove();
                    $('#product-name').addClass('redOutline');
                    $('#product-name').parent().append('<div class="warning">Type more than 5 characters</div>');
                } else if (productName.length > 15) {
                    nameValid = false
                    $('#product-name').focus();
                    $('.warning').remove();
                    $('#product-name').addClass('redOutline');
                    $('#product-name').parent().append('<div class="warning">Type less than 15 characters</div>');
                } else if (productName.trim() === '') {
                    nameValid = false
                    $('#product-name').val('');
                    $('#product-name').focus();
                    $('.warning').remove();
                    $('#product-name').addClass('redOutline');
                    $('#product-name').parent().append('<div class="warning">Type valid name</div>');
                } else {
                    nameValid = true;
                    $('#product-name').removeClass('redOutline');
                    $('.warning').remove();
                }
                return nameValid;
            };

            const isSupplierEmailValid = () => {
                const supplierEmail = $('#product-email').val();
                const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!regex.test(supplierEmail)) {
                    emailValid = false
                    $('#product-email').focus();
                    $('.warning').remove();
                    $('#product-email').addClass('redOutline');
                    $('#product-email').parent().append('<div class="warning">Type valid email</div>');
                } else {
                    emailValid = true;
                    $('#product-email').removeClass('redOutline');
                    $('.warning').remove();
                }
                return emailValid;
            };

            const isCountValid = () => {
                const productCount = $('#product-count').val();
                if (productCount.length === 0) {
                    countValid = false
                    $('#product-count').focus();
                    $('.warning').remove();
                    $('#product-count').addClass('redOutline');
                    $('#product-count').parent().append('<div class="warning">Type count</div>');
                } else {
                    countValid = true;
                    $('#product-count').removeClass('redOutline');
                    $('.warning').remove();
                }
                return countValid;
            };

            const isPriceValid = () => {
                this.priceToEditMode();
                const productPrice = Number($('#product-price').val());
                const regex = /(\d*[\.\d{1,2}])/;
                if (isNaN(productPrice) || productPrice < 0 || !productPrice) {
                    priceValid = false
                    $('#product-price').focus();
                    $('.warning').remove();
                    $('#product-price').addClass('redOutline');
                    $('#product-price').parent().append('<div class="warning">Type valid price</div>');
                } else if (!regex.test(productPrice)) {
                    priceValid = false
                    $('#product-price').focus();
                    $('.warning').remove();
                    $('#product-price').addClass('redOutline');
                    $('#product-price').parent().append('<div class="warning">Type valid price</div>');
                } else {
                    priceValid = true;
                    $('#product-price').removeClass('redOutline');
                    $('.warning').remove();
                }
                return priceValid;
            };
            return (isNameValid() && isSupplierEmailValid() && isCountValid() && isPriceValid());
        },

        priceToEditMode: function () {
            const value = $('#product-price').val();
            const valueWithoutDollarSign = value.slice(1);
            const integerAndDecimals = valueWithoutDollarSign.split('.');
            const [integer, decimals] = integerAndDecimals;
            const integerWithoutComma = integer.split(',').join('');
            const newValue = decimals ? `${integerWithoutComma}.${decimals}` : `${integerWithoutComma}`;
            $('#product-price').val(newValue);
        },

        priceToRepresentMode: function () {
            let representPrice = '';
            let counter = 1;
            const value = $('#product-price').val();
            const integerAndDecimals = value.split('.');
            const [integer, decimals] = integerAndDecimals;
            for (let i = integer.length - 1; i >= 0; i -= 1) {
                if (counter % 3 === 0) {
                    counter += 1;
                    representPrice = `,${integer[i]}${representPrice}`;
                } else {
                    counter += 1;
                    representPrice = `${integer[i]}${representPrice}`;
                }
            }
            const newValue = decimals ? `$${representPrice}.${decimals}` : `$${representPrice}`;
            $('#product-price').val(newValue);
            return newValue;
        },

        getCities: function () {
            let cities = [];
            $('.cities input:checked').parent().each(function () {
                cities = [...cities, $(this).text()];
            });
            return cities;
        },

        formClear: function () {
            $("#product-name").val('');
            $("#product-count").val('');
            $("#product-email").val('');
            $("#product-price").val('');
            $("#product-delivery-country").val('');
            $('.cities').html('');
            $(".cities input").prop('checked', false);
        }
    }

    App.init();
});