<template>
  <div>
    <div class="space-x-2">
      <button class="btn p-2" @click="play">Play mode</button>
      <button class="btn p-2" @click="edit">Edit mode</button>
    </div>

    <div class="space-x-2">
      <button class="btn p-2" @click="save">Save</button>
      <button class="btn p-2" @click="load">Load</button>
    </div>

    <!-- Tile settings -->
    <div class="p-2" v-if="selectedTile !== null">
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
      </div>
    </div>

    <!-- Maze -->
    <div class="p-2">
      <div v-for="row in maze.data" class="m-0">
        <Tile
            :tile="tile" v-for="tile in row" :key="'tile' + tile.x + '' + tile.y"
            :editMode="editMode"
            :selected="tile === selectedTile"
            @tileClicked="tileClicked" />
      </div>
    </div>


  </div>
</template>

<script setup>
import Tile from "./Tile.vue";
import {useMaze} from "./maze.js";
import {ref, watch} from "vue";

const maze = useMaze();

const selectedTile = ref(null);
const victim = ref(false);
const black = ref(false);
const bumper = ref(false);
const checkpoint = ref(false);
const startpoint = ref(false);
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

function tileClicked(x, y) {
  selectedTile.value = maze.data[y][x];
  victim.value = selectedTile.value.victim;
  black.value = selectedTile.value.black;
  bumper.value = selectedTile.value.bumper;
  checkpoint.value = selectedTile.value.checkpoint;
  startpoint.value = selectedTile.value.startpoint;
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
