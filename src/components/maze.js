import {reactive, ref} from "vue";


const maze = reactive({
    data:[],
    val: 0,
});

export function useMaze() {
    if( maze.data.length === 0 ) {
        maze.data = [
            [makeTile(0, 0, makeWalls(true, true, true, true), true)]
        ]
    }
    return maze;
}

/**
 * Creates a array for the walls
 * @param top
 * @param right
 * @param bottom
 * @param left
 * @returns {{top, left, bottom, right}}
 */
export function makeWalls(top, right, bottom, left) {
    return [
        top,
        right,
        bottom,
        left
    ];
}

/**
 * Creates a new tile
 * @param x       X-Position
 * @param y       Y-Position
 * @param walls   Array for 4 walls (cw) containing true or false for a wall
 * @returns {{x, y}}
 */
export function makeTile(x, y, walls, active) {
    return {
        x: x,
        y: y,
        walls: walls,
        redCross: false,
        blackTile: false,
        bumper: false,
        checkpoint: false,
        startPoint: false,
        active: active,
    };
}