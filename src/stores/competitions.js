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
        'teams': [],
        'schedules': [],
    });
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
        'time': time
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