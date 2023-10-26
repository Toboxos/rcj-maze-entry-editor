<template>
  <!-- Menu buttons -->
  <div class="p-2">
    <div class="flex flex-row space-x-2">
      <button class="btn" @click="back">Back</button>
    </div>

    <!-- Playmode stats -->
    <div>
      <div>TeamName: {{ schedule.team }}</div>

      <div>Stats:</div>
      <div class="p-2 border-2 border-black">
        <div>Time: {{ scoring.timeFormatted }}</div>
        <div>Checkpoints (Bonus): {{ scoring.values.numCheckpointsReached }} ({{ scoring.values.numCheckpointsBonus }})</div>
        <div>Bumpers passed: {{ scoring.values.numBumpersPassed }}</div>
        <div>Victims detected / Rescue kits deployed: {{ scoring.values.numVicitimsDetected }} / {{ scoring.values.numRescueKitsDeployed }}</div>
        <div>Lack of progress: {{ scoring.values.numLackOfProgress }}</div>
        <div>Ramp up / Ramp down: {{ scoring.values.numRampUp }} / {{ scoring.values.numRampDown }}</div>
      </div>

      <div>Points:</div>
      <div class="p-2 border-2 border-black">
        <div>Reliability Bonus: {{ scoring.scores.reliabilityBonus }}</div>
        <div>Exit Bonus: {{ scoring.scores.exitBonus }}</div>
        <div>Total: {{ scoring.scores.points }}</div>
      </div>
    </div>

    <!-- Playmode actions -->
    <div>
      <div>Actions:</div>
      <div class="p-2 border-2 border-black space-x-2">
        <button class="btn p-2" @click="scoring.start()">Start</button>
        <button class="btn p-2" @click="scoring.stop()">Stop</button>
        <button class="btn p-2" @click="scoring.lackOfProgress()">Lack of Progress</button>
        <button class="btn p-2" @click="reset()">Reset</button>
      </div>
      <div class="p-2 border-2 border-black space-x-2" v-if="selectedTile">
        <button class="btn p-2" @click="scoring.checkpointReached(selectedTile)" v-if="selectedTile.checkpoint && !selectedTile.checkpointVisited">Checkpoint reached</button>
        <button class="btn p-2" @click="scoring.checkpointSkipped(selectedTile)" v-if="selectedTile.checkpoint && !selectedTile.checkpointVisited">Checkpoint skipped</button>
        <button class="btn p-2" @click="scoring.bumperPassed(selectedTile)" v-if="selectedTile.bumper && !selectedTile.bumperPassed">Bumper passed</button>
        <button class="btn p-2" @click="scoring.victimDetected(selectedTile)" v-if="selectedTile.victim && !selectedTile.victimDetected">Victim detected</button>
        <button class="btn p-2" @click="scoring.deployedRescueKit(selectedTile)" v-if="selectedTile.victim && !selectedTile.rescueKitDeployed">Rescue Kit deployed</button>
        <button class="btn p-2" @click="scoring.rampUp(selectedTile)" v-if="selectedTile.isRamp && !selectedTile.rampUp">Ramp Up</button>
        <button class="btn p-2" @click="scoring.rampDown(selectedTile)" v-if="selectedTile.isRamp && !selectedTile.rampDown">Ramp Down</button>
        <button class="btn p-2" @click="scoring.exitFound(selectedTile)" v-if="selectedTile.startpoint && !selectedTile.exitBonusAchieved">Exit-Bonus</button>
      </div>
    </div>

    <div class="mt-4">
      <MazeField :maze="maze" :editable="false" @tileClicked="tileClicked"></MazeField>
    </div>
  </div>
</template>

<script setup>
import {getScheduleById, useCompetitions} from "../stores/competitions.js";
import {getParcourById, useParcours} from "../stores/Parcours.js";
import {newScoring} from "../controllers/scoring.js";
import MazeField from "../components/MazeField.vue";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";

useCompetitions() // make sure that they are initialized
useParcours() // make sure that they are initialized

const router = useRouter()
const props = defineProps(['competitionId', 'scheduleId'])
const schedule = getScheduleById(parseInt(props.competitionId), parseInt(props.scheduleId))
const parcour = getParcourById(schedule.parcourId)
const maze = ref(JSON.parse(JSON.stringify(parcour.maze)))
const scoring = newScoring();

const selectedTile = ref(null);
const victim = ref(false);
const black = ref(false);
const bumper = ref(false);
const checkpoint = ref(false);
const startpoint = ref(false);
const ramp = ref(false);
const editMode = ref(false);

watch(victim, (newVal, oldVal) => {
  if (selectedTile.value === null) {
    return;
  }

  selectedTile.value.victim = newVal;
});
watch(black, (newVal, oldVal) => {
  if (selectedTile.value === null) {
    return;
  }

  selectedTile.value.black = newVal;
});
watch(bumper, (newVal, oldVal) => {
  if (selectedTile.value === null) {
    return;
  }

  selectedTile.value.bumper = newVal;
});
watch(checkpoint, (newVal, oldVal) => {
  if (selectedTile.value === null) {
    return;
  }

  selectedTile.value.checkpoint = newVal;
});
watch(startpoint, (newVal, oldVal) => {
  if (selectedTile.value === null) {
    return;
  }

  selectedTile.value.startpoint = newVal;
});
watch(ramp, (newVal, oldVal) => {
  if( selectedTile.value === null) {
    return;
  }

  selectedTile.value.isRamp = newVal;
});


function tileClicked(x, y) {
  selectedTile.value = maze.value[y][x];
  victim.value = selectedTile.value.victim;
  black.value = selectedTile.value.black;
  bumper.value = selectedTile.value.bumper;
  checkpoint.value = selectedTile.value.checkpoint;
  startpoint.value = selectedTile.value.startpoint;
  ramp.value = selectedTile.value.isRamp;
}

function reset() {
  maze.value = JSON.parse(JSON.stringify(parcour.maze));
  scoring.reset()
}

function back() {
  router.back()
}
</script>