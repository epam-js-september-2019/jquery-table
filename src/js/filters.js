let flagName = 0,
  flagPrice = 0,
  sorteredProducts = [];

const filters = {
  sortByNameDesc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    sorted("down", target, sorteredProducts);
  },
  sortByNameAsc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      return b.name.localeCompare(a.name);
    });
    sorted("up", target, sorteredProducts);
  },
  sortByValueDesc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      let x = a.price;
      let y = b.price;
      return x > y ? -1 : x < y ? 1 : 0;
    });
    sorted("down", target, sorteredProducts);
  },
  sortByValueAsc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      let x = a.price;
      let y = b.price;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    sorted("up", target, sorteredProducts);
  }
};

const filterHandler = () => {
  $(document).click(e => {
    let target = $(e.target);

    switch (true) {
      case target.attr("data-sort") == "name":
        flagPrice = 0;
        clearParam();
        if (flagName === 1 || flagName === 0) {
          flagName = 2;
          filters.sortByNameDesc(target);
        } else if (flagName === 2) {
          flagName = 1;
          filters.sortByNameAsc(target);
        }
        break;

      case target.attr("data-sort") == "price":
        flagName = 0;
        clearParam();
        if (flagPrice === 1 || flagPrice === 0) {
          flagPrice = 2;
          filters.sortByValueDesc(target);
        } else if (flagPrice === 2) {
          flagPrice = 1;
          filters.sortByValueAsc(target);
        }
        break;
    }
  });
};
filterHandler();

function clearParam() {
  $(".table-info th").removeClass("down");
  $(".table-info th").removeClass("up");
}

function sorted(way, target, array) {
  if (way === "down") {
    renderItems(array);
    target.removeClass("up");
    target.addClass("down");
  } else if (way === "up") {
    renderItems(sorteredProducts);
    target.removeClass("down");
    target.addClass("up");
  }
}
