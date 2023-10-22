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
      <button class="w-20" @click="createSchedule">+ Create</button>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useCompetitions} from "../stores/competitions.js";
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps(['id'])
const competitions = useCompetitions()
const competition = competitions.find(c => c.id == props.id)

const name = ref(competition.name);

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

</script>