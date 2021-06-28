import { templates, select } from './settings.js';
import AmountWidget from './AmountWidget.js';

class Booking{
    constructor(element){
        const thisBooking = this;
        thisBooking.widgetContainer = element;
        thisBooking.render(element);
        thisBooking.initWidgets();
       
    }

    render(element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        console.log(thisBooking.dom.wrapper, 'HTML:', generatedHTML);
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

        thisBooking.dom.wrapper.innerHTML = generatedHTML;

    }

    initWidgets(){
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget (thisBooking.dom.peopleAmount);
        thisBooking.dom.peopleAmount.addEventListener('click', function(){});

        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.hoursAmount.addEventListener('click', function(){});

        
    }
}

export default Booking;