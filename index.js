//Serve data from JSON file

import express from "express";
import fs from "fs";

const app = express();

//Client files
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/pub', express.static(path.join(__dirname, 'client', 'public'))); //We use the use method with two arguments to serve the static files from the public directory. 

app.get('/', (req, res) => { //We define a route for the root URL (/) and send the index.html file using the res.sendFile method. This method also takes the absolute path of the file as an argument.
  res.sendFile(path.join(__dirname, 'client', 'index.html')); //The file paths are defined using the path.join method, which takes the directory name and the file name as arguments and returns the absolute path of the file. We use the __dirname variable to get the absolute path of the current directory.
});

app.get('/users', (req, res) => { //This code creates an Express.js web server with two endpoints: /users
    fs.readFile('./users.json', 'utf8', (err, data) => { //The first endpoint serves all users data
        if (err) throw err;
        const users = JSON.parse(data).users;
        res.send(users);
    });
});

//Find the user by id

app.get('/users/:userId', (req, res) => { //and /users/:userId. the second endpoint serves data for a specific user based on their user ID.
    fs.readFile('./users.json', 'utf8', (err, data) => { //The fs.readFile method is used to read the user data from the users.json file. 
        if (err) throw err;
        const { users } = JSON.parse(data);
        const userId = parseInt(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ state: 'User not found' });
        }
    });
});

