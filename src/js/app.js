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
