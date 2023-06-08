<template>
  <div>

    <div class="text-3xl">
      EditMode: <input type="checkbox" v-model="editMode">
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
      </div>
    </div>

    <!-- Maze -->
    <div class="p-2">
      <div v-for="row in maze.data" class="m-0">
        <Tile
            :tile="tile" v-for="tile in row" :key="'tile' + tile.x + '' + tile.y"
            :editMode="editMode"
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

function tileClicked(x, y) {
  selectedTile.value = maze.data[y][x];
  victim.value = selectedTile.value.victim;
  black.value = selectedTile.value.black;
  bumper.value = selectedTile.value.bumper;
  checkpoint.value = selectedTile.value.checkpoint;
}

tileClicked(0, 0);
</script>

<style>
</style>
