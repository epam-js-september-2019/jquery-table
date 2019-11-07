export class Header {
  constructor({ addNew, applySearch, resetSearch }) {
    this.searchForm = $(".js-search");
    this.clearButton = $(".js-clear-search");
    this.addButton = $(".js-addnew");
    this.handlers = { addNew, applySearch, resetSearch };
    this.bindEvents();
  }
  bindEvents() {
    this.searchForm.on("submit", e => {
      e.preventDefault();
      this.applySearch();
    });
    this.searchForm.on("keyup", e => {
      if (e.key === "Escape") {
        this.resetSearch();
      }
    });
    this.clearButton.click(e => {
      e.preventDefault();
      this.resetSearch();
    });
    this.addButton.click(this.handlers.addNew);
  }
  applySearch() {
    this.handlers.applySearch(this.searchForm.find("input").val());
    this.clearButton.show();
  }
  resetSearch() {
    this.searchForm.find("input").val(null);
    this.handlers.resetSearch();
    this.clearButton.hide();
  }
}
