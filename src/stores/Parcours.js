import {reactive, watch} from "vue";
import {API} from "../api.js";
import {makeTile, makeWalls} from "../components/maze.js";

const parcours = reactive([]);

function createEmptyMaze() {
    return [
        [makeTile(0, 0, makeWalls(true, true, true, true), true)]
    ]
}

async function fetchParcours() {
    const result = await API.axios.get('http://localhost:5001/parcours')
    const data = result.data.map(e => {
        if( e.maze === null ) {
            e.maze = createEmptyMaze()
        } else {
            e.maze = JSON.parse(e.maze)
        }

        return e
    })

    return data
}

watch(parcours, (newValue, _) => {
    window.localStorage.setItem('parcours', JSON.stringify(parcours));
});

export function useParcours() {
    fetchParcours().then(data => Object.assign(parcours, data))
    return parcours;
}

export async function addParcour(name) {
    // await API.axios.post("http://localhost:5001/parcours", JSON.stringify({
    //     "name": name,
    //     "category": ""
    // }), {"headers": {"Content-Type": "application/json"}})

    await API.axios.post("http://localhost:5001/parcours",{
        "name": name,
        "category": ""
    })

    await fetchParcours().then(data => Object.assign(parcours, data))
}

export function saveParcour(parcour) {
    API.axios.put("http://localhost:5001/parcour/" + parcour.id, {
        "name": parcour.name,
        "category": parcour.category,
        "maze": JSON.stringify(parcour.maze)
    })
}

export function deleteParcour(parcour) {
    API.axios.delete("http://localhost:5001/parcour/" + parcour.id)

    const index = parcours.indexOf(parcour);
    parcours.splice(index, 1);
}

export function getParcourById(id) {
    return parcours.find(e => e.id === id)
}