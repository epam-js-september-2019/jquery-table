const searchHandler = () => {
  $(document).click(e => {
    let target = $(e.target);

    if (target.hasClass("button-search")) {
      search();
    }
  });

  $(document).keypress(function(e) {
    if (e.which == 13) {
      search();
    }
  });

  $("#search").change(e => {
    if (!$(e.target).val()) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(renderItems(productsArray));
        }, 500);
      });
    }
  });
};

searchHandler();

function search() {
  let value = $("#search").val(),
    modalWarning = $(".modal-window--warning"),
    overlay = $(".overlay");

  if (!value) {
    showModalWarning(modalWarning, overlay, "Please enter product name");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(renderItems(productsArray));
      }, 500);
    });
  } else {
    const result = productsArray.filter(
      item => item.name.toLowerCase() === value.toLowerCase()
    );
    if (result.length) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(renderItems(result));
        }, 500);
      });
    } else {
      showModalWarning(
        modalWarning,
        overlay,
        "Product '" + value + "' is not found"
      );
      $("#search").val("");
    }
  }
}

function showModalWarning(modalWarning, overlay, message) {
  modalWarning.find("p").html(message);
  modalWarning.fadeIn();
  overlay.addClass("active");
}
