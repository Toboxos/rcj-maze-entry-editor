import sqlite3 from 'sqlite3'
sqlite3.verbose()
const db = new sqlite3.Database('database.db')

db.exec(`
    CREATE TABLE parcours (
        id INTEGER PRIMARY KEY,
        name TEXT,
        category TEXT,
        maze_id INTEGER
    )
`)

db.exec(`
    CREATE TABLE maze (
        maze_id INTEGER,
        x INTEGER,
        y INTEGER,
        wall_top BOOLEAN,
        wall_right BOOLEAN,
        wall_bottom BOOLEAN,
        wall_left BOOLEAN
    )
`)
