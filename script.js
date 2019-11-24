const defaultProductsInfo = {
    'You don\'t know Js': {
        email: 'library@amazon.com',
        price: 77.94,
        count: 150,
        delivery: {
            Russia: ['Saint-Petersburg', 'Moscow'],
            USA: ['Washington', 'Detroit']
        }
    },

    'Also sprach Zarathustra': {
        email: 'library@amazon.com',
        price: 9.39,
        count: 232,
        delivery: {
            USA: ['Los Angeles', 'Washington'],
            Belarus: ['Minsk', 'Brest']
        }
    },

    'The war of the worlds': {
        email: 'list@ozon.ru',
        price: 6.57,
        count: 34,
        delivery: {
            Russia: ['Saratov', 'Moscow'],
            USA: ['Los Angeles', 'Chicago']
        }
    },

};


const saveLocally = () => {
    localStorage.setItem('productsInfo', JSON.stringify(productsInfo));
};

if (!localStorage.getItem('productsInfo')) {
    localStorage.setItem('productsInfo', JSON.stringify(defaultProductsInfo));
}

const productsInfo = JSON.parse(localStorage.getItem('productsInfo'));

/* Price formatting */

const priceFormat = (num) => Math.abs(num).toLocaleString('en-EN', {
    style: 'currency',
    currency: 'USD'
});

const priceUnformat = (str) => +str.replace(/,|\$/g, '');

$('#price').on('focus blur', function (evt) {
    const value = $(this).val();

    switch (evt.type) {
        case 'focus':
            $(this).val(priceUnformat(value));
            if ($(this).val() == 0) {
                $(this).val('');
            }
            break;
        case 'blur':
            $(this).val(priceFormat(value));
            break;
    }
});


const timer = () => {
    const dfd = $.Deferred();
    setTimeout(() => { dfd.resolve(); }, 500);
    return dfd.promise();
};



const productRender = (name, action, productRow) => {
    const productTemplate = $('#product-template').html();
    const compiled = _.template(productTemplate);

    const productData = {
        name,
        count: productsInfo[name].count,
        price: priceFormat(productsInfo[name].price)
    };

    switch (action) {
        case 'edit':
            productRow.replaceWith(compiled(productData));
            break;
        default:
            $('.table tbody').append(compiled(productData));
            break;
    }
};

Object.keys(productsInfo).forEach((name) => productRender(name));


let tempDelivery = {};

const deliveryCountries = {
    Russia: ['Saratov', 'Moscow', 'St. Petersburg'],
    Belarus: ['Minsk', 'Vitebsk', 'Mogilev', 'Brest', 'Gomel'],
    USA: ['New York', 'Washington', 'Los Angeles', 'Detroit']
};

const countryRender = (name) => {
    const compiled = _.template('<option><%= name %></option>');
    $('#country').append(compiled({ name }));
};

Object.keys(deliveryCountries).forEach((name) => countryRender(name));

const cityRender = (city, index) => {
    const cityTemplate = $('#delivery-city-template').html();
    const compiled = _.template(cityTemplate);

    const country = $('#country').val();
    let checked;

    if (tempDelivery[country].includes(city)) {
        checked = 'checked';
    }

    const cityData = {
        city,
        checked,
        index
    };

    $('#city-list').children().append(compiled(cityData));
};

const toggleSelectAllCities = () => {
    if ($('input[id ^= city_]:checked').length === $('input[id ^= city_]').length) {
        $('#select-all-cities').prop('checked', true);
    } else {
        $('#select-all-cities').prop('checked', false);
    }
};

$('#country').on('change', function () {
    const value = $(this).val();

    if (!Object.prototype.hasOwnProperty.call(tempDelivery, value)) {
        tempDelivery[value] = [];
    }

    $('.delivery-city').remove();

    deliveryCountries[value].forEach((item, index) => {
        cityRender(item, index + 1);
    });
    toggleSelectAllCities();

    $('#city-list').show();
});



$('#select-all-cities').on('change', function () {
    const country = $('#country').val();

    if (this.checked) {
        $('input[id ^= city_]').prop('checked', true);

        tempDelivery[country].length = 0;

        for (let i = 0; i < deliveryCountries[country].length; i += 1) {
            tempDelivery[country].push(deliveryCountries[country][i]);
        }
    } else {
        $('input[id ^= city_]').prop('checked', false);
        tempDelivery[country].length = 0;
    }
});

