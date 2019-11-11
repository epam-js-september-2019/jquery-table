function formatPrice(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
 };

function priceHandler(){
  $("#product-price").blur(function() {
    if(numberValidation(+$("#product-price" ).val(), "#product-price", "#price-error")) {
      $("#product-price" ).val("$" + formatPrice(+$("#product-price" ).val()))
      return +$("#product-price" );
    } else {
      $("#product-price" ).val()
    }
  });
}
