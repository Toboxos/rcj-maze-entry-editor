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
    console.log("delete parcour "+ id)

    db.run("DELETE FROM parcours WHERE id = ?", id, (err, _) => {
        if( err === null ) {
            res.send({})
        }
    })
})


app.listen(5001)