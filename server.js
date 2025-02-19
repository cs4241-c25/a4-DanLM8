const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');

const app = express();

const url = "mongodb+srv://dlmastrobuono:8eAJkeJlxbjBPRkR@a3.8x4iz.mongodb.net/";
const dbconnect = new MongoClient(url);
let tasks = null;

async function run() {
    await dbconnect.connect().then(() => console.log("Connected!"));
    tasks = await dbconnect.db("TaskManager").collection("Tasks");

    tasks.find().toArray();
    app.use(express.static('build'))
    app.use(express.json());


    app.get('/tasks', async (req, res) => {
        try {
            const results = await tasks.find().toArray(); 
            res.json(results);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ error: "Failed to fetch tasks" });
        }
    });

    app.post('/submit', async (req, res) => {
        const daysLeft = req.body.daysLeft;
        let priority = 1;
            if (daysLeft <= 2) {
                priority = 3;
            }
            else if (daysLeft > 2 && daysLeft < 6) {
                priority = 2;
            }
            else if (daysLeft >= 6) {
                priority = 1;
            }
        const newTask = {
            taskName: req.body.taskName,
            daysLeft: req.body.daysLeft,
            priority: priority,
            id: req.body.id
        }
        console.log(req.body)
        tasks.insertOne(newTask);
        const results = await tasks.find().toArray()
        res.send(results);
        
    });

    app.post('/delete', async (req, res) => {
        console.log(req.body.id)
        const taskId = req.body.id;
        await tasks.deleteOne({_id: ObjectId.createFromHexString(taskId)});
        const results = await tasks.find().toArray()
        res.send(results)
    })
}
run()
app.listen(process.env.PORT || 3000);