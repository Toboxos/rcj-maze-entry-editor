import {reactive, watch} from "vue";
import {makeTile, makeWalls} from "../components/maze.js";
import {API} from "../api.js";

const competitions = reactive([]);

watch(competitions, (newValue, _) => {
    window.localStorage.setItem('competitions', JSON.stringify(competitions));
});

async function fetchCompetitions() {
    const result = await API.axios.get('/competitions')
    return result.data
}

export function useCompetitions() {
    fetchCompetitions().then(data => Object.assign(competitions, data))
    return competitions;
}

export async function addCompetition(name) {
    await API.axios.post("competition",{
        "name": name,
    })

    await fetchCompetitions().then(data => Object.assign(competitions, data))
}

export async function deleteCompetition(competition) {
    await API.axios.delete("competition/" + competition.id)

    const index = competitions.indexOf(competition);
    competitions.splice(index, 1);
}

export function getScheduleById(competitionId, scheduleId) {
    console.log(competitions)
    const competition = competitions.find((e) => e.id === competitionId )
    if( competition === undefined ) {
        console.error("Competition " + competitionId + " not found!")
        return null
    }

    return competition.schedules.find(e => e.id === scheduleId)
}

export function addSchedule(competitionId, team, parcourId, time) {
    console.log("time =", time)
    const competition = competitions.find((e) => e.id === competitionId )
    if( competition === null ) {
        console.error("Competition ${competitionId} not found!")
        return
    }

    const schedules = competition.schedules;
    schedules.push({
        'id': schedules.length,
        'team': team,
        'parcourId': parcourId,
        'time': time,
        'actions': []
    })
}

export function deleteSchedule(competitionId, scheduleId) {
    const competition = competitions.find((e) => e.id === competitionId )
    if( competition === null ) {
        console.error("Competition ${competitionId} not found!")
        return
    }

    const index = competition.schedules.indexOf(scheduleId)
    competition.schedules.splice(index, 1)
}