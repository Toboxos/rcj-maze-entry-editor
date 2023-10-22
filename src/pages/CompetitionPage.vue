<template>
  <div class="p-2">

    <!-- Menu buttons -->
    <div class="flex flex-row space-x-2">
      <button class="btn" @click="save">Save</button>
      <button class="btn" @click="abort">Abort</button>
    </div>

    <div class="mt-2">Competition: <input type="text" v-model="name"></div>

    <div>Teams:</div>
    <div class="p-2 border-2 border-black flex flex-col">
    </div>

    <div>Schedule:</div>
    <div class="p-2 border-2 border-black flex flex-col">
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

function save() {
  competition.name = name;
  router.push('/')
}

function abort() {
  router.push('/')
}
</script>