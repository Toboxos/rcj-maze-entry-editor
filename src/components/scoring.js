import {ref, computed} from "vue";

// values
const time = ref(0);
const numCheckpoints = ref(0);
const numCheckpointsWithBonus = ref(0);
const numLackOfProgress = ref(0);
const numBumpersPassed = ref(0);
const numVictimsDetected = ref(0);
const numRescueKitsDeployed = ref(0);
const exitBonusAchieved = ref(false);
const numRampUp = ref(0);
const numRampDown = ref(0);

// computed stats
const reliabilityBonus = computed( () => {
    return Math.max(
        0,
        10 * (
            numVictimsDetected.value + numRescueKitsDeployed.value - numLackOfProgress.value
        )
    );
});
const exitBonusPoints = computed( () => {
    return exitBonusAchieved.value ? numVictimsDetected.value * 10 : 0;
});
const points = computed( () => {
    let _points = 0;

    // checkpoints
    _points += numCheckpoints.value * 10;
    _points += numCheckpointsWithBonus.value * 10;

    // bumper
    _points += numBumpersPassed.value * 5;

    // victims
    _points += numVictimsDetected.value * 10;
    _points += numRescueKitsDeployed.value * 10;

    // ramp up
    _points += numRampUp.value *  20;

    // ramp down
    _points += numRampDown.value * 10;

    // reliability bonus
    _points += reliabilityBonus.value;

    // exit bonus
    _points += exitBonusPoints.value;
    return _points;
});
const timeFormatted = computed( () => {
    // time [s]
    // formated time output : 00:00
    const minutes = Math.floor(time.value / 1000 / 60);
    const seconds = Math.floor(time.value / 1000) - minutes * 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});


export function useScoring() {
    return {
        time,
        numCheckpoints,
        numCheckpointsWithBonus,
        numLackOfProgress,
        numBumpersPassed,
        numVictimsDetected,
        numRescueKitsDeployed,
        exitBonusAchieved,
        numRampUp,
        numRampDown,

        reliabilityBonus,
        exitBonusPoints,
        points,
        timeFormatted,
    }
}