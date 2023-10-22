import {reactive, watch} from "vue";
import {makeTile, makeWalls} from "../components/maze.js";

const competitions = reactive([]);

watch(competitions, (newValue, _) => {
    window.localStorage.setItem('competitions', JSON.stringify(competitions));
});

export function useCompetitions() {
    const storage = window.localStorage.getItem('competitions');
    if( storage !== null ) {
        Object.assign(competitions, JSON.parse(storage));
    }
    return competitions;
}

export function addCompetition(name) {
    competitions.push({
        'id': competitions.length,
        'name': name,
    });
}