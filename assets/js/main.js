"use strict"
$(document).ready(function(){

    const products = [
        {
            id: 1,
            name: 'Product 1',
            desc: 'Text about why you must buy this product',
            email: 'mail@gmail.com',
            price: 256,
            count: 5,
            delivery: {
                country: {
                    name: 'Russia',
                    code: 'rus',
                },
                cities: [
                    {
                        name: 'St. Peterburg',
                        code: 'spb',
                    },
                ],
            },
        },
        {
            id: 2,
            name: 'Product 2',
            desc: 'Text about why you must buy this product',
            email: 'mail@gmail.com',
            price: 512,
            count: 10,
            delivery: {
                country: {
                    name: 'Belarus',
                    code: 'by',
                },
                cities: [
                    {
                        name: 'Vitebsk',
                        code: 'vt',
                    },
                    {
                        name: 'Minsk',
                        code: 'msk',
                    },
                    {
                        name: 'Gomel',
                        code: 'gl'
                    },
                ],
            },
        },
        {
            id: 3,
            name: 'Product 3',
            desc: 'Text about why you must buy this product',
            email: 'mail@gmail.com',
            price: 1024,
            count: 7,
            delivery: {
                country: {
                    name: 'USA',
                    code: 'usa',
                },
                cities: [
                    {
                        name: 'New York',
                        code: 'ny',
                    },
                ],
            },
        }
    ];

    const countries = [
        {
            name: 'Russia',
            code: 'rus',
            cities: [
                {
                    name: 'Moscow',
                    code: 'msk'
                },
                {
                    name: 'St. Peterburg',
                    code: 'spb'
                },
                {
                    name: 'Saratov',
                    code: 'sv'
                },
            ]
        },
        {
            name: 'Belarus',
            code: 'by',
            cities: [
                {
                    name: 'Minsk',
                    code: 'msk'
                },
                {
                    name: 'Gomel',
                    code: 'gl'
                },
                {
                    name: 'Vitebsk',
                    code: 'vt'
                },
            ]
        },
        {
            name: 'USA',
            code: 'usa',
            cities: [
                {
                    name: 'New York',
                    code: 'ny'
                },
                {
                    name: 'Los Angeles',
                    code: 'la'
                },
                {
                    name: 'Chicago',
                    code: 'ch'
                },
            ]
        },
    ];

    const data = {
        tempProduct: {
            id: '',
            name: '',
            desc: '',
            email: '',
            price: '',
            count: '',
            delivery: {
                country: {
                    name: countries[0].name,
                    code: countries[0].code,
                },
                cities: [
                    // {
                    //     name: '',
                    //     code: '',
                    // },
                ],
            },
        },
    };

    const app = $('#js-product-table');

    function Clone(obj) {
        for(let key in obj) {
            this[key] = obj[key];
        };
    }

    const renderTableItem = (product, index) => {
        return `
            <tr>
                <td>${ index+1 }</td>
                <td class="d-flex justify-content-between align-items-center">
                    <span>${ product.name }</span>
                    <span class="badge badge-secondary badge-pill">${ product.count }</span>
                </td>
                <td>${ product.price }</td>
                <td>
                    <button class="btn btn-primary js-product-edit" data-product-id="${ product.id }">Edit</button>
                    <button class="btn btn-outline-danger js-product-delete" data-product-id="${ product.id }">Delete</button>
                </td>
            </tr>
           
        `
    };

    const renderTable = (products, direction) => {
        let content = '';
        if (products.length > 0) {
            content =
                `
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" class="d-flex justify-content-between">
                                <summary class="font-weight-bold" id="js-sort-by-name" data-sort="straight">Name</summary>
                                <span class="sort-direction ${ direction === 'reverse' ? 'reverse' : '' }">▼</span>
                            </th>
                            <th scope="col">Price</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ products.map((item, index) => renderTableItem(item, index)).join('') }       
                    </tbody>
                </table>
            `
        } else {
            content = `
                <div class="my-3 p-3">
                    <h4 class="text-center">Product list is empty</h4>
                </div>
            `
        };

        app.html(content);

        $('#js-sort-by-name').click((e) => {
            const elem = e.target;
            if (elem.getAttribute('data-sort') === 'stright') {
                products.sort(SortByName);
                elem.setAttribute('data-sort', 'stright')
                renderTable(products, 'stright')
            } else {
                products.reverse(SortByName);
                elem.setAttribute('data-sort', 'reverse')
                renderTable(products, 'reverse')
            };
        });
    };

    const SortByName = (a, b) => {
        let aName = a.name.toLowerCase();
        let bName = b.name.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    };

    const resetTempProduct = () => {
        for(let key in data.tempProduct) {
            data.tempProduct[key] = '';
        };

        data.tempProduct.delivery = {
            country: {
                name: countries[0].name,
                code: countries[0].code,
            },
            cities: [],
        };
    };

    const modalClose = () => {
        $('.modal-wrapper').fadeOut().remove();
        resetTempProduct();
    };

    const modal = (content, type = '') => {
        $('body').append('<div class="modal-wrapper"><div class="modal--custom ' + (type !== "" ? "modal--" + type : "") + '">' + content + '</div></div>');

        $('.modal-wrapper').hide().fadeIn();
        $('.modal').hide().fadeIn();

        $('.close-modal').click(() => modalClose());

    };

    const dataBind = (obj) => {
        $('[data-bind]').on('input', (e) => {
            const elem = e.target;
            const key = $(elem).attr('data-bind');
            obj[key] = elem.value;
        });
    };

    const isProductNew = () => {
        const product = data.tempProduct;
        return ( (product.id === '') || (product.id === undefined) );
    };

    const productForm = (product) => {
        const delivery = (product) => {
            const checkAllCities = (country) => {

            };
            // !!! Доделать отмечание всех городов
            const isCheckedAllCities = (country) => {
                return ( (country.code === product.delivery.country.code) &&
                    (country.cities.length == product.delivery.cities.length));
            };
            const isCitiesEmpty = () => {
                return data.tempProduct.delivery.cities.length === 0;
            };
            const checkCities = (country) => {
                const cityList = countries.find((i) => i.code === country.code).cities;
                data.tempProduct.delivery.cities = cityList;
                $('#js-cities').html(renderCityList(country));
            };
            const uncheckCities = (country) => {
                data.tempProduct.delivery.cities = [];
                $('#js-cities').html(renderCityList(country));
            };
            const toggleAllCities = (country) => {
                isCheckedAllCities(country) ? uncheckCities(country) : checkCities(country);
            };

            const changeCity = () => {
                console.log('change')
                const country = countries.find((i) => i.name === data.tempProduct.delivery.country.name);
                data.tempProduct.delivery.cities = [];
                $('input:checked.js-checkbox-city').each(function() {
                    const cityCode = $(this).attr('data-city-code');
                    const cityName = country.cities.find((i) => i.code === cityCode);

                    data.tempProduct.delivery.cities.push({ name: cityName, code: cityCode });
                });

                checkAllCities(country);
            };

            const renderCityList = (country) => {
                const renderCity = (name, code, index) => {
                    const isCityChecked = (code) => {
                        return product.delivery.cities.find((i) => i.code === code)
                    };
                    return `
                        <div class="form-check d-flex">
                            <input class="form-check-input  js-checkbox-city"
                                   type="checkbox"
                                   id="delivery-city-${index}"
                                   data-city-code="${ code }"
                                   value="${ code }"
                                   ${isCityChecked(code) ? "checked" : ""}>
                            <label class="form-check-label" for="delivery-city-${index}">${name}</label>
                        </div>
                    `;
                };

                return `
                    <div class="form-check d-flex">
                        <input class="form-check-input"
                               id="js-checkbox-all-cities"
                               type="checkbox"
                               ${ $(document).on('click', '#js-checkbox-all-cities', () => toggleAllCities(country)) }
                               ${ isCheckedAllCities(country) ? "checked" : "" }>
                        <label class="form-check-label"
                               for="delivery-all-cities">
                            Check all
                        </label>
                    </div>
                    <hr class="my-2">
                    ${ country.cities.map((city, index) => renderCity(city.name, city.code, index)).join('') }
                `;
            };

            const renderCountry = (name, code) => {
                const isCheckedCountry = (product, code) => {
                    return product.delivery.country.code === code;
                };

                return `
                <option
                    data-code="${ code }"
                    ${ isCheckedCountry(product, code) ? "selected" : "" }>
                    ${ name }
                </option>

            `
            };

            const changeCountry = (elem) => {
                const checked = elem.target.querySelector('option:checked').getAttribute('data-code');
                const newCountry = countries.find((i) => i.code === checked);

                data.tempProduct.delivery.country.name = newCountry.name;
                data.tempProduct.delivery.country.code = newCountry.code;

                data.tempProduct.delivery.cities.code = '';
                data.tempProduct.delivery.cities.name = '';

                $('#js-cities').html(renderCityList(newCountry));
            };

            const renderDelivery = (product) => {
                const country = countries.find((i) => i.code === product.delivery.country.code);

                return `
                <div class="form__delivery">
                    <span class="d-inline-block mb-2">Delivery:</span>
                    <div class="row">
                        <div class="col">
                            <select class="form-control" id="js-delivery-country">
                            ${ $(document).on('change', '#js-delivery-country', (e) => changeCountry(e)) }
                            ${ countries.map((i) => renderCountry(i.name, i.code)).join('') }
                            </select>
                        </div>
                        <div class="col">
                            <div class="card py-2 px-3">
                                <div id="js-cities">
                                    ${ renderCityList(country) }
                                    ${ $(document).on('change', '.js-checkbox-city', changeCity) }
                                </div>                          
                            </div>        
                        </div>
                    </div>
                </div>
            `
            };

            return renderDelivery(product);
        };

        const content = `
            <div class="modal-header">
                <h5 class="modal-title">Product</h5>
                <button type="button" class="close close-modal" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="form" id="js-product-form">
                    <div class="form__info">
                        <div class="form-group mb-2">
                            <label for="product-name" class="required" data-requared="true">Name:</label>
                            <input class="form-control"
                                   id="product-name" placeholder="Product name..."
                                   name="name"
                                   data-bind="name"
                                   value="${product.name}">
                        </div>
                        <div class="form-group mb-2">
                            <label for="product-email" class="required" data-requared="true">Supplier email:</label>
                            <input class="form-control"
                                   id="product-email" placeholder="Supplier email..."
                                   name="email"
                                   data-bind="email"
                                   value="${product.email}">
                        </div>
                        <div class="form-group mb-2">
                            <label for="product-quantity" class="required" data-requared="true">Count:</label>
                            <input class="form-control"
                                   id="product-quantity"
                                   placeholder="Quantity..."
                                   name="count"
                                   data-bind="count"
                            value="${ product.count }">
                        </div>
                        <div class="form-group">
                            <label for="product-price" class="quantity" data-requared="true">Price:</label>
                            <input class="form-control"
                                   id="product-price"
                                   placeholder="Price"
                                   name="price"
                                   data-bind="price"
                            value="${product.price}">
                        </div>
                    </div>
                    ${ delivery(product) }                 
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success  js-product-save">${ isProductNew() ? 'Add product' : 'Save changes' }</button>
                <button type="button" class="btn btn-outline-secondary close-modal">Cancel</button>
            </div>      
        `;
        modal(content);
        dataBind(product);
    };

    const productSave = () => {
        // form.find('.field-error').remove();
        //
        // const regexEmail = new RegExp('/^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/');
        //
        // if (form.find('input[name=name]').val() === '') {
        //     form.find('input[name=name]')
        //         .after('<small class="field-error form-text text-danger ">The field is wrong.</small>');
        //     return false;
        // }
        if(isProductNew()) {
            data.tempProduct.id = products.length + 1;
            const productClone = new Clone(data.tempProduct);
            products.push(productClone);
            resetTempProduct();
        } else {
            let index = products.findIndex((i) => i.id === data.tempProduct.id);
            products[index] = new Clone(data.tempProduct);
            resetTempProduct();
        }
        renderTable(products);

        modalClose();
    };

    const productEdit = () => {
        $(document).on('click', '.js-product-edit', (e) => {
            const id = e.target.getAttribute('data-product-id');
            const index = products.findIndex((item) => item.id === Number(id));
            data.tempProduct = new Clone(products[index]);
            productForm(data.tempProduct);
        });
    };

    const productDelete = () => {
        const btns = $(document).on('click', '.js-product-delete', (e) => {
            const id = e.target.getAttribute('data-product-id');
            const product = products.find((item) => item.id === Number(id));

            const content = `
                <div class="modal-header">
                    <h5 class="modal-title">Remove product</h5>
                </div>
                <div class="modal-body">
                    <p>Are you sure delete ${ product.name }?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger close-modal" id="js-delete-product">Delete</button>
                    <button type="button" class="btn btn-success  close-modal">Cancel</button>
                </div>
            `;

            modal(content, 'danger');

            $('#js-delete-product').click(() => {
                const index = products.findIndex((i) => Number(i.id) === Number(id));
                products.splice(+index, 1);

                renderTable(products);
            });
        });
    };

    renderTable(products);
    productEdit();
    productDelete();
    $(document).on('click', '#js-toggle-add-form', () => productForm(data.tempProduct));
    $(document).on('click', '.js-product-save', productSave);
});