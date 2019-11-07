$(document).ready(function(){

  //call add product function
  ListenerAddProduct();	

   //search function
	$('#search').keyup(function(event) {
    if (event.keyCode == 27 || $(this).val() == '') {
			$(this).val('');
      $('tr').removeClass('name').show().addClass('name');
    }
	else {
      filter('tr', $(this).val());
    }
  });
 
  //sort function
  (function($) {
  var $content = $("#search-results");
  var $products = $('.product', $content);
  $('#search-menu').on('click', 'a', function(e) {
    e.preventDefault();
    sortContent($(this));
  });

  function sortContent($el) {
    var type = '.' + $el.data('sort');
    var sort = $el.hasClass('sort-up') ? 1 : -1;
    $products.sort(function(a, b) {
      return sort * $(type, b).text().toLowerCase().localeCompare($(type, a).text().toLowerCase());
    }).appendTo($content);
    sort > 0 ? $el.removeClass('sort-up').addClass('sort-down') : $el.removeClass('sort-down').addClass('sort-up');
  }
  }(jQuery));

});   

//search filter
function filter(filter, query) {
  query =	$.trim(query);
    $(filter).each(function() {
     ($(this).text().search(new RegExp(query, "i")) < 0) ? $(this).hide().removeClass('name') : 
    $(this).show().addClass('name');
    });
  }

//add product function
function ListenerAddProduct(){
var $tasksList = $(".tasksList");
var $taskInput = $("#ProdName");
var $countInput = $("#count");
var $PriceInput = $("#Price");
var $button = ("<td>"+'<a href="#openModalEdit" class="AddnewLink" id="Edit">'+"Edit"+"</a>"+'<a href="#openModalDelete" class="AddnewLink" id="Delete">'+"Delete"+"</a>"+"</td>");



  $("#send").click(function(){
      if(!$taskInput.val()) {return false;}

      $tasksList.append("<tr class='product' id='product'>"+"<td class='div_name product_name'><span class='product_title'>" + $taskInput.val()+ '</span><span class="badge badge-primary badge-pill">'+$countInput.val()+"</span>"+"</td>"+'<td class="product_price">'+"$"+$PriceInput.val()+"</td>"+$button+"</tr>");
      $taskInput.val("");
      $countInput.val("");
      $PriceInput.val("");
      ListenerToDeleteProduct();
      ListenerToEditProduct();
  });
}

//delete product function
function ListenerToDeleteProduct(){

  $("#Delete").click(function(){
    var $ProdTitle = $(this).closest("tr").children("td").children("span.product_title");
    $( ".question" ).append( $ProdTitle.clone());
    $(this).closest("tr").addClass("remove");
    $("#openModalDelete").modal("show");
    $(".delete").click(function(){
      $(".remove").remove();
      $("#openModalDelete").modal("hide");
    });
    });
}
    
//edit product function
function ListenerToEditProduct(){

  $("#Edit").click(function(){
    var valueEditTask = $(this).closest("tr").children("td").children("span.product_title");
    var valueEditCount = $(this).closest("tr").children("td").children("span.badge.badge-primary.badge-pill");
    var valueEditPrice = $(this).closest("tr").children("td.product_price");
    $("#openModalEdit").modal("show");
    var inputForEdit = $(".input-task-edit");
    var inputCountEdit = $(".input-count-edit");
    var inputPriceEdit = $(".input-price-edit");
    inputForEdit.val(valueEditTask.text());
    inputCountEdit.val(valueEditCount.text());
    inputPriceEdit.val(valueEditPrice.text());
    $(".save-changes").unbind("click");
    $(".save-changes").click(function(){
      if(!inputForEdit.val().trim()){
        alert("Empty value");
        return false;
      }
      valueEditTask.text(inputForEdit.val());
      valueEditCount.text(inputCountEdit.val());
      valueEditPrice.text(inputPriceEdit.val());
    });
  });
}

//checkbox visible
$('#Russia').click(function() {
  $(".checkbox").css("display","block");
});

//checkbox select
$(document).on('change', 'input[type=checkbox]', function () {
  var $this = $(this), $chks = $(document.getElementsByName(this.name)), $all = $chks.filter(".chk-all");
  
  if ($this.hasClass('chk-all')) {
    $chks.prop('checked', $this.prop('checked'));
  } else switch ($chks.filter(":checked").length) {
    case +$all.prop('checked'):
      $all.prop('checked', false).prop('indeterminate', false);
      break;
    case $chks.length - !!$this.prop('checked'):
      $all.prop('checked', true).prop('indeterminate', false);
      break;
    default:
      $all.prop('indeterminate', true);
  }
});

//validate form
jQuery(function($) {
  $('#register').on('submit', function(event) {
    if ( validateForm() ) { // if error return true
      event.preventDefault();
    }
  });
  
  function validateForm() {
    $(".text-error").remove();
    
    // validate name form   
    var el_l    = $("#ProdName");
    if ( el_l.val().length < 6 || el_l.val().length > 15 ) {
      var v_ProdName = true;
      el_l.after('<span class="text-error for-ProdName">Product name must be 5-15 characters</span>');
      $(".for-ProdName").css({top: el_l.position().top + el_l.outerHeight() + 2});
    } 
    $("#ProdName").toggleClass('error', v_ProdName );
    
    // validate e-mail
    
    var reg     = /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i;
    var el_e    = $("#email");
    var v_email = el_e.val()?false:true;
  
    if ( v_email ) {
      el_e.after('<span class="text-error for-email">e-mail can not be empty</span>');
      $(".for-email").css({top: el_e.position().top + el_e.outerHeight() + 2});
    } else if ( !reg.test( el_e.val() ) ) {
      v_email = true;
      el_e.after('<span class="text-error for-email">error e-mail</span>');
      $(".for-email").css({top: el_e.position().top + el_e.outerHeight() + 2});
    }
    $("#email").toggleClass('error', v_email );

    return ( v_ProdName || v_email );
  }
});
 