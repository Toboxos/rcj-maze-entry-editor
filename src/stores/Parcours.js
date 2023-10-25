import {reactive, watch} from "vue";
import {makeTile, makeWalls} from "../components/maze.js";

const parcours = reactive([]);

function createEmptyMaze() {
    return [
        [makeTile(0, 0, makeWalls(true, true, true, true), true)]
    ]
}

watch(parcours, (newValue, _) => {
    window.localStorage.setItem('parcours', JSON.stringify(parcours));
});

export function useParcours() {
    const storage = window.localStorage.getItem('parcours');
    if( storage !== null ) {
        Object.assign(parcours, JSON.parse(storage));
    }
    return parcours;
}

export function addParcour(name) {
    parcours.push({
        'id': parcours.length,
        'name': name,
        'category': "",
        'maze': createEmptyMaze(),
    });
}

export function getParcourById(id) {
    return parcours.find(e => e.id === id)
}