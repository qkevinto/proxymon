import { Card } from './card'
import { generate } from './generate'
import { decklistParser } from './tcg-decklist-parser'
import fs from 'fs'

console.log('Proxymon: Pokémon TCG Proxy Deck Generator\n')

async function main() {
    try {
        const rawDecklist = await fs.promises.readFile('./decklist', 'utf8')
        const tcgDecklist = await decklistParser(rawDecklist)
        const groupedCards: Card[] = tcgDecklist.cards
            .map(card => [parseInt(card?.amount || '0'), card?.ptcgoio.id || '', card?.name || ''])
        const rawConfiguration = await fs.promises.readFile('./config.json', 'utf8')
        const configuration = JSON.parse(rawConfiguration)
        await generate(configuration, groupedCards)
    } catch (err) {
        console.error(err)
    }
}

main()
