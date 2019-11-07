import compileTemplate from "lodash.template";

export class ProductsList {
  constructor({ showDetails, edit, remove }) {
    this.handlers = { showDetails, edit, remove };
    this.table = $(".js-table");
    this.renderTableTemplate = compileTemplate($("#table-template").html());
    this.bindEvents();
    console.log("Products list has been initialized");
  }
  render(data) {
    const html = this.renderTableTemplate(data);
    this.table.html(html);
  }
  bindEvents() {
    this.table.on("click", ".js-details", this.showDetails.bind(this));
    this.table.on("click", ".js-edit", this.editProduct.bind(this));
    this.table.on("click", ".js-remove", this.removeProduct.bind(this));
  }
  showDetails(e) {
    e.preventDefault();
    const id = this._getIdFromElement(e.target);
    this.handlers.showDetails(id);
  }
  editProduct(e) {
    const id = this._getIdFromElement(e.target);
    this.handlers.edit(id);
  }
  removeProduct(e) {
    const id = this._getIdFromElement(e.target);
    this.handlers.remove(id);
  }
  _getIdFromElement(el) {
    return $(el)
      .closest(".js-product")
      .data("id");
  }
}
