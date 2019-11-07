import PRODUCTS_DATA from "../fixtures/products.json";

const REQUEST_DELAY = 1200;
const LS_KEY = "minerals:store";

export class ProductsModel {
  constructor() {
    this._products = [];
    this._listeners = [];
  }
  init() {
    if (localStorage.getItem(LS_KEY)) {
      this._products = JSON.parse(localStorage.getItem(LS_KEY));
    } else {
      this._products = PRODUCTS_DATA;
    }
    return this._request().then(() =>
      console.log("Product list has been loaded")
    );
  }
  getAll() {
    return this._products;
  }
  getDetails(id) {
    return this._products.find(item => item.id === id);
  }
  addNewProduct(data) {
    const newId = this._getAutoincrementedId();
    this._products.push({ id: newId, ...data });
    return this._request().then(() =>
      console.log(`Product #${newId} has been succesfully added`)
    );
  }
  updateProduct(id, data) {
    const product = this._products.find(item => item.id === id);
    const productIndex = this._products.findIndex(item => item.id === id);
    this._products[productIndex] = { ...product, ...data };
    return this._request().then(() =>
      console.log(`Product #${id} has been succesfully updated`)
    );
  }
  removeProduct(id) {
    const productIndex = this._products.findIndex(item => item.id === id);
    this._products.splice(productIndex, 1);
    return this._request().then(() =>
      console.log(`Product #${id} has been succesfully removed`)
    );
  }
  subscribe(callback) {
    if (typeof callback !== "function") return;
    this._listeners.push(callback);
    return function unsubscribe() {
      this.listeners = this._listeners.filter(l => l !== callback);
    };
  }
  persistData() {
    localStorage.setItem(LS_KEY, JSON.stringify(this._products));
  }
  _notifyListeners() {
    this._listeners.forEach(listener => listener(this._products));
  }
  _getAutoincrementedId() {
    const maxId = this._products.reduce(
      (max, item) => (item.id > max ? item.id : max),
      0
    );
    return maxId + 1;
  }
  _request() {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        this._notifyListeners();
        this.persistData();
        resolve(this._products);
      }, REQUEST_DELAY)
    );
  }
}
