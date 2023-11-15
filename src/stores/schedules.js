import {reactive} from "vue";
import {API} from "../api.js";

const schedules = reactive([]);

async function fetchSchedules(competition) {
    const result = await API.axios.get('http://localhost:5001/competition/' + competition.id + "/schedules")
    return result.data
}

export function useSchedules(competition) {
    fetchSchedules(competition).then(data => Object.assign(schedules, data))
    return schedules;
}