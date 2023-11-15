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

export async function addSchedule(competition, schedule) {
    await API.axios.post('http://localhost:5001/competition/' + competition.id + "/schedule", schedule)
    fetchSchedules(competition).then(data => Object.assign(schedules, data))
}

export async function deleteSchedule(schedule) {
    await API.axios.delete('http://localhost:5001/competition/' + schedule.competition + "/schedule/" + schedule.id)

    const index = schedules.indexOf(schedule)
    schedules.splice(index, 1)
}