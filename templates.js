let _ = require('lodash/template');

 export let tableRow = _('<tr>'+
    '<th><a href ="#open-modal-form" id="show-product-info"><%= name %></a>' +
    '<div class="float-right count"><%= count %></div></th>'+
    '<th><%= price%></th>'+
    '<th>' +
     '<a href="#open-modal-form"><button type="button" class="btn btn-secondary col-4" id="edit-product-info">Edit</button></a>'+
    '<a href="#open-modal-yes-no"><button type="button" class="btn btn-secondary col-4 float-right" id="delete-product">Delete</button></a></th>'+
    '</tr>');

 export let cityTable = _(
     "                    <div class=\"form-check row p-2 border-bottom \" >\n" +
     "                        <input class=\"form-check-input select-all\" type=\"checkbox\" value=\"\" id=\"defaultCheck1\">\n" +
     "                        <label class=\"form-check-label\" for=\"defaultCheck1\">\n" +
     "                            Select All\n" +
     "                        </label>\n" +
     "                    </div>\n" +
     "\n" +
     "                    <div class=\"form-check\" >\n" +
     "                        <input class=\"form-check-input city\" type=\"checkbox\" value=\"\" id=\"defaultCheck2\">\n" +
     "                        <label class=\"form-check-label\" for=\"defaultCheck2\">\n" +
     "                            <%= city1 %>\n" +
     "                        </label>\n" +
     "                    </div>\n" +
     "                    <div class=\"form-check\" >\n" +
     "                        <input class=\"form-check-input city\" type=\"checkbox\" value=\"\" id=\"defaultCheck3\">\n" +
     "                        <label class=\"form-check-label\" for=\"defaultCheck3\">\n" +
     "                            <%= city2 %>\n" +
     "                        </label>\n" +
     "                    </div>\n" +"<div class=\"form-check\" >\n" +
"                        <input class=\"form-check-input city\" type=\"checkbox\" value=\"\" id=\"defaultCheck3\">\n" +
"                        <label class=\"form-check-label\" for=\"defaultCheck3\">\n" +
"                            <%= city3%>\n" +
"                        </label>\n" +
"                    </div>\n" );
