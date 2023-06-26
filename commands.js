import { arch, chdir, cwd, stdout }  from 'node:process'
import { dirname, resolve }  from 'node:path'
import { cpus, EOL, userInfo }  from 'node:os'
import { readdir, readFile, rename, rm, unlink, writeFile }  from 'node:fs/promises'
import { createReadStream, createWriteStream }  from 'node:fs'
import { pipeline }  from 'node:stream/promises'
import { createHash }  from 'node:crypto'
import { createBrotliCompress, createBrotliDecompress }  from 'node:zlib'

import { FLAG }  from './consts.js'
import { getCmdValues }  from './helpers.js'

const catchMessage = () => {
    console.log('Operation failed')
    console.log(`You are currently in ${cwd()}`)
}

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

const handleOs = (inputMessage) => {
    const [flag] = getCmdValues(inputMessage)
    try {
        if (flag === FLAG.EOL) {
            console.log(`EOL: ${JSON.stringify(EOL)}`)
        } else if (flag === FLAG.CPUS) {
            console.log(`Overall CPUs: ${cpus().length}`)

            cpus().forEach((cpu, index) => {
                const clockRateGHz = (cpu.speed / 1000).toFixed(2)
                console.log(`CPU ${index + 1}: ${cpu.model} (Clock rate: ${clockRateGHz} GHz)`)
            })
        } else if (flag === FLAG.HOMEDIR) {
            console.log(userInfo().homedir)
        } else if (flag === FLAG.USERNAME) {
            console.log(userInfo().username)
        } else if (flag === FLAG.ARCHITECTURE) {
            console.log(arch)
        } else {
            console.log('Invalid input')
            console.log(`You are currently in ${cwd()}`)
        }
    } catch {
        catchMessage()
    }

}

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
}
