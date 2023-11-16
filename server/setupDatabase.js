import sqlite3 from 'sqlite3'
import * as readline from "readline";
import bcrypt from "bcrypt";

console.log("=== Database Setup ===")
sqlite3.verbose()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the admin username: ', function(username) {
    rl.stdoutMuted = true;
    rl.question('Enter the admin password: ', function(password) {
        rl.close()

        bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                console.error('Error hashing password:', err);
                return;
            }

            const db = new sqlite3.Database('database.db')
            initDatabase(db)
            createAdmin(db, username, hash)
        })
    })
})

function initDatabase(db) {
    console.log(" * Initialize database")

    db.exec(`
    CREATE TABLE parcours (
        id INTEGER PRIMARY KEY,
        name TEXT,
        category TEXT,
        maze TEXT
    );
    
    CREATE TABLE teams (
        id INTEGER PRIMARY KEY,
        name TEXT,
        competition INTEGER
    );
    
    CREATE TABLE competitions (
        id INTEGER PRIMARY KEY,
        name TEXT
    );
    
    CREATE TABLE schedules (
        id INTEGER PRIMARY KEY,
        competition INTEGER,
        team INTEGER,
        parcour INTEGER,
        time TEXT,
        actions TEXT,
        score INTEGER
    );
    
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT,
        permission_level INTEGER
    );
`)
}

function createAdmin(db, username, password) {
    console.log(" * Create admin user " + username)
    db.run(`
        INSERT INTO users (username, password, permission_level)
        VALUES (?, ?, ?)
    `, [username, password, 2])
}

