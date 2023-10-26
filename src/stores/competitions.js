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