<template>
  <div class="p-2 flex flex-row space-x-2">
    <button class="btn" @click="save">Save</button>
    <button class="btn" @click="abort">Abort</button>
    <button class="btn" @click="upload">Load from file</button>
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
import MazeEditor from "../components/MazeEditor.vue";
import {reactive, ref, watch} from "vue";
import {useParcours, saveParcour} from "../stores/Parcours.js";
import {useRouter} from "vue-router";
import {useMaze} from "../components/maze.js";

const router = useRouter();
const props = defineProps(['parcourId']);
const parcours = useParcours();

// parcours are fetched async -> wait for result
watch(parcours, (newVal) => {
  const parcour = newVal.find(e => e.id == props.parcourId);
  name.value = parcour.name
  category.value = parcour.category

  maze.data = parcour.maze
  maze.key += 1
})

// a little trick is needed here:
// because vue didn't like just assignin a new array to maze we are using
// a key which we change on upload to force vue to rerender the maze with newest data
const maze = reactive({'key': 0, 'data': {}}); // clone here
const name = ref("");
const category = ref("");

function save() {
  saveParcour({
    "id": props.parcourId,
    "name": name.value,
    "category": category.value,
    "maze": maze.data
  })
  router.push('/');
}

function abort() {
  router.push('/');
}

function upload() {
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
      maze.data = reactive(JSON.parse(content));
      maze.key +=1 ;
    }
  }
}
</script>