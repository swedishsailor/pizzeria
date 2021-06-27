
import { select } from './settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct {
    constructor(menuProduct, element) {
        const thisCartProduct = this;
        thisCartProduct.id = menuProduct.id;
        thisCartProduct.name = menuProduct.name;
        thisCartProduct.amount = menuProduct.amount;
        thisCartProduct.priceSingle = menuProduct.priceSingle;
        thisCartProduct.price = menuProduct.price;
        thisCartProduct.params = menuProduct.params;

        thisCartProduct.getElements(element);
        thisCartProduct.initAmoutWidget();
        thisCartProduct.initActions();

    }

    getElements(element) {
        const thisCartProduct = this;
        thisCartProduct.dom = {};
        thisCartProduct.dom.wrapper = element;

        thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
        thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
        thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
        thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

    }

    initAmoutWidget() {
        const thisCartProduct = this;

        thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
        thisCartProduct.dom.amountWidget.addEventListener('click', function () {

            thisCartProduct.dom.amountWidget = thisCartProduct.amountWidget;
            console.log(thisCartProduct.dom.amountWidget.input.value, thisCartProduct.priceSingle);
            thisCartProduct.dom.price.innerHTML = thisCartProduct.priceSingle * thisCartProduct.dom.amountWidget.input.value;

            //thisCartProduct.dom.totalPrice = thisCartProduct.price;


        });
    }

    getData() {
        const thisCartProduct = this;

        const payloadData = { id: thisCartProduct.id, amount: thisCartProduct.amount, price: thisCartProduct.price, priceSingle: thisCartProduct.priceSingle, name: thisCartProduct.name, params: thisCartProduct.params };
        console.log('payload Data: ', payloadData);
        return payloadData;
    }

    remove() {
        const thisCartProduct = this;

        const event = new CustomEvent('remove', {
            bubbles: true,
            detail: {
                cartProduct: thisCartProduct,
            },
        });

        thisCartProduct.dom.wrapper.dispatchEvent(event);
        console.log('remove() jest wywolana');
    }

    initActions() {
        const thisCartProduct = this;

        thisCartProduct.dom.edit.addEventListener('click', function (event) {
            event.preventDefault();
        });
        thisCartProduct.dom.remove.addEventListener('click', function (event) {
            event.preventDefault();
            thisCartProduct.remove();
        });
    }
}

export default CartProduct;