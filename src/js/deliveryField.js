import compileTemplate from "lodash.template";

export class DeliveryField {
  constructor({ countries, cities, initialData, change }) {
    this.countries = countries;
    this.cities = cities;
    this.selectedCountry = this.countries[0].key;
    this.selectedCities = initialData || [];
    this.renderTemplate = compileTemplate($("#delivery-template").html());
    this.handlers = { change };
  }
  renderTo(root) {
    this.root = root;
    this.render();
  }
  render() {
    const html = this.renderTemplate({
      cities: this.getCities(),
      countries: this.getCountries(),
      selectedCountry: this.selectedCountry,
      selectedCities: this.selectedCities,
      isSelectedAll: this.isSelectedAll()
    });
    this.root.html(html);
    this.checkboxes = this.root.find("input.js-city").get();
    this.renderCheckboxes();
    this.renderSelectAllCheckbox();
    this.bindEvents();
    this.handlers.change(this.selectedCities);
  }
  renderCheckboxes() {
    this.checkboxes.forEach(item => {
      const checked = this.selectedCities.includes(item.value);
      $(item).attr("checked", checked ? "checked" : null);
    });
  }
  renderSelectAllCheckbox() {
    this.root
      .find(".js-selectall")
      .attr("checked", this.isSelectedAll() ? "checked" : null);
  }
  bindEvents() {
    this.root
      .find(".js-selectall")
      .change(this.handleToggleSelectAll.bind(this));
    this.root.find("input.js-city").change(this.handleToggleCity.bind(this));
    this.root
      .find("select[name=country]")
      .change(this.handleCountryChange.bind(this));
  }
  getValue() {
    return this.selectedCities;
  }
  getCountries() {
    return this.countries.map(c => ({
      ...c,
      isSelected: c.key === this.selectedCountry
    }));
  }
  getCities() {
    return this.cities.filter(city => city.country === this.selectedCountry);
  }
  handleCountryChange(e) {
    this.selectedCountry = e.target.value;
    this.render();
  }
  handleToggleSelectAll(e) {
    if (e.target.checked) {
      this.selectedCities = [
        ...this.selectedCities,
        ...this.getCities().map(city => city.key)
      ];
    } else {
      this.selectedCities = this.selectedCities.filter(
        city =>
          this.cities.find(item => item.key === city).country !==
          this.selectedCountry
      );
    }
    this.render();
  }
  handleToggleCity(e) {
    if (e.target.checked) {
      this.selectedCities.push(e.target.value);
    } else {
      this.selectedCities = this.selectedCities.filter(
        city => city != e.target.value
      );
    }
    this.render();
  }
  isSelectedAll() {
    const allCitiesOfCountry = this.cities.filter(
      city => city.country === this.selectedCountry
    );
    return allCitiesOfCountry.every(city =>
      this.selectedCities.includes(city.key)
    );
  }
}
