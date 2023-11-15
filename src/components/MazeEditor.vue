<template>
  <div class="p-2">
    <!-- Tile settings -->
    <div>Tile Configuration:</div>
    <div class="p-2 border-2 border-black" v-if="selectedTile !== null">
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

    <MazeField
        class="mt-4"
        :maze="maze" :selectedTile="selectedTile" :editable="true"
        @tileClicked="tileClicked" @expand="expand" />
  </div>
</template>

<script setup>
import {reactive, ref, watch} from 'vue';
import {makeWalls, makeTile} from "./maze.js";
import MazeField from "./MazeField.vue";

const props = defineProps(['maze']);

const maze = props.maze;
let selectedTile = ref(null);

const victim = ref(false);
const black = ref(false);
const bumper = ref(false);
const checkpoint = ref(false);
const startpoint = ref(false);
const ramp = ref(false);

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
  selectedTile.value = maze[y][x];
}

function expand(x, y, dir) {
  if( dir === "up" ) addUp(x, y);
  if( dir === "right" ) addRight(x, y);
  if( dir === "down" ) addDown(x, y);
  if( dir === "left" ) addLeft(x, y);
}

function addUp(x, y) {
  // remove up wall
  maze[y][x].walls[0] = false;


  // add new row
  if( y === 0 ) {
    maze.unshift(maze[0].map(
        () => makeTile(-1, -1, makeWalls(true, true, true, true), false)
    ));
    y = y + 1; // update idx
  }

  // remove bottom tile of new tile
  maze[y - 1][x].walls[2] = false;
  maze[y - 1][x].active = true;

  updateIds();
}

function addLeft(x, y) {
  // remove left wall
  maze[y][x].walls[3] = false;


  // add new column
  if( x === 0 ) {
    for( let i = 0; i < maze.length; ++i ) {
      const row = maze[i];
      row.unshift( makeTile(-1, -1, makeWalls(true, true, true, true), false) );
    }
    x = x + 1; // update idx
  }

  // remove right wall of tile
  maze[y][x - 1].walls[1] = false;
  maze[y][x - 1].active = true;

  updateIds();
}

async function addRight(x, y) {
  // remove right wall
  maze[y][x].walls[1] = false;


  // add new column
  if( x === maze[y].length - 1 ) {
    // add col to every row
    for( let i = 0; i < maze.length; ++i ) {
      const row = maze[i];
      row.push( makeTile(-1, -1, makeWalls(true, true, true, true), false) );
    }
  }

  // remove left wall of tile
  maze[y][x + 1].walls[3] = false;
  maze[y][x + 1].active = true;

  updateIds();
}

function addDown(x, y) {
  // remove bottom wall
  maze[y][x].walls[2] = false;


  // add new row
  if( y === maze.length - 1 ) {
    maze.push(maze[0].map(
        () => makeTile(-1, -1, makeWalls(true, true, true, true), false)
    ));
  }

  // remove top wall of new tile
  maze[y + 1][x].walls[0] = false;
  maze[y + 1][x].active = true;

  updateIds();
}

function updateIds() {
  for( let y = 0; y < maze.length; ++y ) {
    const row = maze[y];
    for( let x = 0; x < row.length; ++x ) {
      row[x].y = y;
      row[x].x = x;
    }
  }
}
</script>