import { cpus, EOL, userInfo } from 'node:os'
import { arch, cwd } from 'node:process'

import { catchMessage, getCmdValues } from '../helpers.js'
import { FLAG } from '../consts.js'

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

export {
    handleOs
}
