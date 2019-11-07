import compileTemplate from "lodash.template";

export class Table {
  constructor({ showDetails, edit, remove }) {
    this.handlers = { showDetails, edit, remove };
    this.sort = { field: "name", direction: "asc" };
    this.table = $(".js-table");
    this.renderTableTemplate = compileTemplate($("#table-template").html());
    this.bindEvents();
  }
  render(items) {
    const html = this.renderTableTemplate({
      sortField: this.sort.field,
      sortDirection: this.sort.direction,
      items: items.sort(this._getCompareFunction()),
      thClasses: this._getThClasses()
    });
    this.table.html(html);
    this.items = items;
  }
  bindEvents() {
    this.table.on("click", ".js-details", this.showDetails.bind(this));
    this.table.on("click", ".js-edit", this.editProduct.bind(this));
    this.table.on("click", ".js-remove", this.removeProduct.bind(this));
    this.table.on("click", ".js-th", e => {
      const field = e.target.dataset.sortField;
      const dir = this.sort.direction === "asc" ? "desc" : "asc";
      this.changeSort(field, dir);
    });
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
  changeSort(field, direction = "asc") {
    this.sort = { field, direction };
    this.render(this.items);
  }
  _getThClasses() {
    const field = this.sort.field;
    const dir = this.sort.direction;
    const className = dir === "asc" ? "b-th--sort--asc" : "b-th--sort--desc";
    return {
      name: field === "name" ? className : "",
      price: field === "price" ? className : ""
    };
  }
  _getCompareFunction() {
    const key = this.sort.field;
    return (a, b) => {
      if (this.sort.direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    };
  }
  _getIdFromElement(el) {
    return $(el)
      .closest(".js-product")
      .data("id");
  }
}
