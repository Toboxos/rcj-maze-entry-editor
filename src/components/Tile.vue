<template>
  <div
      class="tile mt-[-10px] tile relative"
      :class="attributes"
      v-if="props.tile.active"
      @click="clicked"
  >

    <!-- Victim -->
    <font-awesome-icon
        class="absolute text-5xl text-red-400 right-0 left-0 bottom-0 top-0 m-auto"
        icon="fa-solid fa-plus"
        v-if="props.tile.victim" />

    <!-- Bumper -->
    <font-awesome-icon
        class="absolute text-5xl text-amber-900 right-0 left-0 bottom-0 m-auto"
        icon="fa-solid fa-minus"
        v-if="props.tile.bumper" />

    <!-- Startpoint -->
    <font-awesome-icon
        class="absolute text-2xl text-green-400 right-0 left-0 top-0 m-auto"
        icon="fa-solid fa-flag-checkered"
        v-if="props.tile.startpoint" />

    <div class="inline" v-if="props.editMode === true">

      <!-- Edit iccons -->
      <font-awesome-icon
          class="absolute text-2xl text-slate-400 right-0 left-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-up"
          v-if="props.tile.walls[0]"
          @click="addUp" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 right-0 left-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-down"
          v-if="props.tile.walls[2]"
          @click="addDown" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 top-0 left-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-left"
          v-if="props.tile.walls[3]"
          @click="addLeft" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 top-0 right-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-right"
          v-if="props.tile.walls[1]"
          @click="addRight" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 top-0 left-0 right-0 m-auto hover:text-black"
          icon="fa-solid fa-gear"
          :class="{'text-blue-500': props.selected}"
          @click="$emit('tileClicked', props.tile.x, props.tile.y)" />
    </div>
  </div>

  <!-- Placeholder -->
  <div v-if="!props.tile.active" class="tile mt-[-10px] tile relative text-transparent">
  </div>
</template>

<script setup>
import {useMaze, makeTile, makeWalls} from "./maze.js";
import {computed} from "vue";

const maze = useMaze();

const emit = defineEmits(['tileClicked']);
const props = defineProps(["tile", "editMode", "selected"]);
const attributes = computed(() => {
  return {
    "wall-top": props.tile.walls[0],
    "wall-right": props.tile.walls[1],
    "wall-bottom": props.tile.walls[2],
    "wall-left": props.tile.walls[3],
    "bg-black": props.tile.black,
    "bg-slate-500": props.tile.checkpoint,
    "bg-white": !props.tile.black && !props.tile.checkpoint
  }
})


function addUp() {
  let x = props.tile.x;
  let y = props.tile.y;

  // remove up wall
  maze.data[y][x].walls[0] = false;


  // add new row
  if( y === 0 ) {
    maze.data.unshift(maze.data[0].map(
        () => makeTile(-1, -1, makeWalls(true, true, true, true), false)
    ));
    y = y + 1; // update idx
  }

  // remove bottom tile of new tile
  maze.data[y - 1][x].walls[2] = false;
  maze.data[y - 1][x].active = true;

  updateIds();
}

function addLeft() {
  let x = props.tile.x;
  let y = props.tile.y;

  // remove left wall
  maze.data[y][x].walls[3] = false;


  // add new column
  if( x === 0 ) {
    for( let i = 0; i < maze.data.length; ++i ) {
      const row = maze.data[i];
      row.unshift( makeTile(-1, -1, makeWalls(true, true, true, true), false) );
    }
    x = x + 1; // update idx
  }

  // remove right wall of tile
  maze.data[y][x - 1].walls[1] = false;
  maze.data[y][x - 1].active = true;

  updateIds();
}

function addRight() {
  let x = props.tile.x;
  let y = props.tile.y;

  // remove right wall
  maze.data[y][x].walls[1] = false;


  // add new column
  if( x === maze.data[y].length - 1 ) {
    // add col to every row
    for( let i = 0; i < maze.data.length; ++i ) {
      const row = maze.data[i];
      row.push( makeTile(-1, -1, makeWalls(true, true, true, true), false) );
    }
  }

  // remove left wall of tile
  maze.data[y][x + 1].walls[3] = false;
  maze.data[y][x + 1].active = true;

  updateIds();
}

function addDown() {
  let x = props.tile.x;
  let y = props.tile.y;

  // remove bottom wall
  maze.data[y][x].walls[2] = false;


  // add new row
  if( y === maze.data.length - 1 ) {
    maze.data.push(maze.data[0].map(
        () => makeTile(-1, -1, makeWalls(true, true, true, true), false)
    ));
  }

  // remove top wall of new tile
  maze.data[y + 1][x].walls[0] = false;
  maze.data[y + 1][x].active = true;

  updateIds();
}

function updateIds() {
  for( let y = 0; y < maze.data.length; ++y ) {
    const row = maze.data[y];
    for( let x = 0; x < row.length; ++x ) {
      row[x].y = y;
      row[x].x = x;
    }
  }
}

function clicked() {
  emit('tileClicked', props.tile.x, props.tile.y);
}
</script>

<style scoped>
.tile {
  width: 80px;
  height: 80px;
  display: inline-block;

  border: 4px solid transparent;
}

.wall-left {
  border-left: 4px solid black;
}

.wall-top {
  border-top: 4px solid black;
}

.wall-right {
  border-right: 4px solid black;
}

.wall-bottom {
  border-bottom: 4px solid black;
}
</style>
