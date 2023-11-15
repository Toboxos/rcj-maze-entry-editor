import sqlite3 from 'sqlite3'
sqlite3.verbose()
const db = new sqlite3.Database('database.db')

db.exec(`
    CREATE TABLE parcours (
        id INTEGER PRIMARY KEY,
        name TEXT,
        category TEXT,
        maze TEXT
    )
`)
