import { createBrotliCompress, createBrotliDecompress } from 'node:zlib'
import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

import { catchMessage, getCmdValues } from '../helpers.js'

const handleCompress = async (inputMessage) => {
    const [fileToCompress, compressedPath] = getCmdValues(inputMessage)

    try {
        const brotliCompress = createBrotliCompress()
        const reader = createReadStream(fileToCompress)
        const writer = createWriteStream(compressedPath)

        await pipeline(reader, brotliCompress, writer)
    } catch {
        catchMessage()
    }
}

const handleDecompress = async (inputMessage) => {
    const [fileToDecompress, filePath] = getCmdValues(inputMessage)

    try {
        const brotliDecompress = createBrotliDecompress()
        const reader = createReadStream(fileToDecompress)
        const writer = createWriteStream(filePath)

        await pipeline(reader, brotliDecompress, writer)
    } catch {
        catchMessage()
    }
}

export {
    handleCompress,
    handleDecompress
}
