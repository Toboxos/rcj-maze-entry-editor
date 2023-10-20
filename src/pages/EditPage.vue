<template>
  <div class="p-2 flex flex-row space-x-2">
    <button class="btn" @click="save">Save</button>
    <button class="btn" @click="abort">Abort</button>
  </div>

  <div class="p-2">
    <div>Parcour Details:</div>
    <div class="p-2 border-2 border-black">
      <div class="grid grid-cols-2 inline">
        <div class="inline font-bold">Name:</div>
        <div class="inline"><input type="text" v-model="name"></div>
        <div class="inline font-bold">Category:</div>
        <div class="inline"><input type="text" v-model="category"></div>
      </div>
    </div>
  </div>

  <MazeEditor :maze="maze.data" :key="maze.key"></MazeEditor>
</template>

<script setup>
import {makeTile, makeWalls} from "../components/maze.js";
import MazeEditor from "../components/MazeEditor.vue";
import {reactive, ref, watch} from "vue";

// a little trick is needed here:
// because vue didn't like just assignin a new array to maze we are using
// a key which we change on upload to force vue to rerender the maze with newest data
const maze = reactive({'key': 0, 'data': createEmptyMaze()});
const name = ref('Empty');
const category = ref('Maze Entry');

function createEmptyMaze() {
  return [
    [makeTile(0, 0, makeWalls(true, true, true, true), true)]
  ]
}

function save() {

}

function abort() {

}
</script>