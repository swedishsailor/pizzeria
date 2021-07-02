import { templates, select } from './settings.js';
//import  {Flickity}  from '../../vendor/flickity.pkgd.js';

class Home{
    constructor(wrapper){
        const thisHome = this;

        thisHome.render(wrapper);
        thisHome.initWidgets();
    }

    render(wrapper){
        const thisHome = this;
        const generatedHTML = templates.homeWidget();
        console.log(generatedHTML);
        console.log(wrapper);
        thisHome.dom = {};
        thisHome.dom.wrapper = document.querySelector(select.containerOf.home);
        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.carousel = document.querySelector('.main-carousel');
        thisHome.dom.imagesDiv = document.querySelector('.images');
        thisHome.dom.bookingHref = document.querySelector('.bookinghref');
        thisHome.dom.orderHref = document.querySelector('.orderhref');
    }

    initWidgets(){
        const thisHome = this;

        thisHome.dom.imagesDiv.addEventListener('click', function(e){
            e.preventDefault();
            if(e.target.classList.contains('fas')){
            e.target.classList.toggle('like');
            e.target.classList.toggle('heart');
            //console.log('??');
            }
        });

        thisHome.carousel = new Flickity(thisHome.dom.carousel, {
            cellAlign: 'left',
            contain: true,
            autoPlay: 3000
        });
    }
} 
export default Home;