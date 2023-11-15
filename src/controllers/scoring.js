import {reactive, computed, watch} from "vue";

export function newScoring(existingActions) {
    const values = newValues()
    const scores = {
        reliabilityBonus: computed( () => {
            return Math.max(0, 10 * (
                values.numVictimsDetected + values.numRescueKitsDeployed - values.numLackOfProgress
            ))
        }),
        exitBonus: computed( () => {
            return values.exitBonusAchieved ? values.numVictimsDetected * 10 : 0
        }),
        points: computed( () => {
            let _points = 0;

            // checkpoints
            _points += values.numCheckpointsReached * 10
            _points += values.numCheckpointsBonus * 10

            // bumper
            _points += values.numBumpersPassed * 5

            // victims
            _points += values.numVictimsDetected * 10
            _points += values.numRescueKitsDeployed * 10

            // ramp
            _points += values.numRampUp * 20
            _points += values.numRampDown * 10

            // bonus
            _points += scores.reliabilityBonus.value
            _points += scores.exitBonus.value

            return _points
        })
    }
    const timeFormatted = computed(() => {
        // time [s]
        // formated time output : 00:00
        const minutes = Math.floor(values.time / 1000 / 60);
        const seconds = Math.floor(values.time / 1000) - minutes * 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    })
    const actions = reactive([]);

    let startTime = 0;
    let timeUpdateInterval = null;

    watch(actions, newActions => {
        newActions.forEach( action => {
            setTimeout( () => {
                action.execute(action.tile)
            }, 1)
        })
    })

    const obj = {
        values: values,
        scores: scores,
        timeFormatted: timeFormatted,
        actions: actions,

        reset() {
            Object.assign(values, newValues())
            actions.splice(0, actions.length)
        },
        start() {
            values.time = 0;
            startTime = Date.now();

            // start interval to update time periodically
            timeUpdateInterval = setInterval( () => {
                values.time = Date.now() - startTime;
            }, 1000);

            // push back start action
            actions.push({
                name: 'start',
                execute: actionStart(values),
                tile: null,
                description: 'Run started',
                timestamp: Date.now()
            });
        },
        stop() {
            values.time = Date.now() - startTime;

            // stop interval to update time periodically
            if( timeUpdateInterval !== null ) {
                clearInterval(timeUpdateInterval);
                timeUpdateInterval = null;
            }

            actions.push({
                name: 'stop',
                execute: () => {},
                tile: null,
                description: 'Run stopped',
                timestamp: Date.now()
            });
        },
        checkpointReached(tile) {
            actions.push({
                name: 'checkpointReached',
                execute: actionCheckpointReached(values),
                tile: tile,
                description: 'Checkpoint reached (10p)' + (values.numLackOfProgress ? ' + First try (10p)' : ''),
                timestamp: Date.now()
            });
        },
        checkpointSkipped(tile) {
            actions.push({
                name: 'checkpointSkipped',
                execute: actionCheckpointSkipped(values),
                tile: tile,
                description: 'Checkpoint skipped',
                timestamp: Date.now()
            });
        },
        lackOfProgress() {
            actions.push({
                name: 'lackOfProgress',
                execute: actionLackOfProgress(values),
                tile: null,
                description: 'Lack of Progress',
                timestamp: Date.now()
            });
        },
        bumperPassed(tile) {
            // push back bumper action
            actions.push({
                name: 'bumperPassed',
                execute: actionBumperPassed(values),
                tile: tile,
                description: 'Bumper passed (5p)',
                timestamp: Date.now()
            });
        },
        victimDetected(tile) {
            actions.push({
                name: 'victimDetected',
                execute: actionVictimDetected(values),
                tile: tile,
                description: 'Victim detected (10p)',
                timestamp: Date.now()
            });
        },
        deployedRescueKit(tile) {
            actions.push({
                name: 'deployedRescueKit',
                execute: actionRescueKitDeployed(values),
                tile: tile,
                description: 'Rescue Kit deployed (10p)',
                timestamp: Date.now()
            });
        },
        exitFound(tile) {
            actions.push({
                name: 'exitFound',
                execute: actionExitBonus(values),
                tile: tile,
                description: 'Exit detected (20p)',
                timestamp: Date.now()
            });
        },
        rampUp(tile) {
            actions.push({
                name: 'rampUp',
                execute: actionRampUp(values),
                tile: tile,
                description: 'Ramp Up (20p)',
                timestamp: Date.now(),
            });
        },
        rampDown(tile) {
            actions.push({
                name: 'rampDown',
                execute: actionRampDown(values),
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

    existingActions.forEach(a => {
        switch (a.name) {
            case 'start': obj.start(); break;
            case 'stop': obj.stop(); break;
            case 'checkpointReached': obj.checkpointReached(a.tile); break;
            case 'checkpointSkipped': obj.checkpointSkipped(a.tile); break;
            case 'lackOfProgress': obj.lackOfProgress(); break;
            case 'bumperPassed': obj.bumperPassed(a.tile); break;
            case 'victimDetected': obj.victimDetected(a.tile); break;
            case 'deployedRescueKit': obj.deployedRescueKit(a.tile); break;
            case 'exitFound': obj.exitFound(a.tile); break;
            case 'rampUp': obj.rampUp(a.tile); break;
            case 'rampDown': obj.rampDown(a.tile); break;
        }
    })

    return obj
}

function newValues() {
    return reactive({
        time: 0,
        numCheckpointsReached: 0,
        numCheckpointsBonus: 0,
        numLackOfProgress: 0,
        numBumpersPassed: 0,
        numVictimsDetected: 0,
        numRescueKitsDeployed: 0,
        exitBonusAchieved: false,
        numRampUp: 0,
        numRampDown: 0,

        currentLegWithoutLOP: true,
    });
}

function actionStart(values) {
    return () => {
        values.numCheckpoints = 0
        values.numCheckpointsBonus = 0
        values.numLackOfProgress = 0
        values.numBumpersPassed = 0
        values.numVictimsDetected = 0
        values.numRescueKitsDeployed = 0
        values.exitBonusAchieved = false
        values.numRampUp = 0
        values.numRampDown = 0

        values.currentLegWithoutLOP = true
    }
}

function actionCheckpointReached(values) {
    return (tile) => {
        tile.checkpointVisited = true;
        values.numCheckpoints++;

        if( values.currentLegWithoutLOP ) {
            values.numCheckpointsWithBonus++;
            tile.checkpointWithBonus = true;
        }
        values.currentLegWithoutLOP = true;
    }
}

function actionCheckpointSkipped(values) {
    return (tile) => {
        values.currentLegWithoutLOP = true;
        tile.checkpointVisited = true;
        tile.checkpointSkipped = true;
    }
}

function actionLackOfProgress(values) {
    return () => {
        values.numLackOfProgress++;
        values.currentLegWithoutLOP = false;
    }
}

function actionBumperPassed(values) {
    return (tile) => {
        values.numBumpersPassed++;
        tile.bumperPassed = true;
    }
}

function actionVictimDetected(values) {
    return (tile) => {
        values.numVictimsDetected++;
        tile.victimDetected = true;
    }
}

function actionRescueKitDeployed(values) {
    return (tile) => {
        values.numRescueKitsDeployed++;
        tile.rescueKitDeployed = true;
    }
}

function actionExitBonus(values) {
    return (tile) => {
        values.exitBonusAchieved = true;
        tile.exitFound = true;
    }
}

function actionRampUp(values) {
    return (tile) => {
        values.numRampUp++;
        tile.rampUp = true;
    }
}

function actionRampDown(values) {
    return (tile) => {
        values.numRampDown++;
        tile.rampDown = true;
    }
}