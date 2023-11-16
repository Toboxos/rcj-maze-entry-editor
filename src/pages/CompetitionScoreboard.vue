<template>
  <div>
    <div v-for="team in scoreboard" class="flex flex-row">
      <div class="text-center basis-1/2">{{ team.name }}</div>
      <div class="text-center basis-1/2">{{ team.id in scores ? scores[team.id] : 0 }}</div>
    </div>
  </div>
</template>

<script setup>
import {useTeams} from "../stores/teams.js";
import {useSchedules} from "../stores/schedules.js";
import {computed, watch} from "vue";

const props = defineProps(['competitionId'])

const teams = useTeams({'id': props.competitionId})
const schedules = useSchedules({'id': props.competitionId})

const scores = computed(() => {
  const scores = {}
  schedules.forEach(e => {
    if( !(e.team in scores) ) {
      scores[e.team] = 0
    }

    scores[e.team] += e.score
  })

  return scores
})

const scoreboard = computed(() => {
  const items = teams
  items.sort((a, b) => {
    const scoreA = a.id in scores.value ? scores.value[a.id] : 0
    const scoreB = b.id in scores.value ? scores.value[b.id] : 0

    return scoreB - scoreA
  })
  return items
})


</script>