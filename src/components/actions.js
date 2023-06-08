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
            action.execute();
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

    legWithoutLackOfProgress = true;
}

function actionCheckpointReached() {
    scoring.numCheckpoints.value++;

    if( legWithoutLackOfProgress ) {
        scoring.numCheckpointsWithBonus.value++;
    }
    legWithoutLackOfProgress = true;
}

function actionCheckpointSkipped() {
    legWithoutLackOfProgress = true;
}

function actionLackOfProgress() {
    scoring.numLackOfProgress.value++;
    legWithoutLackOfProgress = false;
}

function actionBumperPassed() {
    scoring.numBumpersPassed.value++;
}

function actionVictimDetected() {
    scoring.numVictimsDetected.value++;
}

function actionRescueKitDeployed() {
    scoring.numRescueKitsDeployed.value++;
}

function actionExitBonus() {
    scoring.exitBonusAchieved.value = true;
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
                description: 'Run stopped',
                timestamp: Date.now()
            });
        },
        checkpointReached() {
            actions.push({
                execute: actionCheckpointReached,
                description: 'Checkpoint reached (10p)' + (legWithoutLackOfProgress ? ' + First try (10p)' : ''),
                timestamp: Date.now()
            });
        },
        checkpointSkipped() {
            actions.push({
                execute: actionCheckpointSkipped,
                description: 'Checkpoint skipped',
                timestamp: Date.now()
            });
        },
        lackOfProgress() {
            actions.push({
                execute: actionLackOfProgress,
                description: 'Lack of Progress',
                timestamp: Date.now()
            });
        },
        bumperPassed() {
            // push back bumper action
            actions.push({
                execute: actionBumperPassed,
                description: 'Bumper passed (5p)',
                timestamp: Date.now()
            });
        },
        victimDetected() {
            actions.push({
                execute: actionVictimDetected,
                description: 'Victim detected (10p)',
                timestamp: Date.now()
            });
        },
        deployedRescueKit() {
            actions.push({
                execute: actionRescueKitDeployed,
                description: 'Rescue Kit deployed (10p)',
                timestamp: Date.now()
            });
        },
        exitFound() {
            actions.push({
                execute: actionExitBonus,
                description: 'Exit detected (20p)',
                timestamp: Date.now()
            });
        },

        undo() {
            // pop back last action
            actions.pop();
        }
    }
}