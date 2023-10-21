<template>
  <div class="p-2">

    <!-- Competitions -->
    <div>Competitions:</div>
    <div class="p-2 border-2 border-black flex flex-col">
      <button class="w-20" @click="createCompetition">+ Create</button>
    </div>

    <!-- Parcours -->
    <div>Parcours:</div>
    <div class="p-2 border-2 border-black flex flex-col">
      <div v-for="parcour in parcours" class="flex flex-row justify-between" :key="parcour.id">
        <div>{{ parcour.name }}</div>
        <div>{{ parcour.category }}</div>
        <div class="flex flex-row space-x-2 text-blue-600">
          <button @click="editParcour(parcour)">Edit</button>
          <button @click="downloadParcour(parcour)">Download</button>
          <button @click="deleteParcour(parcour)">Delete</button>
        </div>
      </div>
      <button class="w-20" @click="createParcour">+ Create</button>
    </div>

  </div>
</template>

<script setup>
import {reactive} from "vue";
import {useParcours, addParcour} from "../stores/Parcours.js";
import {useRouter} from "vue-router";

const router = useRouter();
const parcours = useParcours();

function createCompetition() {
  const name = prompt("Name of the Competition");
  alert(name);
}

function createParcour() {
  const name = prompt("Name of the Parcour");
  if( name !== null ) {
    addParcour(name);
  }
}

function deleteParcour(parcour) {
  console.log("test");
  const index = parcours.indexOf(parcour);
  console.log(index);
  parcours.splice(index, 1);
}

function editParcour(parcour) {
  router.push('/editor/' + parcour.id);
}

function downloadParcour(parcour) {
  const data = JSON.stringify(parcour.maze);

  // Create element with <a> tag
  const link = document.createElement("a");

  // Create a blog object with the file content which you want to add to the file
  const file = new Blob([data], { type: 'text/plain' });

  // Add file content in the object URL
  link.href = URL.createObjectURL(file);

  // Add file name
  link.download = parcour.name + ".json";

  // Add click event to <a> tag to save file.
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>