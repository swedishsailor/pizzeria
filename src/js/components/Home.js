import { templates, select } from './settings.js';

class Home{
    constructor(wrapper){
        const thisHome = this;

        thisHome.render(wrapper);

    }

    render(wrapper){
        const thisHome = this;
        const generatedHTML = templates.homeWidget();
        console.log(generatedHTML);
        console.log(wrapper);
        thisHome.dom = {};
        thisHome.dom.wrapper = document.querySelector(select.containerOf.home);
        thisHome.dom.wrapper.innerHTML = generatedHTML;
    }
} 
export default Home;