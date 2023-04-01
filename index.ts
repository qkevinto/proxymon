import { generate } from './libs/generate'
import fs from 'fs'

console.log('Proxymon: Pokémon TCG Proxy Deck Generator\n')

async function main() {
    try {
        const rawConfiguration = await fs.promises.readFile('./config.json', 'utf8')
        const configuration = JSON.parse(rawConfiguration)
        await generate(configuration)
    } catch (err) {
        console.error(err)
    }
}

main()
