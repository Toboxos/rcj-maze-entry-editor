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

}
</script>