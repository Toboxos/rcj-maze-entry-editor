<template>
  <div class="p-2">

    <!-- Competitions -->
    <div>Competitions:</div>
    <div class="p-2 border-2 border-black flex flex-col">
      <div v-for="competition in competitions" class="flex flex-row justify-between" :key="competition.id">
        <div>{{ competition.name }}</div>
        <div class="flex flex-row space-x-2 text-blue-600">
          <button @click="editCompetition(competition)">Edit</button>
          <button @click="deleteCompetition(competition)">Delete</button>
        </div>
      </div>
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
import {useParcours, addParcour, deleteParcour} from "../stores/Parcours.js";
import {useCompetitions, addCompetition} from "../stores/competitions.js";
import {useRouter} from "vue-router";

const router = useRouter();
const parcours = useParcours();
const competitions = useCompetitions();

function createCompetition() {
  const name = prompt("Name of the Competition");
  if( name !== null ) {
    addCompetition(name);
  }
}

function createParcour() {
  const name = prompt("Name of the Parcour");
  if( name !== null ) {
    addParcour(name);
  }
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

function editCompetition(competition) {
  router.push('/competition/' + competition.id);
}

function deleteCompetition(competition) {
  const index = competitions.indexOf(competition)
  competitions.splice(index, 1)
}
</script>