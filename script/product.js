$(function () {
    let createProduct = (name, email, count, price, priceData) => {
        return `<tr class="table-row" data-row="${name}">
                <td class="align-middle table-data" data-name="name-sort" data-value="${name}">
                    <a href="#" class="name-link">${name}</a>
                    <span class="float-right product-count border border-info rounded px-2">${count}</span>
                </td>
                <td class="align-middle" data-name="price-sort" data-value="${priceData}">${price}</td>
                <td class="align-middle">
                    <button class="btn btn-primary button-edit" type="button" data="${name}">Edit</button>
                    <button class="btn btn-danger button-delete float-right" type="button" data="${name}">Delete</button>
                </td>
            </tr>`;
    };

    let createProductInfo = (name, email, count, price, country, cities) => {
        return  `<div class="product-info flex-column position-absolute container border border-primary px-5 py-4 shadow-lg bg-white w-25" id="${name}">
                    <p class="my-2">Name: ${name}</p>
                    <p class="my-2">Email: <span>${email}</span></p>
                    <p class="my-2">Count: <span>${count}</span></p>
                    <p class="my-2">Price: <span>${price}</span></p>
                    <p class="my-2">Delivery: <span>${country}</span></p>
                    <p class="my-2">Cities: <span>${cities}</span></p>
                    <button class="align-self-start btn btn-primary mt-2 w-100 close-button" type="button">Close</button>
                </div>`;
    };

    window.product = {
        createProduct,
        createProductInfo
    }
});