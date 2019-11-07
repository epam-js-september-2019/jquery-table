import { ProductsModel } from "./productsModel.js";
import { ProductsList } from "./productsList.js";
import { AddForm } from "./addForm.js";
import { RemoveDialog } from "./removeDialog.js";

export class App {
  constructor() {
    this.model = new ProductsModel();
    this.table = new ProductsList({
      showDetails: this.showDetails.bind(this),
      edit: this.editProduct.bind(this),
      remove: this.removeProduct.bind(this)
    });
    this.table.render({ items: this.model.getAll() });
    this.model.subscribe(data => this.table.render({ items: data }));
    this.model.init();
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
