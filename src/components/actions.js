import {reactive, watch} from "vue";
import {useScoring} from "./scoring.js";

const scoring = useScoring();

// internal values
let startTime = 0;
let timeUpdateInterval = null;
let legWithoutLackOfProgress = true;

// actions stack
const actions = reactive([]);

// execute all actions from beginning when the stack changes
watch(actions, (newActions) => {
    // execute each action
    newActions.forEach( (action) => {
        setTimeout(() => {
            action.execute(action.tile);
        }, 1);
    });
});

// actions
function actionStart() {
    // reset all stats
    scoring.numCheckpoints.value = 0;
    scoring.numCheckpointsWithBonus.value = 0;
    scoring.numLackOfProgress.value = 0;
    scoring.numBumpersPassed.value = 0;
    scoring.numVictimsDetected.value = 0;
    scoring.numRescueKitsDeployed.value = 0;
    scoring.exitBonusAchieved.value = false;
    scoring.numRampDown.value = 0;
    scoring.numRampUp.value = 0;

    legWithoutLackOfProgress = true;
}

function actionCheckpointReached(tile) {
    tile.checkpointVisited = true;
    scoring.numCheckpoints.value++;
    console.log(tile);

    if( legWithoutLackOfProgress ) {
        scoring.numCheckpointsWithBonus.value++;
        tile.checkpointWithBonus = true;
    }
    legWithoutLackOfProgress = true;
}

function actionCheckpointSkipped(tile) {
    legWithoutLackOfProgress = true;
    tile.checkpointVisited = true;
    tile.checkpointSkipped = true;
}

function actionLackOfProgress() {
    scoring.numLackOfProgress.value++;
    legWithoutLackOfProgress = false;
}

function actionBumperPassed(tile) {
    scoring.numBumpersPassed.value++;
    tile.bumperPassed = true;
}

function actionVictimDetected(tile) {
    scoring.numVictimsDetected.value++;
    tile.victimDetected = true;
}

function actionRescueKitDeployed(tile) {
    scoring.numRescueKitsDeployed.value++;
    tile.rescueKitDeployed = true;
}

function actionExitBonus(tile) {
    scoring.exitBonusAchieved.value = true;
    tile.exitFound = true;
}

function actionRampUp(tile) {
    scoring.numRampUp.value++;
    tile.rampUp = true;
}

function actionRampDown(tile) {
    scoring.numRampDown.value++;
    tile.rampDown = true;
}

export function useActions() {
    return {
        actions,

        start() {
            scoring.time.value = 0;
            startTime = Date.now();

            // start interval to update time periodically
            timeUpdateInterval = setInterval( () => {
                scoring.time.value = Date.now() - startTime;
            }, 1000);

            // push back start action
            actions.push({
                execute: actionStart,
                tile: null,
                description: 'Run started',
                timestamp: Date.now()
            });
        },
        stop() {
            scoring.time.value = Date.now() - startTime;

            // stop interval to update time periodically
            if( timeUpdateInterval !== null ) {
                clearInterval(timeUpdateInterval);
                timeUpdateInterval = null;
            }

            actions.push({
                execute: () => {},
                tile: null,
                description: 'Run stopped',
                timestamp: Date.now()
            });
        },
        checkpointReached(tile) {
            actions.push({
                execute: actionCheckpointReached,
                tile: tile,
                description: 'Checkpoint reached (10p)' + (legWithoutLackOfProgress ? ' + First try (10p)' : ''),
                timestamp: Date.now()
            });
        },
        checkpointSkipped(tile) {
            actions.push({
                execute: actionCheckpointSkipped,
                tile: tile,
                description: 'Checkpoint skipped',
                timestamp: Date.now()
            });
        },
        lackOfProgress() {
            actions.push({
                execute: actionLackOfProgress,
                tile: null,
                description: 'Lack of Progress',
                timestamp: Date.now()
            });
        },
        bumperPassed(tile) {
            // push back bumper action
            actions.push({
                execute: actionBumperPassed,
                tile: tile,
                description: 'Bumper passed (5p)',
                timestamp: Date.now()
            });
        },
        victimDetected(tile) {
            actions.push({
                execute: actionVictimDetected,
                tile: tile,
                description: 'Victim detected (10p)',
                timestamp: Date.now()
            });
        },
        deployedRescueKit(tile) {
            actions.push({
                execute: actionRescueKitDeployed,
                tile: tile,
                description: 'Rescue Kit deployed (10p)',
                timestamp: Date.now()
            });
        },
        exitFound(tile) {
            actions.push({
                execute: actionExitBonus,
                tile: tile,
                description: 'Exit detected (20p)',
                timestamp: Date.now()
            });
        },
        rampUp(tile) {
            actions.push({
                execute: actionRampUp,
                tile: tile,
                description: 'Ramp Up (20p)',
                timestamp: Date.now(),
            });
        },
        rampDown(tile) {
            actions.push({
                execute: actionRampDown,
                tile: tile,
                description: 'Ramp Down (10p)',
                timestamp: Date.now(),
            });
        },

        undo() {
            // pop back last action
            actions.pop();
        }
    }
}