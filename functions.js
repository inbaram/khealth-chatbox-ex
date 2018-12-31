const protocol = require('./protocols/real_protocol.json')
let usersCache = {}

const isUserExistInCache = username => {
    return usersCache.hasOwnProperty(username)
}

const insertNewUser = username => {
    usersCache[username] = {
        nodeId: protocol.root,
        queue: [protocol.root],
    }
}

const restartUser = username => {
    usersCache[username].nodeId = protocol.root
    usersCache[username].queue = [protocol.root]
}

const getNextQuestion = username => {
    let {queue} = usersCache[username]
    let response = ''
    if(queue.length > 0) {
        let nodeId = queue[0]
        usersCache[username].nodeId = nodeId
        response = getQuestion(nodeId)
    } else {
        response = finishAndRetry(username)
    }

    return response
}

const getQuestion = nodeId => {
    const {text, options, multi} = protocol.nodes[nodeId]
    const opt = options.length > 0 ? `(${options.join(', ')})` : 'Enter free text.'
    const moreThenOne = multi == true ? ' Select all that apply' : ''

    return `${text} ${opt}${moreThenOne}`
}

const isThereQuestionToAnswer = username => {
    return usersCache[username].nodeId != ''
}

const gotAnswer = (username, answer) => {
    if(isThereQuestionToAnswer(username)) {
        const answerArr = checkAnswer(usersCache[username].nodeId, answer)
        if (answerArr.length > 0) {
            usersCache[username].queue.shift()
            addToQueue(username, answerArr)
            return getNextQuestion(username)
        } else {
            throw Error('Error: Something went wrong, might be wrong input.')
        }
    } else {
        throw Error("Error: Please start again the quest.")
    }
}

const checkAnswer = (nodeId, answer) => {
    const {options, multi} = protocol.nodes[nodeId]
    let isAnswerOk = true , result = []

    if(answer.replace(/\s/g, '').length == 0 || answer === ""){
        isAnswerOk = false
    } else if(options.length > 0) {
        result = multi ?
            answer.split(',').map(s => s.trim()).filter(s => s.length > 0) :
            [answer]

        result.map(a => !options.includes(a) ? isAnswerOk = false : null)
    } else {
        result = [answer]
    }

    return isAnswerOk ? result : []
}

const addToQueue = (username, answers) => {
    let {queue, nodeId} = usersCache[username]
    let res = []
    answers.map(a => {
        const edge = protocol.edges.find(e => e.source == nodeId && (e.text == a || e.text == ""))
        edge ? res.push(edge.target) : null
    })

    queue = queue.concat(res)
    if(queue.length > 1) {
        queue = [ ... new Set(queue.sort((a,b) => a-b))]
    }

    usersCache[username].queue = queue
}

const finishAndRetry = username => {
    usersCache[username].queue = []
    usersCache[username].nodeId = ''

    return 'Thank you for answering!'
}

module.exports = {
    isUserExistInCache,
    insertNewUser,
    restartUser,
    getNextQuestion,
    gotAnswer,
}