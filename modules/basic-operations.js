import { resolve } from 'node:path'
import { createReadStream, createWriteStream } from 'node:fs'
import { stdout } from 'node:process'
import { rename, rm, unlink, writeFile } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'

import { catchMessage, getCmdValues } from '../helpers.js'

const handleCat = async (inputMessage) => {
    const [pathToResolve] = getCmdValues(inputMessage)
    const resolvedPath = resolve(pathToResolve)

    try {
        const reader = createReadStream(resolvedPath, { encoding: 'utf8' })

        reader.pipe(stdout)
    } catch {
        catchMessage()
    }
}

const handleAdd = async (inputMessage) => {
    const [pathToResolve] = getCmdValues(inputMessage)
    const resolvedPath = resolve(pathToResolve)

    try {
        await writeFile(resolvedPath, '')
    } catch {
        catchMessage()
    }
}

const handleRn = async (inputMessage) => {
    const [oldPath, newPath] = getCmdValues(inputMessage)

    try {
        await rename(oldPath, newPath)
    } catch {
        catchMessage()
    }
}

const handleCp = async (inputMessage) => {
    const [filePath, copyPath] = getCmdValues(inputMessage)

    try {
        const reader = createReadStream(filePath)
        const writer = createWriteStream(copyPath)

        await pipeline(reader, writer)
    } catch {
        catchMessage()
    }
}

const handleMv = async (inputMessage) => {
    const [fileToMove] = getCmdValues(inputMessage)

    try {
        await handleCp(inputMessage)

        await unlink(fileToMove)
    } catch {
        catchMessage()
    }
}

const handleRm = async (inputMessage) => {
    const [filePath] = getCmdValues(inputMessage)

    try {
        await rm(filePath)
    } catch {
        catchMessage()
    }
}

export {
    handleCat,
    handleAdd,
    handleRn,
    handleCp,
    handleMv,
    handleRm
}
