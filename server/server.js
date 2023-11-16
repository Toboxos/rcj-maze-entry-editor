import express from 'express'
import bodyParser from "body-parser";
import sqlite3 from "sqlite3"
import cors from "cors"
import bcrypt from "bcrypt";
import session from "express-session"

const corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (req.header('Origin')) {
        // Reflect the request origin as the allowed origin
        corsOptions = { origin: req.header('Origin'), credentials: true };
    } else {
        corsOptions = { origin: false }; // Disable CORS for this request
    }
    callback(null, corsOptions); // Callback expects two parameters: error and options
};

sqlite3.verbose()
const db = new sqlite3.Database('database.db')
const app = express();
app.use(bodyParser.json())
app.use(cors(corsOptionsDelegate))
app.use(session({secret: "secret", resave: false, saveUninitialized: true}))

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).send('Not authenticated');
    }
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT id, password FROM users WHERE username = ?", username, async (err, row) => {
        if( err ) {
            res.status(401).send('Invalid credentials');
            return
        }

        bcrypt.compare(password, row.password, (err, authorized) => {
            if( !authorized ) {
                res.status(401).send('Invalid credentials');
                return
            }

            req.session.userId = row.id; // Create a session
            res.status(200).send('Logged in!');
        })
    })
})

app.get("/authorized", isAuthenticated, (req, res) => {
    res.status(200).send()
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            // Handle error - you might want to log it and/or send a response to the user
            console.error("Error in destroying session: ", err);
            res.status(500).send('Error logging out');
        } else {
            // Redirect to login page or send a success response
            res.status(200).send('Logged out');
        }
    });
});

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
    db.all(`SELECT * FROM schedules WHERE competition = ?`, id, (err, rows) => {
        res.send(rows)
    })
})

app.post("/competition/:id/schedule", (req, res) => {
    const id = req.params.id
    const data = req.body
    const team = data.team
    const parcour = data.parcour
    const time = data.time

    db.run("INSERT INTO schedules (competition, team, parcour, time, actions, score) VALUES (?, ?, ?, ?, ?, ?)",
        [id, team, parcour, time, "[]", 0],
        function (err, result) {
            res.send({})
    })
})

app.put("/competition/:comp/schedule/:id/scoring", (req, res) => {
    const id = req.params.id
    const data = req.body
    const actions = data.actions
    const score = data.score

    db.run("UPDATE schedules SET actions = ?, score = ? WHERE id = ?",
        [JSON.stringify(actions), score, id],
        function (err, result) {
            res.send({})
        })
})

app.delete("/competition/:comp/schedule/:id", (req, res) => {
    const id = req.params.id

    db.run("DELETE FROM schedules WHERE id = ?", id, function (err, result) {
        console.log(err)
        res.send({})
    })
})


app.listen(5001)