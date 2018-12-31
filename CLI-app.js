const protocol = require('./protocols/real_protocol.json')
const standard_input = process.stdin;
standard_input.setEncoding('utf-8');

let cache = {
    nodeId: ''
}
let queue = []

const startApp = () => {
    console.log('Welcome!')
    cache.nodeId = protocol.root
    printQuestion(protocol.root)
}

const printQuestion = nodeId => {
    const {text, options, multi} = protocol.nodes[nodeId]
    const opt = options.length > 0 ? `(${options.join(', ')})` : 'Enter free text.'
    const moreThenOne = multi == true ? ' Select all that apply' : ''

    console.log(`${text} ${opt}${moreThenOne}`)
}

const checkAnswer = answer => {
    const {options, multi} = protocol.nodes[cache.nodeId]
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

const addToQueue = answers => {
    let res = []
    answers.map(a => {
        const edge = protocol.edges.find(e => e.source == cache.nodeId && (e.text == a || e.text == ""))
        edge ? res.push(edge.target) : null
    })

    queue = queue.concat(res)
    if(queue.length > 1) {
        queue = [ ... new Set(queue.sort((a,b) => a-b))]
    }
}

const getNextQuestion = () => {
    if(queue.length > 0) {
        let nodeId = queue[0]
        queue.shift()
        cache.nodeId = nodeId
        printQuestion(cache.nodeId)
    } else {
        finishAndRetry()
    }
}

const finishAndRetry = () => {
    cache.nodeId = ''
    console.log('Thank you for answering!')
    console.log('Please press exit - to exist.')
    console.log('Please press start - to start over.')
}

standard_input.on('data', data => {
    data = data.replace(/\n/g,'')
    if (data === 'exit') {
        process.exit();
    } else if(data === 'start') {
        startApp()
    } else if(cache.nodeId === '') {
        finishAndRetry()
    } else {
        const answer = checkAnswer(data)
        if(answer.length > 0) {
            addToQueue(answer)
            getNextQuestion()
        } else {
            console.log('Error: Something went wrong, might be wrong input.')
            printQuestion(cache.nodeId)
        }

    }
})

startApp()
