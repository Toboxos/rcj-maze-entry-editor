<template>
  <div
      class="tile mt-[-10px] tile relative"
      :class="attributes"
      v-if="props.tile.active"
      @click="$emit('tileClicked', props.tile.x, props.tile.y)"
  >

    <!-- Checkmarks -->
    <div v-for="check in checks">
      <div v-if="check" class="min-h-[10px]">
        <font-awesome-icon
            class="absolute text-xl text-green-400"
            icon="fa-solid fa-check"/>
      </div>
    </div>

    <!-- X-Mark checkpoint skipped -->
    <div v-if="props.tile.checkpointSkipped" class="min-h-[10px]">
      <font-awesome-icon
          class="absolute text-xl text-red-400"
          icon="fa-solid fa-xmark"
          />
    </div>

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

    <!-- Ramp -->
    <font-awesome-icon
        class="absolute text-2xl text-blue-600 right-0 left-0 top-0 m-auto"
        icon="fa-solid fa-arrow-down-up-across-line"
        v-if="props.tile.isRamp" />

    <div class="inline" v-if="props.editMode === true">

      <!-- Edit icons -->
      <font-awesome-icon
          class="absolute text-2xl text-slate-400 right-0 left-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-up"
          v-if="props.tile.walls[0]"
          @click="$emit('expand', props.tile.x, props.tile.y, 'up')" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 right-0 left-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-down"
          v-if="props.tile.walls[2]"
          @click="$emit('expand', props.tile.x, props.tile.y, 'down')" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 top-0 left-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-left"
          v-if="props.tile.walls[3]"
          @click="$emit('expand', props.tile.x, props.tile.y, 'left')" />

      <font-awesome-icon
          class="absolute text-2xl text-slate-400 bottom-0 top-0 right-0 m-auto hover:text-black"
          icon="fa-solid fa-caret-right"
          v-if="props.tile.walls[1]"
          @click="$emit('expand', props.tile.x, props.tile.y, 'right')" />

      <font-awesome-icon
          class="absolute text-2xl bottom-0 top-0 left-0 right-0 m-auto hover:text-black"
          icon="fa-solid fa-gear"
          :class="{'text-blue-500': props.selected, 'text-slate-400': !props.selected}"
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

const emit = defineEmits(['tileClicked', 'expand']);
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
const checks = computed(() => {
  return [
      props.tile.exitBonusAchieved,
      props.tile.victimDetected,
      props.tile.rescueKitDeployed,
      props.tile.checkpointVisited && !props.tile.checkpointSkipped,
      props.tile.bumperPassed,
      props.tile.checkpointWithBonus,
      props.tile.rampDown,
      props.tile.rampUp,
  ];
});
</script>

<style scoped>
.tile {
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
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
