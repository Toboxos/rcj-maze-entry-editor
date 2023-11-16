<template>
  <div>Scoreboard</div>

  <div>
    <div v-for="competition in competitions" :key="competition.id">
      <div class="border-2 border-black text-center">{{ competition.name }}</div>
      <CompetitionScoreboard :competitionId="competition.id"></CompetitionScoreboard>
    </div>
  </div>
</template>

<script setup>
import {useCompetitions} from "../stores/competitions.js";
import CompetitionScoreboard from "./CompetitionScoreboard.vue";

const competitions = useCompetitions();
</script>