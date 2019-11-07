export class Header {
  constructor({ addNew, applySearch, resetSearch }) {
    this.searchForm = $(".js-search");
    this.addButton = $(".js-addnew");
    this.handlers = { addNew, applySearch, resetSearch };
    this.bindEvents();
  }
  bindEvents() {
    this.searchForm.on("submit", e => {
      e.preventDefault();
      this.handlers.applySearch(this.searchForm.find("input").val());
    });
    this.addButton.click(this.handlers.addNew);
  }
}
