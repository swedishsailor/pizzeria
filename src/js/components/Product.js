import { select, templates, classNames, settings } from './settings.js';
import { utils } from './utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
    constructor(id, data) {
        const thisProduct = this;
        thisProduct.id = id;
        thisProduct.data = data;
        thisProduct.renderInMenu();
        thisProduct.getElements();
        thisProduct.initAccordion();
        thisProduct.initOrderForm();
        thisProduct.initAmoutWidget();
        thisProduct.processOrder();

    }

    renderInMenu() {
        const thisProduct = this;

        /* Generate HTML based on template */
        const generatedHTML = templates.menuProduct(thisProduct.data);

        /* Create element using utils.createElementFromHTML */
        thisProduct.element = utils.createDOMFromHTML(generatedHTML);

        /* Find menu container */
        const menuContainer = document.querySelector(select.containerOf.menu);

        /* Add element to menu */
        menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
        const thisProduct = this;

        thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
        thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
        thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
        thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
        thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
        thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
        thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
        const thisProduct = this;

        /*find clickable trigger */

        /*START: add event listener to clickable trigger on event click*/
        thisProduct.accordionTrigger.addEventListener('click', function (event) {

            /* prevent default action for event */
            event.preventDefault();

            /* find active product (product that has active class */
            //const activeProduct = document.querySelector(classNames.menuProduct.wrapperActive);
            const activeProduct = document.querySelector(select.all.menuProductsActive);


            /* if there is active product and its not thisProduct.element, remove class active from it */
            if (activeProduct != null && activeProduct != thisProduct.element) {
                activeProduct.classList.remove('active');

            }

            /* toggle active class on thisProduct.element */
            //for (let element in thisProduct.element){
            thisProduct.element.classList.toggle('active');
            // }

        });
    }

    initOrderForm() {
        const thisProduct = this;

        thisProduct.form.addEventListener('submit', function (event) {
            event.preventDefault();
            thisProduct.processOrder();
        });

        for (let input of thisProduct.formInputs) {
            input.addEventListener('change', function () {
                thisProduct.processOrder();
            });
        }

        thisProduct.cartButton.addEventListener('click', function (event) {
            event.preventDefault();
            thisProduct.processOrder();
            thisProduct.addToCart();
        });


    }

    processOrder() {
        const thisProduct = this;


        const formData = utils.serializeFormToObject(thisProduct.form);


        // set price to default price
        let price = thisProduct.data.price;

        // for every category (param)...
        for (let paramId in thisProduct.data.params) {
            // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
            const param = thisProduct.data.params[paramId];


            // for every option in this category
            for (let optionId in param.options) {
                // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
                const option = param.options[optionId];
                const optionPrice = option.price,
                    optionSelected = formData[paramId] && formData[paramId].includes(optionId);
                let optionImage = thisProduct.imageWrapper.querySelector('.toppings' + '-' + optionId);



                if (optionSelected) {
                    if (!option.default) {
                        price += optionPrice;
                        if (optionImage) {
                            optionImage.classList.add(classNames.menuProduct.imageVisible);
                        }
                    }
                    if (option.default && optionImage) {
                        optionImage.classList.add(classNames.menuProduct.imageVisible);
                    }
                } else {

                    if (option.default) {
                        price -= optionPrice;
                        if (optionImage) {
                            optionImage.classList.remove(classNames.menuProduct.imageVisible);
                        }
                    }

                    if (!option.default && optionImage) {
                        optionImage.classList.remove(classNames.menuProduct.imageVisible);
                    }
                }
            }
        }

        // update calculated price in the HTML
        thisProduct.priceSingle = price;
        price *= settings.amountWidget.defaultValue;
        thisProduct.priceFull = price;
        thisProduct.priceElem.innerHTML = price;
    }

    initAmoutWidget() {
        const thisProduct = this;

        thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
        thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder());
    }

    addToCart() {
        const thisProduct = this;

        //app.cart.add(thisProduct.prepareCartProduct());

        const event = new CustomEvent('add-to-cart', {
            bubbles: true,
            detail: {
                product: thisProduct,
            },
        });

        thisProduct.element.dispatchEvent(event);
    }

    prepareCartProduct() {
        const thisProduct = this;

        const productSummary = { id: thisProduct.id, name: thisProduct.data.name, amount: settings.amountWidget.defaultValue, priceSingle: thisProduct.priceSingle, price: thisProduct.priceFull, params: thisProduct.prepareCartProductParams() };
        return productSummary;
    }

    prepareCartProductParams() {
        const thisProduct = this;

        // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
        const formData = utils.serializeFormToObject(thisProduct.form);

        const params = {};

        // for every category (param)...
        for (let paramId in thisProduct.data.params) {

            // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
            const param = thisProduct.data.params[paramId];

            params[paramId] = {
                name: param.label,
                options: {}
            };

            // for every option in this category
            for (let optionId in param.options) {

                // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
                const option = param.options[optionId];

                // check if formData contains optionId
                const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

                if (optionSelected) {

                    params[paramId].options[optionId] = option.label;
                }

            }

        }

        return params;

    }
}

export default Product;