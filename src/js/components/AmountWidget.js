import { settings, select } from './settings.js';

class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions(settings.amountWidget.defaultValue);


    }

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      /* To Do, add validation */

      if (settings.amountWidget.defaultValue !== newValue && !isNaN(newValue) && !(newValue < settings.amountWidget.defaultMin) && !(newValue > settings.amountWidget.defaultMax)) {
        settings.amountWidget.defaultValue = newValue;
        thisWidget.announce(settings.amountWidget.defaultValue);
      }
      thisWidget.input.value = settings.amountWidget.defaultValue;

    }

    initActions() {
      const thisWidget = this;


      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(settings.amountWidget.defaultValue - 1);
        thisWidget.announce(settings.amountWidget.defaultValue);
      });
      thisWidget.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(settings.amountWidget.defaultValue + 1);
      });

    }

    announce() {
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);

    }
  }

  export default AmountWidget;