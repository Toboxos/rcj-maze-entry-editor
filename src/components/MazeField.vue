<template>
  <div>
    <div v-for="row in maze" class="m-0 flex flex-nowrap">
      <Tile
          :tile="tile" v-for="tile in row" :key="'tile' + tile.x + '' + tile.y"
          :editMode="$props.editable"
          :selected="$props.selectedTile === tile"
          @expand="(x, y, dir) => $emit('expand', x, y, dir)"
          @tileClicked="(x, y) => $emit('tileClicked', x, y)" />
    </div>
  </div>
</template>

<script setup>
import Tile from "./Tile.vue";
import {watch} from "vue";

defineEmits(['tileClicked', 'expand']);
defineProps({
  maze: Array[Object],
  selectedTile: Object,
  editable: Boolean,
});
</script>