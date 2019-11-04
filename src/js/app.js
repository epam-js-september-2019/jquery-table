import { ProductsList } from "./productsList.js";
import { EditForm } from "./editForm.js";
import { AddForm } from "./addForm.js";
import { RemoveDialog } from "./removeDialog.js";

export class App {
  constructor() {
    this.table = new ProductsList({
      showDetails: this.showDetails.bind(this),
      edit: this.editProduct.bind(this),
      remove: this.removeProduct.bind(this)
    });
    console.log("App has been initialized");
    this.table.render({ items: PRODUCTS });
  }
  showDetails(id) {
    console.log("Show details: " + id);
  }
  editProduct(id) {
    console.log("Edit product: " + id);
  }
  removeProduct(id) {
    console.log("Show details " + id);
  }
}

const PRODUCTS = [
  { id: 1, name: "Antarcticite", amount: 5, price: 1115 },
  { id: 2, name: "Brookite", amount: 72, price: 782 },
  { id: 3, name: "Chrysocolla", amount: 5, price: 880 },
  { id: 4, name: "Heulandite", amount: 77, price: 944 },
  { id: 5, name: "Pyroxene", amount: 115, price: 1120 }
];
