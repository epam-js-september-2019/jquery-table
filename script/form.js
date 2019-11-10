$(function () {
    const regEmail = /[a-zA-Z0-9_\.]+@[a-zA-Z]+\.[a-z]+/;
    const reNumbers = /[0-9]+/;
    let isCorrect;
    let priceInput = $('#price');

    let warningShow = (element, message) => {
        element.css('box-shadow', '0 0 5px red');
        message.show();
    };

    let warningHide = (element, message) => {
        element.css('box-shadow', 'none');
        message.hide();
    };

    let formValuesCheck = (name, email, count, price) => {
        isCorrect = true;
        if( name.val().length < 5 ||
            name.val().length > 15 ||
            name.val().trim().length === 0 ||
            name.val().length === 0) {
            warningShow(name, $('p.warning-message--name'));
            isCorrect = false;
        } else {
            warningHide(name, $('p.warning-message--name'));
        }

        if(!regEmail.test(email.val())) {
            warningShow(email, $('p.warning-message--email'));
            isCorrect = false;
        } else {
            warningHide(email, $('p.warning-message--email'));
        }

        if(!reNumbers.test(count.val())) {
            warningShow(count, $('p.warning-message--count'));
            isCorrect = false;
        } else {
            warningHide(count, $('p.warning-message--count'));
        }

        if(price.val() === '' ||
            price.val()[0] === '0' ||
            price.val().length > 21) {
            warningShow(price, $('p.warning-message--price'));
            isCorrect = false;
        } else {
            warningHide(price, $('p.warning-message--price'));
        }
        return isCorrect;
    };

    let numbersInputCheck = (element) => {
        element.bind("change keyup input click", function() {
            if (this.value.match(/[^0-9]/g)) {
                this.value = this.value.replace(/[^0-9]/g, '');
            }
        });
    };

    let priceInputCheck = (element) => {
        element.bind("change keyup input click", function() {
            if (this.value.match(/[^0-9]/g)) {
                this.value = this.value.replace(/[^0-9$,\.]/g, '');
            }
        });
    };

    priceInput.on('keyup', function () {
        this.value = this.value.replace('.','');
        if(this.value.length > 2) {
            this.value = this.value.substring(0, this.value.length - 2) + '.' + this.value.substring(this.value.length - 2, this.value.length);
        }
    });

    priceInput.on('blur', function () {
        if(this.value.length > 2) {
            this.value = '$' + this.value.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    priceInput.on('focus', function () {
        this.value = this.value.replace('$','').replace(',','');
    });


    window.form = {
        formValuesCheck,
        priceInputCheck,
        numbersInputCheck
    }
});