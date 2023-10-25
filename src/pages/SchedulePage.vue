<template>
  <!-- Menu buttons -->
  <div class="p-2">
    <div class="flex flex-row space-x-2">
      <button class="btn" @click="back">Back</button>
    </div>

    <div class="mt-4">
      <MazeField :maze="parcour.maze" :editable="false" @tileClicked="tileClicked"></MazeField>
    </div>
  </div>
</template>

<script setup>
import {getScheduleById, useCompetitions} from "../stores/competitions.js";
import {getParcourById, useParcours} from "../stores/Parcours.js";
import MazeField from "../components/MazeField.vue";
import {useRouter} from "vue-router";

useCompetitions() // make sure that they are initialized
useParcours() // make sure that they are initialized

const router = useRouter()
const props = defineProps(['competitionId', 'scheduleId'])
const schedule = getScheduleById(parseInt(props.competitionId), parseInt(props.scheduleId))
const parcour = getParcourById(schedule.parcourId)

function back() {
  router.back()
}

function tileClicked(x, y) {
  console.log(x, y)
}
</script>