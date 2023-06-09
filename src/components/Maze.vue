<template>
  <div>
    <div class="p-2 text-right bg-green-200">
      Made by <a href="https://toboxos.de" class="text-blue-600 hover:text-blue-800">@Toboxos</a>
    </div>

    <div class="p-2 space-x-2">
      <button class="btn p-2" @click="play">Play mode</button>
      <button class="btn p-2" @click="edit">Edit mode</button>

      <button class="btn p-2" @click="save">Save</button>
      <button class="btn p-2" @click="load">Load</button>
    </div>

    <!-- Tile settings -->
    <div class="p-2" v-if="selectedTile !== null && editMode">
      <div class="text-2xl">Tile {{ selectedTile.y }} {{ selectedTile.x }}</div>
      <div>
        <div class="inline p-2">
          <input type="checkbox" v-model="victim"> Victim
        </div>

        <div class="inline p-2">
          <input type="checkbox" v-model="black"> Black
        </div>

        <div class="inline p2-">
          <input type="checkbox" v-model="bumper"> Bumper
        </div>

        <div class="inline p-2">
          <input type="checkbox" v-model="checkpoint"> Checkpoint
        </div>

        <div class="inline p-2">
          <input type="checkbox" v-model="startpoint"> Startpoint
        </div>

        <div class="inline p-2">
          <input type="checkbox" v-model="ramp"> Ramp
        </div>
      </div>
    </div>

    <!-- Playmode stats -->
    <div class="p-2" v-if="!editMode">
      <div>Stats:</div>
      <div class="p-2 border-2 border-black">
        <div>Time: {{ scoring.timeFormatted }}</div>
        <div>Checkpoints (Bonus): {{ scoring.numCheckpoints }} ({{ scoring.numCheckpointsWithBonus }})</div>
        <div>Bumpers passed: {{ scoring.numBumpersPassed }}</div>
        <div>Victims detected / Rescue kits deployed: {{ scoring.numVictimsDetected }} / {{ scoring.numRescueKitsDeployed }}</div>
        <div>Lack of progress: {{ scoring.numLackOfProgress }}</div>
        <div>Ramp up / Ramp down: {{ scoring.numRampUp }} / {{ scoring.numRampDown }}</div>
      </div>

      <div>Points:</div>
      <div class="p-2 border-2 border-black">
        <div>Reliability Bonus: {{ scoring.reliabilityBonus }}</div>
        <div>Exit Bonus: {{ scoring.exitBonusPoints }}</div>
        <div>Total: {{ scoring.points }}</div>
      </div>
    </div>

    <!-- Playmode actions -->
    <div class="p-2" v-if="!editMode">
      <div>Actions:</div>
      <div class="p-2 border-2 border-black space-x-2">
        <button class="btn p-2" @click="actions.start()">Start</button>
        <button class="btn p-2" @click="actions.stop()">Stop</button>
        <button class="btn p-2" @click="actions.lackOfProgress()">Lack of Progress</button>
      </div>
      <div class="p-2 border-2 border-black space-x-2">
        <button class="btn p-2" @click="actions.checkpointReached(selectedTile)" v-if="selectedTile.checkpoint && !selectedTile.checkpointVisited">Checkpoint reached</button>
        <button class="btn p-2" @click="actions.checkpointSkipped(selectedTile)" v-if="selectedTile.checkpoint && !selectedTile.checkpointVisited">Checkpoint skipped</button>
        <button class="btn p-2" @click="actions.bumperPassed(selectedTile)" v-if="selectedTile.bumper && !selectedTile.bumperPassed">Bumper passed</button>
        <button class="btn p-2" @click="actions.victimDetected(selectedTile)" v-if="selectedTile.victim && !selectedTile.victimDetected">Victim detected</button>
        <button class="btn p-2" @click="actions.deployedRescueKit(selectedTile)" v-if="selectedTile.victim && !selectedTile.rescueKitDeployed">Rescue Kit deployed</button>
        <button class="btn p-2" @click="actions.rampUp(selectedTile)" v-if="selectedTile.isRamp && !selectedTile.rampUp">Ramp Up</button>
        <button class="btn p-2" @click="actions.rampDown(selectedTile)" v-if="selectedTile.isRamp && !selectedTile.rampDown">Ramp Down</button>
        <button class="btn p-2" @click="actions.exitFound(selectedTile)" v-if="selectedTile.startpoint && !selectedTile.exitBonusAchieved">Exit-Bonus</button>
      </div>
    </div>

    <!-- Maze -->
    <div class="p-2 mt-2">
      <div v-for="row in maze.data" class="m-0 flex flex-nowrap">
        <Tile
            :tile="tile" v-for="tile in row" :key="'tile' + tile.x + '' + tile.y"
            :editMode="editMode"
            :selected="tile === selectedTile"
            @tileClicked="tileClicked" />
      </div>
    </div>

    <!-- Actions log -->
    <div class="p-2">
      <div v-for="action in actions.actions">
        <div class="inline">
          {{ action.description }} ({{ new Date(action.timestamp).toLocaleString() }})
        </div>

        <div class="inline" v-if="action.tile !== null && action.tile !== undefined">
          [{{ action.tile.x }} {{ action.tile.y }}]
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import Tile from "./Tile.vue";
import {useMaze} from "./maze.js";
import {ref, watch} from "vue";
import {useScoring} from "./scoring.js";
import {useActions} from "./actions.js";

const maze = useMaze();
const scoring = useScoring();
const actions = useActions();

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
  selectedTile.value = maze.data[y][x];
  victim.value = selectedTile.value.victim;
  black.value = selectedTile.value.black;
  bumper.value = selectedTile.value.bumper;
  checkpoint.value = selectedTile.value.checkpoint;
  startpoint.value = selectedTile.value.startpoint;
  ramp.value = selectedTile.value.isRamp;
}

function save() {
  const data = JSON.stringify(maze.data);

  // Create element with <a> tag
  const link = document.createElement("a");

  // Create a blog object with the file content which you want to add to the file
  const file = new Blob([data], { type: 'text/plain' });

  // Add file content in the object URL
  link.href = URL.createObjectURL(file);

  // Add file name
  link.download = "maze.json";

  // Add click event to <a> tag to save file.
  link.click();
  URL.revokeObjectURL(link.href);
}

function load() {
  const input = document.createElement('input');
  input.type = 'file';
  input.click();

  input.onchange = e => {
    // getting a hold of the file reference
    const file = e.target.files[0];

    // setting up the reader
    const reader = new FileReader();
    reader.readAsText(file,'UTF-8');

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      const content = readerEvent.target.result; // this is the content!
      maze.data = JSON.parse(content);
    }
  }
}

function edit() {
  editMode.value = true;
}

function play() {
  editMode.value = false;
}

tileClicked(0, 0);
</script>

<style>
</style>
