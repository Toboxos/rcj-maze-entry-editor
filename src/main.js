import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import {API} from "./api.js";
import './style.css'
import App from './App.vue'
import StartPage from "./pages/StartPage.vue";
import EditPage from "./pages/EditPage.vue";
import CompetitionPage from "./pages/CompetitionPage.vue";
import SchedulePage from "./pages/SchedulePage.vue";
import LoginPage from "./pages/LoginPage.vue";

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
import ScoreboardPage from "./pages/ScoreboardPage.vue";

/* add icons to the library */
library.add(faCaretLeft, faCaretRight, faCaretDown, faCaretUp, faGear, faPlus, faMinus, faFlagCheckered, faCheck, faXmark, faArrowDownUpAcrossLine);

/** ROUTER **/
const router = createRouter({
   history: createWebHashHistory(),
    routes: [
        { path: '/', component: StartPage },
        { path: '/login', component: LoginPage},
        { path: '/scoreboard', component: ScoreboardPage },
        { path: '/editor/:parcourId', component: EditPage, props: true },
        { path: '/competition/:id', component: CompetitionPage, props: true },
        { path: '/competition/:competitionId/schedule/:scheduleId', component: SchedulePage, props: true }
    ]
})

router.beforeEach(async (to) => {
    console.log("beforeEach for " + to.path )
    const publicPages = ['/login', '/scoreboard']
    const authRequired = !publicPages.includes(to.path)

    if( !authRequired ) {
        console.log("no auth required")
        return
    }

    function check() {
        return new Promise( (resolve, reject) => {
            API.axios.get("authorized")
                .then(res => resolve(res.status === 200))
                .catch(err => resolve(false))
        })
    }

    const authorized = await check()
    console.log(authorized)

    if( authRequired && !authorized ) {
        return '/login'
    }
})

const app = createApp(App);
app.config.globalProperties.window = window;
app
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app');
