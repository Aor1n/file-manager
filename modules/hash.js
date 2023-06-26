import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

import { catchMessage, getCmdValues } from '../helpers.js'

const handleHash = async (inputMessage) => {
    const [filePath] = getCmdValues(inputMessage)

    try {
        const data = await readFile(filePath)

        const result = createHash('sha256').update(data).digest('hex')

        console.log(result)
    } catch {
        catchMessage()
    }
}

export {
    handleHash
}
