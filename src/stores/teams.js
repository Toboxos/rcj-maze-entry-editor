import {reactive} from "vue";
import {API} from "../api.js";

const teams = reactive([]);

async function fetchTeams(competition) {
    const result = await API.axios.get('http://localhost:5001/competition/' + competition.id + "/teams")
    return result.data
}

export function useTeams(competition) {
    fetchTeams(competition).then(data => Object.assign(teams, data))
    return teams;
}

export async function addTeam(competition, name) {
    await API.axios.post('http://localhost:5001/competition/' + competition.id + "/team", {
        "name": name
    })
    fetchTeams(competition).then(data => Object.assign(teams, data))
}

export async function deleteTeam(team) {
    await API.axios.delete('http://localhost:5001/competition/' + team.competition + "/team/" + team.id)

    const index = teams.indexOf(team)
    teams.splice(index, 1)
}