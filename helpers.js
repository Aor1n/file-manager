import { cwd } from 'node:process'

const getCmdValues = (inputMessage, isCmdContained = false) => {
    if (isCmdContained) return inputMessage.split(' ')

    return inputMessage.split(' ').slice(1)
}

const catchMessage = () => {
    console.log('Operation failed')
    console.log(`You are currently in ${cwd()}`)
}

export {
    getCmdValues,
    catchMessage
}
