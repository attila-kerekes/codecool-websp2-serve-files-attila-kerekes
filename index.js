//Serve data from JSON file

import express from "express";
import fs from "fs";

const app = express();

// Serve / Serve files

  //Client files
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Send data to server / Patch
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/pub', express.static(path.join(__dirname, 'client', 'public'))); //We use the use method with two arguments to serve the static files from the public directory. 

app.listen(3000, () => { //Finally, we use the app.listen() method to start the application and listen for incoming HTTP requests on port 3000.
    console.log(`Open this link in your browser: http://127.0.0.1:3000`); //The callback function specified as the second argument is executed once the server is up and running. It logs a message to the console with a link that can be used to access the web application in the browser.
});

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

// Serve / Serve files

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


//Send data to server / Form
app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

//Send data to server / Patch
app.patch('/users/:userId', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) throw err;

    const {users} = JSON.parse(data);
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);

    if (user) {
      user.name = req.body.name;

      fs.writeFile('./users.json', JSON.stringify({users}), (err) => {
        if (err) throw err;
      });
      
      res.send({state: "DONE"});
    } else {
      res.status(404).send({state: 'User not found'});
    }
  });
});

//Send data to server / Put
app.put('/users/:userId', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) throw err;

    const { users } = JSON.parse(data);
    const userId = parseInt(req.params.userId);
    const user = users.find((user) => user.id === userId);

    if (user) {
      user.name = req.body.name;
      user.id = req.body.id;

      fs.writeFile('./users.json', JSON.stringify({ users }), (err) => {
        if (err) throw err;
      });

      res.send({ state: "DONE" });
    } else {
      res.status(404).send({ state: 'User not found' });
    }
  });
});

//Send data to server / Delete
app.delete('/users/:userId', (req, res) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) throw err;

    const { users } = JSON.parse(data);
    const userId = parseInt(req.params.userId);
    const user = users.find(user => user.id === userId);

    if (user) {

      fs.writeFile('./users.json', JSON.stringify({ users: users.filter((x) => x !== user) }), (err) => {
        if (err) throw err;
      });

      res.send({ state: "DONE" });
    } else {
      res.status(404).send({ state: 'User not found' });
    }
  });
});

