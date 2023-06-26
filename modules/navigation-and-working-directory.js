import { dirname, resolve } from 'node:path'
import { chdir, cwd } from 'node:process'
import { readdir } from 'node:fs/promises'

import { catchMessage, getCmdValues } from '../helpers.js'

const handleUp = () => {
    const parentDirectory = dirname(cwd())
    chdir(parentDirectory)
    console.log(cwd())
}

const handleCd = (inputMessage) => {
    const [directory] = getCmdValues(inputMessage)

    try {
        chdir(directory)
        console.log(`You are currently in ${resolve()}`)
    } catch {
        catchMessage()
    }
}

const handleLs = async () => {
    const COLUMN_NAME = {
        NAME: 'Name',
        TYPE: 'Type'
    }

    try {
        const data = await readdir(cwd(), { withFileTypes: true })

        const folders = []
        const files = []

        data.forEach(i => {
            if (i.isDirectory()) {
                folders.push({ [COLUMN_NAME.NAME]: i.name, [COLUMN_NAME.TYPE]: 'directory' })
            } else {
                files.push({ [COLUMN_NAME.NAME]: i.name, [COLUMN_NAME.TYPE]: 'file' })
            }
        })

        folders.sort((a, b) => {
            return a[COLUMN_NAME.NAME].localeCompare(b[COLUMN_NAME.NAME], undefined, { sensitivity: 'base' })
        })
        files.sort((a, b) => {
            return a[COLUMN_NAME.NAME].localeCompare(b[COLUMN_NAME.NAME], undefined, { sensitivity: 'base' })
        })

        const result = folders.concat(files)

        console.table(result)
    } catch {
        catchMessage()
    }
}

export {
    handleUp,
    handleCd,
    handleLs
}
