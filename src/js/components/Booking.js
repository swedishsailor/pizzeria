import { templates, select, settings, classNames } from './settings.js';
import {utils} from './utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking{
    constructor(wrapper){
        const thisBooking = this;
       

       // thisBooking.widgetContainer = wrapper;
        thisBooking.render(wrapper);
        thisBooking.initWidgets();
       thisBooking.getData();
       thisBooking.selectedTable = 0;

       console.log(thisBooking.selectedTable);
       console.log('thisBooking.datePicker',thisBooking.datePicker.value);

    }

    sendBooking(){
        const thisBooking = this;
        const url = settings.db.url + '/' + settings.db.booking;
    
        let payload = {
         date:thisBooking.datePicker.value,
         hour:thisBooking.hourPicker.value,
         table: thisBooking.selectedTable,
         duration:thisBooking.hoursAmount.value,
         ppl:thisBooking.peopleAmount.value,
         starters:[],
        phone:thisBooking.dom.phone.value,
        address:thisBooking.dom.address.value
        };
       // console.log(thisBooking.chosenStarters());
        let starter = thisBooking.chosenStarters();
        console.log(starter);

        payload.starters.push(starter);
        
        /*for(let prod of thisBooking.starters) {
          payload.starters.push(prod);
        }*/
        
    
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        };
        fetch(url, options);
        console.log(payload);
      }

      chosenStarters(){
          const thisBooking = this;

          for (let nr of thisBooking.dom.starters){
           /* if (!nr.classList.contains('checked')){
                nr.value =[];
             }*/
              if(nr.classList.contains('checked')){
                  console.log(nr.value);
                 // if (nr.value == undefined)
                 
                  return nr.value;
                 }
                
              //return nr.value;
          }
      }
    

    getData(){
        const thisBooking = this;

        const startDateParam =  settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam =     settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);


        const params = {
            booking:[
               startDateParam,
                endDateParam

            ],
            eventsCurrent:[
                settings.db.notRepeatParam,
               startDateParam,
                endDateParam

            ],
            eventsRepeat:[
                settings.db.repeatParam,
                endDateParam

            ],
        };

        const urls = {
            booking:      settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
            eventsCurrent:settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&') ,
            eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&') ,
        };

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])

        .then(function(allResponses){
            const bookingsResponse = allResponses[0];
            const eventsCurrentResponse = allResponses[1];
            const eventsRepeatResponse = allResponses[2];
            return Promise.all([
            bookingsResponse.json(),
            eventsCurrentResponse.json(),
            eventsRepeatResponse.json(),
            ]);
        })
        .then(function([bookings, eventsCurrent, eventsRepeat]){
            //console.log(bookings);
            //console.log(eventsCurrent);
            //console.log(eventsRepeat);
            thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
        });
    }

    parseData(bookings, eventsCurrent, eventsRepeat){
        const thisBooking = this;

        thisBooking.booked = {};

        for (let item of eventsCurrent){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for (let item of bookings){
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for (let item of eventsRepeat){
            if (item.repeat == 'daily'){
                for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
            thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }

        console.log(thisBooking.booked, 'this booking booked');

        thisBooking.updateDOM();
        
    }

    makeBooked(date, hour, duration, table){
        const thisBooking = this;

        if (typeof thisBooking.booked[date] == 'undefined'){
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
            //console.log('loop', hourBlock);

            if (typeof thisBooking.booked[date][hourBlock] == 'undefined'){
                thisBooking.booked[date][hourBlock] = [];
            }
    
            thisBooking.booked[date][hourBlock].push(table);

        }
    }

    updateDOM(){
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if(
            typeof thisBooking.bookingWidget[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ){
            allAvailable = true;
        }

        for (let table of thisBooking.dom.tables){
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if (!isNaN(tableId)){
                tableId = parseInt(tableId);
            }

            if(
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ){
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }

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
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.tablesDiv = thisBooking.dom.wrapper.querySelector('.floor-plan');
        thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector('.orderPhone');
        thisBooking.dom.address = thisBooking.dom.wrapper.querySelector('.orderAddress');
        thisBooking.dom.startersDiv = thisBooking.dom.wrapper.querySelector('.starters-div');
        thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll('.starter-checkbox');
        thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector('.order-submit');

    }

    initTables(e){
        const thisBooking = this;
        if (e.target && e.target.classList.contains('table')){
          //  console.log('xd');
            if(e.target.classList.contains('booked')){
           //     console.log('zajety');
            }else if (e.target.classList.contains('selected')){
                e.target.classList.remove('selected');
            }else{
                /* HAVE TO PRZYPISAC NUMER STOLIKA DO WLASCIWOSCI */
              //  selectedTable = e.target;
              thisBooking.removeSelectFromOtherTables();
                e.target.classList.add('selected');
                thisBooking.selectedTable = e.target.getAttribute('data-table');
            }
        }
    }

    removeSelectFromOtherTables(){
        const thisBooking =this;
        thisBooking.tables = document.querySelectorAll('.table');
       // console.log(thisBooking.tables);
        for (let id of thisBooking.tables){
             //   console.log(id);
                id.classList.remove('selected');
                thisBooking.selectedTable = 0;
        }
        
    }


    initWidgets(){
        const thisBooking = this;
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
       /* thisBooking.dom.peopleAmount.addEventListener('click', function(){
            console.log('pplAMount');
        });*/

        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        /*thisBooking.dom.hoursAmount.addEventListener('click', function(){
            console.log('hourAmount');
        });*/

        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        /*thisBooking.dom.datePicker.addEventListener('click', function(){
            console.log('datepicker');
        });*/
        
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
       /* thisBooking.dom.hourPicker.addEventListener('input',function(){
            console.log('hourpicker');
        });*/

        console.log( thisBooking.peopleAmount.value);

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            thisBooking.removeSelectFromOtherTables();
            thisBooking.updateDOM();
            
        });

        thisBooking.dom.tablesDiv.addEventListener('click', function(e){
          //  console.log('klik');
            thisBooking.initTables(e);
        });

        thisBooking.dom.submit.addEventListener('click', function(e){
            e.preventDefault();
            thisBooking.sendBooking();
        });

        thisBooking.dom.startersDiv.addEventListener('click', function(e){
            e.target.classList.toggle('checked');
            //thisBooking.chosenStarters();
        });
    }
}

export default Booking;