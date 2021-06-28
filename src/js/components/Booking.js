import { templates, select } from './settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
    constructor(wrapper){
        const thisBooking = this;
       // thisBooking.widgetContainer = wrapper;
        thisBooking.render(wrapper);
        thisBooking.initWidgets();
       
    }

    render(wrapper) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = wrapper;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        //console.log(thisBooking.dom.wrapper, 'HTML:', generatedHTML);
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

        
        

    }

    initWidgets(){
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.peopleAmount.addEventListener('click', function(){
            console.log('pplAMount');
        });

        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.hoursAmount.addEventListener('click', function(){
            console.log('hourAmount');
        });

        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.dom.datePicker.addEventListener('click', function(){
            console.log('datepicker');
        });

        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.dom.hourPicker.addEventListener('click',function(){
            console.log('hourpicker');
        });
    }
}

export default Booking;