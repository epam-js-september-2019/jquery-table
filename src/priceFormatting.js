const priceFormat = (num) => Math.abs(num).toLocaleString('en-EN', {
  style: 'currency',
  currency: 'USD'
});

const priceUnformat = (str) => +str.replace(/,|\$/g, '');