$('#city-list').on('click', 'input[id ^= city_]', (evt) => {
    toggleSelectAllCities();

    const country = $('#country').val();
    const city = $(evt.target)
        .siblings('label')
        .text()
        .trim();

    if ($(evt.target).is(':checked')) {
        tempDelivery[country].push(city);
    } else {
        const index = tempDelivery[country].indexOf(city);
        tempDelivery[country].splice(index, 1);
    }
});



$('.js-add-new').on('click', () => {
    $('.modal-product-edit form').data('action', 'new');
    $('.modal-product-edit h5').text('Adding a new product');
    $('.modal-product-edit').show();
});



$('.modal-product-edit .js-cancel').on('click', (evt) => {
    evt.preventDefault();

    $('.modal-product-edit').hide();
    $('#name, #email, #count, #price')
        .val('')
        .removeClass('border-danger text-danger')
        .siblings('.error')
        .text('');

    $('#country option')
        .eq(0)
        .replaceWith('<option hidden disabled selected>Select a country</option>')
        .prop('selected', 'true');

    $('#city-list').hide();
    tempDelivery = {};
});



$('#count').on('input', function () {
    $(this).val(
        $(this)
            .val()
            .replace(/\D+/g, '')
    );
});



$('.table tbody').on('click', 'a', function (evt) {
    evt.preventDefault();

    const productInfo = $('#product-info-modal-template').html();
    const compiled = _.template(productInfo);
    const name = $(this).text();

    const productData = {
        name,
        count: productsInfo[name].count,
        email: productsInfo[name].email,
        price: priceFormat(productsInfo[name].price),
        deliveryCountries: Object.keys(productsInfo[name].delivery)
    };

    $('.modal-product-info .modal-main-content').replaceWith(
        compiled(productData)
    );
    $('.modal-product-info').show();
});

$('.modal-product-info').on('click', '.js-close', () => {
    $('.modal-product-info').hide();
});



const editOrDelete = (() => {
    let productRow;
    let name;

    const getProductRow = () => productRow;

    const getProductName = () => name;

    $('.table tbody').on('click', (evt) => {
        productRow = $(evt.target).closest('tr');
        name = productRow.find('a').text();

        if (evt.target.dataset.action === 'edit') {
            $('.modal-product-edit form').data('action', 'edit');

            $('#name').val(name);
            $('#email').val(productsInfo[name].email);
            $('#count').val(productsInfo[name].count);
            $('#price').val(priceFormat(productsInfo[name].price));

            tempDelivery = JSON.parse(JSON.stringify(productsInfo[name].delivery));

            const cityArr = Object.keys(productsInfo[name].delivery);

            if (cityArr.length !== 0) {
                let firstMatch;

                for (let i = 0; i < Object.keys(deliveryCountries).length; i += 1) {
                    if (cityArr.includes(Object.keys(deliveryCountries)[i])) {
                        firstMatch = Object.keys(deliveryCountries)[i];
                        break;
                    }
                }

                $('#country option').each(function () {
                    if ($(this).text() === firstMatch) {
                        $(this).prop('selected', 'true');
                    }
                });

                $('#country').trigger('change');
            }

            $('.modal-product-edit h5').text(`${name} - Editing`);
            $('.modal-product-edit').show();
        }

        if (evt.target.dataset.action === 'delete') {
            $('.modal-warning p').text(`Are you sure you want to delete ${name}?`);
            $('.modal-warning').show();
        }
    });

    return {
        getProductRow,
        getProductName
    };
})();

$('.modal-warning .js-delete').on('click', () => {
    const productRow = editOrDelete.getProductRow();
    const name = editOrDelete.getProductName();

    timer().done(() => {
        productRow.remove();
        delete productsInfo[name];
        saveLocally();
    });

    productRow.find('button').prop('disabled', true);
    $('.modal-warning').hide();
});

$('.modal-warning .js-cancel').on('click', () => {
    $('.modal-warning').hide();
});

/* Search */

const search = (() => {
    const reset = () => {
        $('form.search input[type="text"]').val('');
        $('form.search').submit();
    };

    $('form.search').on('submit', function (evt) {
        evt.preventDefault();

        const searchPhrase = $(this)
            .find('input:first')
            .val()
            .toLowerCase();

        $('tbody tr').each((index, element) => {
            const productName = $(element)
                .find('td a')
                .text()
                .toLowerCase();

            if (productName.includes(searchPhrase)) {
                $(element).show();
            } else {
                $(element).hide();
            }
        });
    });

    return { reset };
})();



