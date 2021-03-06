import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';


const app = {

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;
    for (let page of thisApp.pages){
      if (page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      } 
    }
    
    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;

        event.preventDefault();

        /* get id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class "activate" to matching page, remove from non-matching */
    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class "activate" to matching links, remove from non-matching */
    for (let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId);
    }
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initBooking: function(){
    const widgetContainer = document.querySelector(select.containerOf.booking);
  

    new Booking(widgetContainer);


  },

  initHome: function(){
    const thisApp = this;
    const widgetContainer2 = document.querySelector(select.containerOf.home);

    new Home(widgetContainer2);

    //const homeButton = document.querySelector('.bookinghref');


   // console.log(widgetContainer2);

   document.querySelector('.bookinghref').addEventListener('click', function(){
     
   thisApp.activatePage();
   thisApp.initPages();
});

document.querySelector('.orderhref').addEventListener('click', function(){

 thisApp.activatePage();
 thisApp.initPages();
});

  },

  initData: function () {
    const thisApp = this;
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
       // console.log('parsedResponse', parsedResponse);

        // Save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;

        //Execute inintMenu method 
        thisApp.initMenu();
      });

    //console.log('thisApp.data', JSON.stringify(thisApp.data));

    thisApp.data = {};
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initBooking();
    thisApp.initHome();
  },
};

app.init();


