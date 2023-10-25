<template>
  <div class="p-2">

    <!-- Menu buttons -->
    <div class="flex flex-row space-x-2">
      <button class="btn" @click="back">Back</button>
    </div>

    <div class="mt-2">Competition: <input type="text" v-model="name"></div>

    <div>Teams:</div>
    <div class="p-2 border-2 border-black flex flex-col">
      <div v-for="name in competition.teams" class="flex flex-row justify-between" :key="name">
        <div>{{ name }}</div>
        <div class="flex flex-row space-x-2 text-blue-600">
          <button @click="deleteTeam(name)">Delete</button>
        </div>
      </div>
      <button class="w-20" @click="createTeam">+ Create</button>
    </div>

    <div>Schedule:</div>
    <div class="p-2 border-2 border-black flex flex-col">
      <div v-for="schedule in competition.schedules" class="flex flec-row justify-between" :key="schedule.id">
        <div>{{ schedule.time }}</div>
        <div>{{ schedule.team }}</div>
        <div>{{ getParcourById(schedule.parcourId).name }}</div>
        <div class="flex flex-row space-x-2 text-blue-600">
          <button @click="viewSchedule(schedule.id)">View</button>
          <button @click="deleteSchedule(competition.id, schedule.id)">Delete</button>
        </div>
      </div>
      <button class="w-20" @click="openScheduleDialog">+ Create</button>
    </div>
  </div>

  <!-- Schedule creation dialog -->
  <div class="fixed top-0 left-0 w-full h-full bg-slate-500 bg-opacity-80 hidden" ref="scheduleDialog">
    <div class="p-4 m-[10%] border border-black rounded-lg bg-white">
      <div class="text-2xl">New schedule:</div>
      <div class="p-2">
        Team:
        <select v-model="newSchedule.team">
          <option v-for="name in competition.teams" :value="name">{{ name }}</option>
        </select>
      </div>
      <div class="p-2">
        Parcour:
        <select v-model="newSchedule.parcour">
          <option v-for="parcour in parcours" :value="parcour">{{ parcour.name }} ({{ parcour.category }})</option>
        </select>
      </div>
      <div class="p-2">
        Time:
        <input type="datetime-local" :value="newSchedule.datetime"
               @input="newSchedule.datetime = $event.target.value" >
      </div>
      <div class="mt-2 flex flex-row space-x-2">
        <button class="btn" @click="createSchedule">Save</button>
        <button class="btn" @click="closeScheduleDialog">Abort</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {useCompetitions, addSchedule, deleteSchedule} from "../stores/competitions.js";
import {useRouter} from "vue-router";
import {useParcours, getParcourById} from "../stores/Parcours.js";

const router = useRouter();
const props = defineProps(['id'])
const parcours = useParcours()
const competitions = useCompetitions()
const competition = competitions.find(c => c.id == props.id)

console.log(competition.schedules)

const name = ref(competition.name);
const newSchedule = reactive({
  'team': '',
  'parcour': null,
  'datetime': null,
})

const scheduleDialog = ref(null);

function dateToYYYYMMDD(d) {
  // alternative implementations in https://stackoverflow.com/q/23593052/1850609
  return d && new Date(d.getTime()-(d.getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
}
function back() {
  competition.name = name;
  router.push('/')
}

function createTeam() {
  const name = prompt("Team name:")
  if( name !== null ) {
    competition.teams.push(name)
  }
}

function deleteTeam(name) {
  const index = competition.teams.indexOf(name)
  competition.teams.splice(index, 1)
}

function createSchedule() {
  addSchedule(competition.id, newSchedule.team, newSchedule.parcour.id, newSchedule.datetime)
  closeScheduleDialog()
}

function openScheduleDialog() {
  newSchedule.team = ""
  newSchedule.parcour = null
  newSchedule.datetime = null
  scheduleDialog.value.classList.toggle("hidden")
}

function closeScheduleDialog() {
  scheduleDialog.value.classList.toggle("hidden")
}

function viewSchedule(id) {

}

</script>