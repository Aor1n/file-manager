import { argv, chdir, cwd, stdin, stdout, exit } from 'node:process'
import { homedir } from 'node:os'
import { createInterface } from 'node:readline/promises'

import { COMMAND } from './consts.js'
import {
    handleUp,
    handleCd,
    handleLs,
    handleCat,
    handleAdd,
    handleRn,
    handleCp,
    handleMv,
    handleRm,
    handleOs,
    handleHash,
    handleCompress,
    handleDecompress
} from './commands.js'
import { getCmdValues } from './helpers.js'

const readLine = createInterface({ input: stdin, output: stdout })

stdin.setEncoding('utf-8')

const flags = argv.slice(2)

const username = flags.find(f => f.includes('username')).split('=')[1]

console.log(`Welcome to the File Manager, ${username}!`)

chdir(homedir())

console.log(`You are currently in ${cwd()}`)

readLine.on('line', async (data) => {
    const inputMessage = data.trim()
    const [cmd] = getCmdValues(inputMessage, true)

    if (cmd === COMMAND.EXIT) {
        readLine.close()
        exit()
    } else if (cmd === COMMAND.UP) {
        handleUp()
    } else if (cmd === COMMAND.CD) {
        handleCd(inputMessage)
    } else if (cmd === COMMAND.LS) {
        await handleLs()
    } else if (cmd === COMMAND.CAT) {
        await handleCat(inputMessage)
    } else if (cmd === COMMAND.ADD) {
        await handleAdd(inputMessage)
    } else if (cmd === COMMAND.RN) {
        await handleRn(inputMessage)
    } else if (cmd === COMMAND.CP) {
        await handleCp(inputMessage)
    } else if (cmd === COMMAND.MV) {
        await handleMv(inputMessage)
    } else if (cmd === COMMAND.RM) {
        await handleRm(inputMessage)
    } else if (cmd === COMMAND.OS) {
        await handleOs(inputMessage)
    } else if (cmd === COMMAND.HASH) {
        await handleHash(inputMessage)
    } else if (cmd === COMMAND.COMPRESS) {
        await handleCompress(inputMessage)
    } else if (cmd === COMMAND.DECOMPRESS) {
        await handleDecompress(inputMessage)
    } else {
        console.log('Invalid input')
        console.log(`You are currently in ${cwd()}`)
    }

    readLine.prompt()
})

readLine.prompt()

readLine.on('close', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`)
})
