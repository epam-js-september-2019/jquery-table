$(document).ready(function() {

  let countries = [];

  function Country(name, cities) {
    this.name = name;
    this.cities = cities;
  }

  function findCountry(name) {
    for(country of countries){
      if(country.name == name) return country;
    }
  }

  let country1 = new Country('Russia', ['Saratov', 'Moscow', 'St.Petersburg', 'Rostov']);
  countries.push(country1);
  let country2 = new Country('Belarus', ['Minsk', 'Vitebsk']);
  countries.push(country2);
  let country3 = new Country('USA', ['New York', 'Los Angeles']);
  countries.push(country3);

  //SELECT

  function fillCountrySelect() {
    let htmlCountries = "";
    countries.forEach(country => {
      htmlCountries += `<option>${country.name}</option>\n`;
    });
    $('.country-select')[0].innerHTML = htmlCountries;
  }
  fillCountrySelect();

  //CHECKBOXES
  let newCardDelivery = [];
  let tmpCountry;

  function fillCitiesCheckboxes() {
    tmpCountry = getSelectedCountry();
    let htmlCities = `<div style= "border-bottom: 1px solid grey"><input type="checkbox" class="select-all-checkboxes">Select All</div>\n`;

    findCountry(tmpCountry).cities.forEach(city => {
      htmlCities += `<div><input type="checkbox" class="checkbox" value="${city}">${city}</div>\n`;
    });

    $('.checkboxes')[0].innerHTML = htmlCities;

    let findedCountry = newCardDelivery.find(country => country.name == tmpCountry);
    if(findedCountry){
      let i = 0;
      $('.checkbox').each(function(){
        if(this.value == newCardDelivery.find(country => country.name == tmpCountry).cities.find(city => city == this.value)){
          this.checked = true;
          i++;
        }
      });
      if(i == $('.checkbox').length){
        $('.select-all-checkboxes')[0].checked = true;
      }
    }

    $('.select-all-checkboxes')[0].onclick = function(){
      let isChecked = false;
      if($('.select-all-checkboxes')[0].checked){
        isChecked = true;
      }
      $('.checkbox').each(function(){
        this.checked = isChecked;
      });
    };

    $('.checkbox').each(function(){
      this.onclick = function(){
        if( (! $(this).checked) && $('.select-all-checkboxes')[0].checked){
          $('.select-all-checkboxes')[0].checked = false;
        }

        if(this.checked){
          let isAllChecked = true;
          $('.checkbox').each(function(){
            if(!this.checked){
              isAllChecked = false;
            }
          });
          $('.select-all-checkboxes')[0].checked = isAllChecked;
        }
      }
    });
  }
  fillCitiesCheckboxes();

  function getSelectedCountry(){
    let countrySelectOptions = $('.country-select')[0].options;
    let selectedCountryIndex = countrySelectOptions.selectedIndex;
    return selectedCountry = countrySelectOptions[selectedCountryIndex].value;
  }

  $('.country-select')[0].onchange = function() {
    saveDeliveryChoice();
    fillCitiesCheckboxes();
  };

  function saveDeliveryChoice() {
    let citiesMass = [];
    $('.checkbox').each(function(){
      if(this.checked){
        citiesMass.push(this.value);
      }
    });

    let findedCountry = newCardDelivery.find(country => country.name == tmpCountry);

    if(findedCountry && citiesMass.length != 0){
      findedCountry.cities = citiesMass;
    } else if(citiesMass.length != 0){
      newCardDelivery.push(new Country(tmpCountry, citiesMass));
    }

  }

  // CARDS

  class ID {
    constructor(){
      this.id = 0;
    }
    getID(){
      return ++this.id;
    }
  }

  let tmp_id = new ID();
  let mass_id = [];

  function Card(name, email, count, price, delivery = []) {
    this.id = tmp_id.getID();
    this.name = name;
    this.email = email;
    this.count = count;
    this.price = price;
    this.delivery = delivery;
  }

  function findCard(id) {
    for(card of cards){
      if(card.id == id) {
        return new Promise((resolve, reject) => {
  				setTimeout(() => resolve(card), 1000);
        });
      }
    }
  }

  function addCard(card) {
    cards.push(card);
    addCardInTable(card);
    updateFunctions();
    mass_id.push(card.id);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this), 1000);
    });
  }

  function deleteCard(card) {
    cards.splice(findIdIndex(card.id), 1);
    mass_id.splice(findIdIndex(card.id), 1);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this), 1000);
    });
  }

  function addCardInTable(card){
    $('.table-body')[0].innerHTML += `<tr class="tr">
                                        <td style="width:45%">
                                          <div class="row mr-1">
                                            <div class="col-md-10"><a href=# class="name-link">${card.name}</a></div>
                                            <div class="col-md-2 card-count text-center bg-secondary text-white border">${card.count}</div>
                                          </div>
                                        </td>
                                        <td style="width:22%">${getUsaPriceValue(card.price)}</td>
                                        <td style="width:33%; min-width:227px">
                                          <div class="row p-1">
                                            <div class="col-6 pl-4 pr-1">
                                              <button class="btn btn-outline-primary edit-button-card" type="button" style="width:90%; min-width:75px">Edit</button>
                                            </div>
                                            <div class="col-6 pr-4 pl-1">
                                              <button class="btn btn-outline-primary delete-button-card" type="button" style="width:90%; min-width:75px">Delete</button>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>`;
  }

  function refreshTable(){
    $('.table-body')[0].innerHTML = null;
    cards.forEach(card => {
      addCardInTable(card);
    })
    updateFunctions();
  }

  function massIdUpdate(){
    mass_id = [];
    for(card of cards){
      mass_id.push(card.id);
    }
  }

  function findIdIndex(id){
    for(let i = 0; i < mass_id.length; i++){
      if(mass_id[i] == id){
        return i;
      }
    }
  }

  let cards = [];

  let card1 = new Card('Some product', 'sushi-42@gmail.com', 10, 800.55, [new Country('Russia', ['Saratov', 'Moscow', 'St.Petersburg']), new Country('Belarus', ['Minsk', 'Vitebsk'])]);
  addCard(card1);
  let card2 = new Card('Product name', 'pizzaAy@mail.ru', 20, 600, [new Country('Russia', ['Moscow', 'St.Petersburg']), new Country('Belarus', ['Minsk']), new Country('USA', ['New York', 'Los Angeles'])]);
  addCard(card2);
  let card3 = new Card('Another product', 'burger442@yandex.ru', 4, 2300.7, [new Country('Belarus', ['Minsk', 'Vitebsk']), new Country('USA', ['New York'])]);
  addCard(card3);


  //SORT

  let isNameDownSort = false;
  let isPriceDownSort = false;

  $(".name-header-link")[0].onclick = function(){
    $('.card-for-search')[0].value = "";
    if($(".name-arrow-down").css("display") == "none" && !isNameDownSort){
      cards.sort((a, b) => a.name.localeCompare(b.name));
      $(".name-arrow-down").show();
      $(".name-arrow-up").hide();
      isNameDownSort = true;
    }else{
      cards.sort((a, b) => -a.name.localeCompare(b.name));
      $(".name-arrow-down").hide();
      $(".name-arrow-up").show();
      isNameDownSort = false;
    }
    $(".price-arrow-down").hide();
    $(".price-arrow-up").hide();
    massIdUpdate();
    refreshTable();
  }

  $(".price-header-link")[0].onclick = function(){
    $('.card-for-search')[0].value = "";
    if($(".price-arrow-down").css("display") == "none" && !isPriceDownSort){
      cards.sort((a, b) => a.price - b.price);
      $(".price-arrow-down").show();
      $(".price-arrow-up").hide();
      isPriceDownSort = true;
    }else {
      cards.sort((a, b) => b.price - a.price);
      $(".price-arrow-down").hide();
      $(".price-arrow-up").show();
      isPriceDownSort = false;
    }
    $(".name-arrow-down").hide();
    $(".name-arrow-up").hide();
    massIdUpdate();
    refreshTable();
  }


  //SEARCH

  $('.search-button')[0].onclick = function(){
    returnInitialTable();
    searchCardInTable();
  };

  $('.card-for-search')[0].onkeypress = function(e) {
    if(e.code === 'Enter'){
      returnInitialTable();
      e.preventDefault();
      searchCardInTable();
    }
  }

  function searchCardInTable(){
    let nameForSearch = $('.card-for-search')[0].value.toLowerCase();
    $(".name-link").each(function(i){
      if(this.innerHTML.toLowerCase() != nameForSearch){
          $(`.tr`)[i].hidden = true;
        }
    });
  }

  $('.card-for-search')[0].oninput = function(){
    if($('.card-for-search')[0].value == ""){
      returnInitialTable();
    }
  };

  function returnInitialTable(){
    for(let i = 0; i < cards.length; i++){
      $(`.tr`)[i].hidden = false;
    }
  }

  let isAdd = false;
  let editableCard;

  function updateFunctions(){
    $('.delete-button-card').each(function(index){
      this.onclick = function(){
        let card = findCard(mass_id[index]);
        card.then((card) => {
          $('.delete-popup-warning-msg')[0].innerHTML = `Are you sure you want to delete ${card.name}?`;
          $('.delete-overlay').show();
          $('.delete-popup-warning-msg')[0].innerHTML += `<div class="reserve-card" style="display:none;">${mass_id[index]}</div>`;
        });
      }
    });

    $('.edit-button-card').each(function(index){
      this.onclick = function(){
        editCard(mass_id[index]);
      }
    });

    $('.name-link').each(function(index){
      this.onclick = function(){
        editCard(mass_id[index]);
      }
    });
  }

  function editCard(index) {
    isAdd = false;
    let card = findCard(index);
    card.then((card) => {
      editableCard = card;

      $('.name-input')[0].value = card.name;
      $('.count-input')[0].value = card.count;
      $('.email-input')[0].value = card.email;
      $('.price-input')[0].value = getUsaPriceValue(card.price);

      let firstCountryIndex = 0;

      for(let i = 0; i < card.delivery.length; i++){
        if(card.delivery[i].name == countries[0].name){
          firstCountryIndex = i;
        }
      }

      let i = 0;
      if(card.delivery.length != 0){
        card.delivery[firstCountryIndex].cities.forEach(city => {
          $('.checkbox').each(function(){
            if(this.value == city){
              this.checked = true;
              i++;
              return false;
            }
          });
        });
      }

      if(i == $('.checkbox').length){
        $('.select-all-checkboxes')[0].checked = true;
      }

      newCardDelivery = card.delivery;

      $('.add-overlay').show();
    });
  }


  // MODAL WINDOW: DELETE CARD

  $('.no-button')[0].onclick = function(){
    $('.delete-overlay').fadeOut();
  };

  $('.yes-button')[0].onclick = function(){
    let index = $('.reserve-card')[0].innerText;
    let card = findCard(index);
    card.then((card) => {
      deleteCard(card);
      refreshTable();
      if($('.card-for-search')[0].value != ""){
        $('.card-for-search')[0].value = "";
      }
      $('.delete-overlay').fadeOut();
    });
  };

 // MODAL WINDOW: ADD CARD

  $('.add-button')[0].onclick = function(){
    isAdd = true;
    $('.add-overlay').show();
  };

  $('.cancel-button')[0].onclick = function(){
    clearAddModalWindow();
    $('.add-overlay').fadeOut();
  };


  let noWarnings = true;

  function setWarning(inputField, textField, textWarning){
    noWarnings = false;
    inputField.css("border", "1px solid red");
    textField.innerHTML = textWarning;
    return inputField;
  }

  function setNoWarning(inputField, textField){
    inputField.css("border", "1px solid lightgrey");
    textField.innerHTML = "";
  }

  $('.save-changes-button')[0].onclick = function(){

    //VALIDATION
    let firstWrongfield = "";

    let nameValue = $('.name-input')[0].value;
    let strWithoutSpace = nameValue.replace(/\s/g, '');

    if(nameValue.length > 15){
      firstWrongfield = setWarning($('.name-input'), $('.name-warning')[0], "Name max length is 15 characters!");
    }else if(nameValue == ""){
      firstWrongfield = setWarning($('.name-input'), $('.name-warning')[0], "Name field cannot be empty!");
    }else if(strWithoutSpace == ""){
      firstWrongfield = setWarning($('.name-input'), $('.name-warning')[0], "Name cannot contain only space!");
    }else{
      setNoWarning($('.name-input'), $('.name-warning')[0]);
    }

    let emailValue = $('.email-input')[0].value;
    strWithoutSpace = emailValue.replace(/\s/g, '');

    if(emailValue == ""){
      let wrongField = setWarning($('.email-input'), $('.email-warning')[0], "Email field cannot be empty!");
      if(firstWrongfield.length == 0){
        firstWrongfield = wrongField;
      }
    }else if(emailValue.search(/[A-z0-9._%+-]+@[A-z0-9-]+\.[a-z]{2,4}/igm)){
      let wrongField = setWarning($('.email-input'), $('.email-warning')[0], "Email is not valid!");
      if(firstWrongfield.length == 0){
        firstWrongfield = wrongField;
      }
    }else{
      setNoWarning($('.email-input'), $('.email-warning')[0]);
    }

    let countValue = $('.count-input')[0].value;

    if(countValue == ""){
      let wrongField = setWarning($('.count-input'), $('.count-warning')[0], "Count field cannot be empty!");
      if(firstWrongfield.length == 0){
        firstWrongfield = wrongField;
      }
    }else if(countValue.search(/\D/) != -1){
      let wrongField = setWarning($('.count-input'), $('.count-warning')[0], "Count can contain only number!");
      if(firstWrongfield.length == 0){
        firstWrongfield = wrongField;
      }
    }else{
      setNoWarning($('.count-input'), $('.count-warning')[0]);
    }

    let priceValue = $('.price-input')[0].value;

    if(priceValue == ""){
      let wrongField = setWarning($('.price-input'), $('.price-warning')[0], "Price field cannot be empty!");
      if(firstWrongfield.length == 0){
        firstWrongfield = wrongField;
      }
    }else{
      setNoWarning($('.price-input'), $('.price-warning')[0]);
    }

    if(firstWrongfield){
      firstWrongfield[0].focus();
    }else{
      noWarnings = true;
    }


    if(noWarnings){
      let name = $('.name-input')[0].value;
      let count = $('.count-input')[0].value;
      let email = $('.email-input')[0].value;
      let price = +getPriceValue();
      saveDeliveryChoice();
      let delivery = newCardDelivery;

      if(isAdd){
        let card = new Card(name, email, count, price, delivery);
        addCard(card);
      }else{
        editableCard.name = name;
        editableCard.email = email;
        editableCard.count = count;
        editableCard.price = price;
        editableCard.delivery = delivery;
        refreshTable();
      }
      clearAddModalWindow();
      $('.add-overlay').fadeOut();
    }
  };

  $('.count-input')[0].oninput = function(){
    let countValue = $('.count-input')[0].value;
    if(countValue.search(/\D/) != -1){
      $('.count-input')[0].value = countValue.split(/\D/g).join("");
    }
  };


  $('.price-input')[0].oninput = function(){
    let priceValue = $('.price-input')[0].value;
    let wrongCharacterInd = priceValue.search(/[^0-9]/);
    if(wrongCharacterInd != -1){
      if(priceValue[wrongCharacterInd] == '.'){
        let part1 = priceValue.slice(0, wrongCharacterInd+1);
        let part2 = priceValue.slice(wrongCharacterInd+1).split(/\D/g).join("");
        $('.price-input')[0].value  = part1+part2;
      }else{
        $('.price-input')[0].value = priceValue.split(/\D/g).join("");;
      }
    }
  };

  $('.price-input')[0].onblur = function(){
    $('.price-input')[0].value = getUsaPriceValue($('.price-input')[0].value);
  };

  function getUsaPriceValue(priceValue){
    //let priceValue = $('.price-input')[0].value;
    priceValue = String(priceValue);
    if(priceValue[priceValue.length - 1] == '.'){
      priceValue += "0";
    }
    let usaPrice = "";
    let isPointWas = false;
    for(let i = priceValue.length - 1, j = 0; i >= 0; i--, j++){
      if(priceValue[i] == '.'){
        j = 0;
        isPointWas = true;
      }
      usaPrice += priceValue[i];
      if(j !=0 && j%3 == 0 && i != 0 && isPointWas){
        usaPrice += ",";
      }
    }
    usaPrice += '$';
    usaPrice = usaPrice.split("").reverse().join("");
    //$('.price-input')[0].value = usaPrice;
    return usaPrice;
  }

  $('.price-input')[0].onfocus = function(){
    $('.price-input')[0].value = getPriceValue();
  };

  function getPriceValue() {
    let priceValue = $('.price-input')[0].value;
    let usualPrice = "";
    let isPointWas = false;
    for(let i = 1; i < priceValue.length; i++){
      if(priceValue[i] != ','){
        usualPrice += priceValue[i];
      }
    }
    return usualPrice;
  }

  function clearAddModalWindow(){
    $('.name-input')[0].value = null;
    $('.count-input')[0].value = null;
    $('.email-input')[0].value = null;
    $('.price-input')[0].value = null;
    $('.checkbox').each(function(){
        this.checked = false;
    });
    $('.country-select')[0].options.selectedIndex = 0;
    findedCountry = "";
    newCardDelivery = [];
    fillCitiesCheckboxes();
  }
});
