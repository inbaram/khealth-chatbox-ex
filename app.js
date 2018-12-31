const express = require('express')
const app = express()
const server = require('http').Server(app)
const port = 5000

const { isUserExistInCache, insertNewUser, restartUser,
    getNextQuestion, gotAnswer} = require('./functions')

server.listen(port, () => console.log(`KHealth server listing on port ${port}`))

app.get('/start', (req, res) => {
    res.send('Welcome to K-Health chatbot')
})

app.post('/start/new-user/:username', (req, res) => {
    const {username} = req.params

    if(!isUserExistInCache(username)) {
        insertNewUser(username)
        res.send(`Welcome ${username}! Let's begin with first question:`)
    } else {
        res.status(401).send('Error: username already exist in system.')
    }
})

app.post('/start/:username', (req, res) => {
    const {username} = req.params

    if(isUserExistInCache(username)) {
        restartUser(username)
        res.send(`Welcome ${username}! Let's begin with first question:`)
    } else {
        res.status(404).send("Error: username doesn't exist in system.")
    }
})

app.get('/next-question/:username', (req, res) => {
    const {username} = req.params

    if(isUserExistInCache(username)) {
        const q = getNextQuestion(username)
        res.send(q)
    } else {
        res.status(404).send("Error: username doesn't exist in system.")
    }
})

app.post('/answer-question/:username', (req, res) => {
    const {username} = req.params
    const {answer} = req.query

    if(isUserExistInCache(username)) {
        try {
            let next = gotAnswer(username, answer)
            res.send(next)
        } catch(e) {
            res.status(404).send(e.message)
        }
    } else {
        res.status(404).send("Error: username doesn't exist in system.")
    }
})