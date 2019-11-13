
$(document).ready(function (){
    openModalAdd();
    search();
    
});

const maillReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const numReg = /^([0-9-+])/;

function openModalAdd() {
    $(".open").click(function () {
        $(".addModalBack").show('slow');
        $(".addWindow").show('slow');
    }); 
    $(".cancel").click(function () {
        $(".addModalBack").hide('fast');
        $("small.wrong").remove();
    });
    $(".send").click(function () { 
        var product = new Object(); 
        product.name = $(".productName").val();
        product.count = $(".productCount").val();
        product.price = $(".productPrice").val();
        product.eMail = $(".eMail").val();
        $("small.wrong").remove();
        if (product.name.length < 5 || product.name.length > 15){
            var containerTable1 = "<small class='wrong'>" +'Name must be between 5 and 15 characters'+"</div>";
            $("small.wrong").remove();
            $(".productName").after(containerTable1);
            return false;
        } else if (!product.name.replace(/ /g, "")) {
            var containerTable1 = "<small class='wrong'>" +'Name cannot consist of spaces'+"</div>";
            $("small.wrong").remove();
            $(".productName").after(containerTable1);
            return false;
        }
        if (!maillReg.test(product.eMail)){
            var containerTable1 = "<small class='wrong'>" +'Enter a valid email address'+"</div>";
            $("small.wrong").remove();
            $(".eMail").after(containerTable1);
            return false;
        }
        if (!numReg.test(product.count)){
            var containerTable1 = "<small class='wrong'>" +'Count may contain only numbers'+"</div>";
            $("small.wrong").remove();
            $(".productCount").after(containerTable1);
            return false;
        }
        if (!numReg.test(product.price)){
            var containerTable1 = "<small class='wrong'>" +'Price may contain only numbers'+"</div><br>";
            $("small.wrong").remove();
            $(".productPrice").after(containerTable1);
            return false;
        }
        var containerTable = "<#table><tbody><tr><td><button type='button' class='btn btn-link showInfo'><span class='name' >" + product.name + "</span></button></td><td><span class='count'>" + product.count + "</span></td><td><span class='price'>" + product.price + "</span></td><td><div class='action d-flex justify-content-around'><button type='button' class='btn btn-primary edit-product'>Edit</button>"+"<div class = 'hideMail'>" + product.eMail + "</div><button type='button' class='btn btn-primary delete-product'>Delete</button></div></td></tr></tbody>";
        $("#table").append(containerTable);
        $(".productName").val("");
        $(".productCount").val("");
        $(".productPrice").val("");
        $(".eMail").val("");
        $(".addModalBack").hide('fast');
        deleteProd();
        editProd();
        showInfo();
    })
}

function showInfo(){
    
    $(".showInfo").click(function () {
        let thisContext2 = this;
        var qwe = $(thisContext2).parents("tr").find(".name");
        $(".productNameShow").val($(thisContext2).parents("tr").find(".name").text());
        $(".productCountShow").val($(thisContext2).parents("tr").find(".count").text());
        $(".productPriceShow").val($(thisContext2).parents("tr").find(".price").text());
        $(".productMailShow").val($(thisContext2).parents("tr").find(".hideMail").text());
        $(".infoModalBack").show('slow');
        $(".productInfo").show('slow');
        $(".cancel").click(function () {
            
            $(".productInfo").hide('fast');
            $(".infoModalBack").hide('fast');
            
            $("div.nameInf").empty();
            $("div.nameInf").empty();
        });
    });    
}

function deleteProd(){
     $(".delete-product").click(function () {
        $(".deleteModalBack").show('slow');
        $(".modalDelete").show('slow');
        let thisContext = this; 
         $(".confirm").click(function () {
            $(thisContext).parents('tr').remove();
            $(".modalDelete").hide('fast');
        });
         $(".cancel").click(function () {
        $(".deleteModalBack").hide('fast');
        $(".modalDelete").hide('fast');
        });
        
    }); 
}

function editProd(){
     $(".edit-product").click(function () {
         var nameprod = $(this).parents("tr").find(".name");
         var countprod = $(this).parents("tr").find(".count");
         var priceprod = $(this).parents("tr").find(".price");
         var emailprod = $(this).parents("tr").find(".hideMail");
         $(".editModalBack").show('slow');
         $(".editWindow").show('slow');
                              
         var inputNameEdit = $(".productNameEdit");             
         var inputCountEdit = $(".productCountEdit");        
         var inputPriceEdit = $(".productPriceEdit");  
         var inputeMailEdit = $(".producteMailEdit");
         
         inputNameEdit.val(nameprod.text());
         inputCountEdit.val(countprod.text());
         inputPriceEdit.val(priceprod.text());
         inputeMailEdit.val(emailprod.text());
         
         $(".sendEdit").unbind("click");
         $("small.wrong").remove();
         $(".sendEdit").click(function() {
            if (inputNameEdit.val().length < 5 || inputNameEdit.val().length > 15){
                var containerTable1 = "<small class='wrong'>" +'Name must be between 5 and 15 characters'+"</div>";
                 $("small.wrong").remove();
                $(".productNameEdit").after(containerTable1);
                return false;
             } else if (!inputNameEdit.val().replace(/ /g, "")) {
            var containerTable1 = "<small class='wrong'>" +'Name cannot consist of spaces'+"</div>";
            $("small.wrong").remove();
            $(".productNameEdit").after(containerTable1);
            return false;
        }
             
            if (!maillReg.test(inputeMailEdit.val())){
            var containerTable1 = "<small class='wrong'>" +'Enter a valid email address'+"</div>";
            $("small.wrong").remove();
            $(".producteMailEdit").after(containerTable1);
            return false;
            }
             
            if (!numReg.test(inputCountEdit.val())){
            var containerTable1 = "<small class='wrong'>" +'Count may contain only numbers'+"</div>";
            $("small.wrong").remove();
            $(".productCountEdit").after(containerTable1);
            return false;
        }
             
            if (!numReg.test(inputPriceEdit.val())){
            var containerTable1 = "<small class='wrong'>" +'Price may contain only numbers'+"</div>";
            $("small.wrong").remove();
            $(".productPriceEdit").after(containerTable1);
            return false;
        }
             
             nameprod.text(inputNameEdit.val());
             countprod.text(inputCountEdit.val());
             priceprod.text(inputPriceEdit.val());
             emailprod.text(inputeMailEdit.val());
             $(".editWindow").hide('fast');
         })
         $(".cancel").click(function () {
            $(".editModalBack").hide('fast');
            $(".editWindow").hide('fast');
            $("small.wrong").remove();
        });
     })
}

function search(){  
    $(".sBut").click(function () {
        var inputSearchInp = $(".inputSearch");
        $('table span').each(function(){
            if ($(".inputSearch").val()==$(this).parents("tr").find(".name").text()){
                console.log('true')
            }else if ($(".inputSearch").val()== "") {
                console.log("false")
                $(this).parents('tr').show();
            } else   {
                console.log("false")
                $(this).parents('tr').hide();
            }
        });
    })
}







