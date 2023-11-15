import express from 'express'
import bodyParser from "body-parser";
import sqlite3 from "sqlite3"
import cors from "cors"

sqlite3.verbose()
const db = new sqlite3.Database('database.db')
const app = express();
app.use(bodyParser.json())
app.use(cors())

app.get("/parcours", (req, res) => {
    db.all(`SELECT * FROM parcours`, (err, rows) => {
        res.send(rows)
    })
})

app.post("/parcours", (req, res) => {
    const data = req.body
    const name = data.name
    const category = data.category

    db.run("INSERT INTO parcours (name, category) VALUES (?, ?)", [name, category], function (err, result) {
        res.send({})
    })
})

app.put("/parcour/:id", (req, res) => {
    const id = req.params.id
    const data = req.body
    const name = data.name
    const category = data.category
    const maze = data.maze

    console.log(data)

    db.run("UPDATE parcours SET name = ?, category = ?, maze = ? WHERE id = ?", [name, category, maze, id], function (err, result) {
        console.log(err)
        res.send({})
    })
})

app.delete("/parcour/:id", (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM parcours WHERE id = ?", id, (err, _) => {
        if( err === null ) {
            res.send({})
        }
    })
})

app.get("/competitions", (req, res) => {
    db.all(`SELECT * FROM competitions`, (err, rows) => {
        res.send(rows)
    })
})

app.post("/competition", (req, res) => {
    const data = req.body
    const name = data.name

    db.run("INSERT INTO competitions (name) VALUES (?)", [name], function (err, result) {
        res.send({})
    })
})

app.delete("/competition/:id", (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM competitions WHERE id = ?", [id], function (err, result) {
        res.send({})
    })
})

app.get("/competition/:id/teams", (req, res) => {
    const id = req.params.id
    db.all(`SELECT * FROM teams WHERE competition = ?`, id, (err, rows) => {
        res.send(rows)
    })
})

app.post("/competition/:id/team", (req, res) => {
    const id = req.params.id
    const data = req.body
    const name = data.name

    db.run("INSERT INTO teams (name, competition) VALUES (?, ?)", [name, id], function (err, result) {
        res.send({})
    })
})

app.delete("/competition/:comp/team/:id", (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM teams WHERE id = ?", [id], function (err, result) {
        res.send({})
    })
})

app.get("/competition/:id/schedules", (req, res) => {
    const id = req.params.id
    db.all(`SELECT * FROM schedules WHERE competition = ?`, (err, rows) => {
        res.send(rows)
    })
})

app.post("/competition/:id/schedule", (req, res) => {
    const id = req.params.id
    const data = req.body
    const name = data.name
    const team = data.team
    const parcour = data.parcour
    const time = data.time

    db.run("INSERT INTO schedules (name, competition, team, parcour, time, actions) VALUES (?, ?, ?, ?, ?)",
        [name, id, team, parcour, time, "[]"],
        function (err, result) {
            res.send({})
    })
})


app.listen(5001)