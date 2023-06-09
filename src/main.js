import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faCaretUp,
    faCaretDown,
    faCaretLeft,
    faCaretRight,
    faGear,
    faPlus,
    faMinus,
    faFlagCheckered, faCheck, faXmark, faArrowDownUpAcrossLine
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faCaretLeft, faCaretRight, faCaretDown, faCaretUp, faGear, faPlus, faMinus, faFlagCheckered, faCheck, faXmark, faArrowDownUpAcrossLine);


const app = createApp(App);
app.config.globalProperties.window = window;
app .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
