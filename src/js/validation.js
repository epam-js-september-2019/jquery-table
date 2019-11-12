function validation(array) {
  return nameValidation(array.name) &&
    emailValidation(array.email) &&
    numberValidation(array.count, "#product-count", "#count-error") &&
    numberValidation(array.price, "#product-price", "#price-error")
    ? setFormatedPrice(array.price)
    : false;
}

function nameValidation(name) {
  if (/^\s+$/.test(name) || name.length === 0) {
    generateError("#product-name", "#name-error", "Name can not be empty");
    return false;
  } else if (name.trim().length > 0 && name.trim().length < 5) {
    generateError("#product-name", "#name-error", "Enter min 5 characters");
    return false;
  } else if (name.trim().length > 15) {
    generateError("#product-name", "#name-error", "Enter max 15 characters");
    return false;
  } else {
    deleteError("#product-name", "#name-error");
    return true;
  }
}

function emailValidation(email) {
  const pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  if (email.length === 0) {
    generateError("#product-email", "#email-error", "Please enter email");
    return false;
  } else if (pattern.test(email)) {
    deleteError("#product-email", "#email-error");
    return true;
  } else {
    generateError("#product-email", "#email-error", "Please enter email");
    return false;
  }
}

function numberValidation(count, field, fieldError) {
  if (typeof count !== "number" || count < 0 || count === 0 || isNaN(count)) {
    generateError(field, fieldError, "Enter positive number");
    return false;
  } else {
    deleteError(field, fieldError);
    return true;
  }
}

function generateError(field, fieldError, message) {
  modalEdit.find(field).addClass("error");
  modalEdit
    .find(fieldError)
    .removeClass("d-none")
    .html(message);
  modalEdit
    .find(field)
    .val("")
    .focus();
}

function deleteError(field, fieldError) {
  modalEdit.find(field).removeClass("error");
  modalEdit
    .find(fieldError)
    .addClass("d-none")
    .html("");
}

function setFormatedPrice(price) {
  $("#product-price").val("$" + formatPrice(price));
  return true;
}
