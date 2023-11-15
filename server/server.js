import express from 'express'
import bodyParser from "body-parser";
import sqlite3 from "sqlite3"

sqlite3.verbose()
const db = new sqlite3.Database('database.db')
const app = express();
app.use(bodyParser.json())

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
        const id = this.lastID

        db.run("UPDATE parcours SET maze_id = ? WHERE id = ?", [id, id])
        db.run("INSERT INTO maze VALUES(?, 0, 0, true, true, true, true)", id)

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

app.get("/maze/:id", (req, res) => {
    const id = req.params.id

    db.all("SELECT * FROM maze WHERE maze_id = ?", id, (err, rows) => {
        console.log(err)
        console.log(id)
        res.send(rows)
    })
})

app.post("/maze/:id", (req, res) => {

})

app.listen(5001)