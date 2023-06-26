const getCmdValues = (inputMessage, isCmdContained = false) => {
    if (isCmdContained) return inputMessage.split(' ')

    return inputMessage.split(' ').slice(1)
}

export {
    getCmdValues
}
