// implement your API here
const express = require('express');
const db = require('./data/db')

const server = express();

server.use(express.json());

server.get( '/api/users', async (req, res) => {
    try {
        const users = await db.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "The users information could not be retrieved." })
    }
});

server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await db.findById(req.params.id)
        if(!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        else {
            res.status(200).json(user);
        }
    } catch {
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
    
})

server.post('/api/users', async (req, res) => {
    const user = req.body;
    console.log(req.body, res.params);
    if (!user) {
        res.status(400).json({errorMessage: "Please provide user information for adding"});
        return;
    }
    if (!user.name || !user.bio) {
        res.status(400).json({errorMessage: "Please provide name and bio for the user"});
        return;
    }
    else {
        try {
            idObject = await db.insert(user);
            newUser = await db.findById(idObject.id);
            res.status(201).json(newUser);
        } catch(error) {
            res.status(500).json("error: There was an error while saving the user to the database");
        }
    }
    
})

server.delete('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    user = await db.findById(id);
    if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
    else {
        try {
            const count = await db.remove(id);
            res.status(202).json(`user ${id} successfully deleted`);
        } catch(error) {
            res.status(500).json({ error: "The user could not be removed" });
        }
    }

})

server.put('/api/users/:id', async (req, res) => {
    const user = await db.findById(req.params.id);
    if(!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
        return;
    }
    if(!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        return;
    }

    try {
        const updatedUser = {"name": req.body.name, "bio": req.body.bio};
        const count = await db.update(req.params.id, updatedUser);
        savedUser = await db.findById(req.params.id);
        res.status(200).json(savedUser);

    } catch {
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
})



server.listen(8000, () => console.log('Server is listening'));

