import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import './style.css'
import App from './App.vue'
import StartPage from "./pages/StartPage.vue";
import EditPage from "./pages/EditPage.vue";
import CompetitionPage from "./pages/CompetitionPage.vue";


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

/** ROUTER **/
const router = createRouter({
   history: createWebHashHistory(),
    routes: [
        { path: '/', component: StartPage },
        { path: '/editor/:parcourId', component: EditPage, props: true },
        { path: '/competition/:id', component: CompetitionPage, props: true },
    ]
})

const app = createApp(App);
app.config.globalProperties.window = window;
app
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app');