const filter = (() => {
    let type;
    let counter = 0;

    const reset = () => {
        counter = 0;
        $('.sorting').removeClass('down up');
    };

    $('thead a').on('click', function (evt) {
        evt.preventDefault();

        $('.sorting').removeClass('down up');

        if (type === evt.target.dataset.type) {
            counter += 1;
        } else {
            type = evt.target.dataset.type;
            counter = 1;
        }

        const sortIcon = $(this).siblings('.sorting');
        sortIcon.addClass('down');

        $('tbody tr')
            .sort((a, b) => {
                sortIcon.removeClass('up');

                if (counter % 2 === 0) {
                    [a, b] = [b, a];
                    sortIcon.addClass('up');
                }

                switch (evt.target.dataset.type) {
                    case 'string':
                        return $(b)
                            .find('td a')
                            .text()
                            .toLowerCase()
                            .localeCompare(
                                $(a)
                                    .find('td a')
                                    .text()
                                    .toLowerCase()
                            );

                    case 'number':
                        return (
                            priceUnformat(
                                $(b)
                                    .find('td:eq(1)')
                                    .text()
                            )
                            - priceUnformat(
                                $(a)
                                    .find('td:eq(1)')
                                    .text()
                            )
                        );
                }
            })
            .appendTo('tbody');
    });

    return { reset };
})();


const checkProductValues = (action) => {
    $('#name, #email, #count, #price').each((index, element) => {
        const id = $(element).attr('id');
        const value = $(element).val();

        const price = priceUnformat(value);
        const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

        let error = '';

        const errorToggle = () => {
            $(element)
                .siblings('.error')
                .text(error);
            $(element).toggleClass('text-danger border-danger', error !== '');
        };

        switch (id) {
            case 'name':
                if (value === '') {
                    error = "Field can't be empty";
                } else if (value.length < 5) {
                    error = 'Name min length is 5 characters';
                } else if (value.length > 25) {
                    error = 'Name max length is 25 characters';
                } else if (value.replace(/\s/g, '') === '') {
                    error = "Name can't consist of only spaces";
                } else if (
                    (Object.prototype.hasOwnProperty.call(productsInfo, value)
                        && action === 'new')
                    || (Object.prototype.hasOwnProperty.call(productsInfo, value)
                    && editOrDelete.getProductName() !== value
                    && action === 'edit')
                ) {
                    error = 'Product with the same name already exists!';
                }

                errorToggle();
                break;

            case 'email':
                if (value === '') {
                    error = "Field can't be empty";
                } else if (regex.test(value) === false) {
                    error = 'Invalid email address';
                }

                errorToggle();
                break;

            case 'count':
                if (value === '') {
                    error = "Field can't be empty";
                }

                errorToggle();
                break;

            case 'price':
                if (Number.isNaN(price)) {
                    error = 'Price should be a number';
                } else if (price === 0) {
                    error = "Price shouldn't be zero value";
                }

                errorToggle();
                break;
        }
    });

    const errorCount = $('.modal-product-edit input.text-danger')
        .filter(':first')
        .focus();

    if (errorCount.length === 0) {
        return true;
    }

    return false;
};


$('.modal-product-edit form').on('submit', function (evt) {
    evt.preventDefault();
    const action = $(this).data('action');
    const productRow = editOrDelete.getProductRow();

    if (checkProductValues(action)) {
        const valuesArr = $('#name, #email, #count, #price')
            .map(function () {
                return $(this).val();
            })
            .get();

        const [name, email, count, price] = valuesArr;

        Object.keys(tempDelivery).forEach((country) => {
            if (tempDelivery[country].length === 0) {
                delete tempDelivery[country];
            }
        });

        const delivery = tempDelivery;

        timer().done(() => {
            if (editOrDelete.getProductName() !== name && action === 'edit') {
                delete productsInfo[editOrDelete.getProductName()];
            }

            productsInfo[name] = {
                email,
                price: priceUnformat(price),
                count: +count,
                delivery
            };

            saveLocally();
            productRender(name, action, productRow);
        });

        $('#country option')
            .eq(0)
            .replaceWith('<option hidden disabled selected>Select a country</option>')
            .prop('selected', 'true');

        $('#city-list').hide();

        tempDelivery = {};
        search.reset();
        filter.reset();

        if (action === 'edit') {
            productRow.find('button').prop('disabled', true);
        }

        $('.modal-product-edit').hide();
        $('#name, #email, #count, #price').val('');
    }
});